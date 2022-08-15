const { generatePrompt } = require('./lambda.prompt');
const { createFile, getFile, writeJson, fileExists } = require('../helpers/file.helper');
const { capitalCase, upperCase, upperCaseFirst } = require('text-case');

module.exports.lambdaAction = async(name, opts) => {
    const config = await generatePrompt(name, opts);

    createLambda(config);
    updateModule(config);
    updateScripts(config);
    createSchema(config);
    createValidator(config);
}

const createLambda = async(config) => {
    const {resolver, tsSupport, fileName, lambdaModule, functionName, lambdaMethod} = config;
    const extension = tsSupport ? 'ts' : 'js';
    const method = lambdaMethod ? lambdaMethod.toLowerCase() : 'get';

    createFile(
        `./lambda/templates/${resolver}.${extension}.hbs`,
        `./lambdas/${lambdaModule}/${fileName}.${extension}`,
        { 
            functionName, lambdaModule, extension, fileName,
            interfaceName: capitalCase(lambdaModule),
            validatorName: (method == 'post' || method == 'put') 
                ? (upperCaseFirst(fileName) + upperCaseFirst(lambdaModule) + 'Validator')
                : null
        }
    );
}

const createValidator = async(config) => {
    const { lambdaModule, lambdaMethod, fileName, tsSupport } = config;
    const extension = tsSupport ? 'ts' : 'js';

    const input = `./lambda/templates/validator.${extension}.hbs`;
    const output = `./validators/${lambdaModule}/${fileName}.validator.${extension}`;

    const method = lambdaMethod.toLowerCase();
    if(!fileExists(output) && (method == 'post' || method == 'put')) {
        createFile(input, output, { 
            functionName: upperCaseFirst(fileName) + upperCaseFirst(lambdaModule)
        });
    }
}

const createSchema = async(config) => {
    const { tsSupport, lambdaModule, useSchema } = config;
    const extension = tsSupport ? 'ts' : 'js';
    const input = `./lambda/templates/schema.${extension}.hbs`;
    
    const tsOutput = `./schemas/${lambdaModule}.schema.ts`;
    const jsOutput = `./schemas/${lambdaModule}.schema.js`;
    const output = tsSupport ? tsOutput : jsOutput;

    if(useSchema && !fileExists(tsOutput) && !fileExists(jsOutput)) {
        createFile(input, output, { 
            interfaceName: capitalCase(lambdaModule),
            lambdaModule
        });
    }
}

const updateModule = async(config) => {
    const {lambdaModule, fileName, lambdaMethod, functionName, useAuth} = config;

    const modulePath = `modules/${lambdaModule}.json`;
    let content = getFile(modulePath);

    if(!content) {
       content = { functions: {} }; 
    }

    if(lambdaMethod == 'websocket') {
        let route = fileName;
        if(['connect', 'disconnect', 'default'].includes(route)) {
            route = '$'+fileName;
        }

        content.functions[`${functionName}`] = {
            handler: `${lambdaModule}/${fileName}.handler`,
            events: [{
                websocket: {
                    route: route
                }
            }]
        }
    } else {
        const http = {
            http: {
                path: `${lambdaModule}/${fileName}`,
                method: lambdaMethod,
                cors: true
            }
        }

        if(useAuth && useAuth != 'none') {
            http.http.authorizer = useAuth;
        }

        content.functions[`${functionName}`] = {
            handler: `${lambdaModule}/${fileName}.handler`,
            events: [http]
        }
    }

    writeJson(modulePath, content);
}

const updateScripts = async(config) => {
    const {lambdaModule} = config;
    const packagePath = './package.json';
    let content = getFile(packagePath);

    content.scripts[`dev:${lambdaModule}`] = `sls offline -s local --param=${lambdaModule}`;
    writeJson(packagePath, content);
}