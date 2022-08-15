const inquirer = require('inquirer');
const fg = require('fast-glob');
const { lowerCase, camelCase, paramCase } = require('text-case');

const functionName = {
    type: 'input',
    name: 'functionName',
    message: 'Name your lambda function'
}

const lambdaMethod = {
    type: 'list',
    name: 'lambdaMethod',
    message: 'Select your lambda method event',
    default: 'get',
    loop: false,
    choices: ['get', 'post', 'put', 'delete', 'websocket']
}

const tsSupport = {
    type: 'confirm',
    name: 'tsSupport',
    message: 'Enable Typescript Support?',
    default: true
}

const resolver = {
    type: 'list',
    name: 'resolver',
    message: 'Select your lambda resolver',
    default: 'mongoose',
    choices: [
        'mongoose',
        'mongoose-s3',
        'mongoose-socket',
        'none'
    ]
}

const schema = {
    type: 'confirm',
    name: 'schema',
    message: 'Would you like to import the schema?',
    default: true
}

const auth = {
    type: 'list',
    name: 'auth',
    message: 'Do you want to protect your lambda function?',
    default: 'none',
    choices: ['none']
}

module.exports.generatePrompt = async(name, opts) => {
    let questions = [];

    if(!name) {
        questions.push(functionName);
    }

    if(!opts?.m && !opts?.method) {
        questions.push(lambdaMethod);
    }

    if(!opts?.t && !opts?.typescript) {
        questions.push(tsSupport);
    }

    if(!opts?.a && !opts?.auth) {
        await createAuthChoices();
        questions.push(auth);
    }

    questions.push(resolver);

    return await inquirer.prompt(questions).then(async answers => {
        const newFunctionName = camelCase(name ?? answers.functionName);
        const words = newFunctionName.split(/(?=[A-Z])/);
        const lambdaModule = words[words.length - 1];

        let fileName = '';
        for (let index = 0; index < words.length - 1; index++) {
            fileName += words[index];
        }

        
        let useSchema = false;
        if(answers.resolver.includes('mongoose') 
            && (!opts?.s && !opts?.schema)) {
            useSchema = await inquirer.prompt([schema]).then(useSchema => {
                return useSchema.schema;
            });
        }

        const method = answers.lambdaMethod ?? opts?.m ?? opts?.method;

        return {
            functionName: newFunctionName,
            fileName: paramCase(fileName),
            lambdaModule: lowerCase(lambdaModule),
            lambdaMethod: typeof method === 'boolean' ? 'get' : method,
            resolver: answers.resolver,
            tsSupport: (opts?.t || opts.typescript) ?? answers.tsSupport,
            useSchema: (opts?.s || opts.schema) ?? useSchema,
            useAuth: answers.auth ?? 'tokenAuthorizer'
        }
    }).catch(err => {
        console.log(err);
    })
}

const createAuthChoices = async() => {
    const include = ['auth/*.{ts,js}'];
    const stream = fg.stream(include);

    for await (const entry of stream) {
        let option = entry.replace('auth/', '')
            .replace('.ts', '').replace('.js', '');
        auth.choices.push(camelCase(option));
    }
}