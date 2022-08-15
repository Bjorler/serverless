'use strict';
const path = require('path');
const fs = require('fs-extra');
const fg = require('fast-glob');
const { camelCase } = require('text-case');

class SetModules {
    serverless;
    module;

    constructor(serverless, options) {
        this.serverless = serverless;
        if(Array.isArray(options.param)) {
            this.module = options.param[0];
        }

        this.hooks = {
            initialize: () => this.init(),
        };
    }

    async init() {
        const authFunctions = await addAuthorizers();

        if(this.module) {
            const filePath = path.resolve(process.cwd(), `modules/${this.module}.json`);
            let jsonFile = fs.readJsonSync(filePath);
            
            // jsonFile = addSchema(jsonFile);
            jsonFile.functions = {...jsonFile.functions, ...authFunctions};

            this.serverless.service.functions = jsonFile.functions;
        } else {
            const include = ['modules/*.json'];
            const stream = fg.stream(include);

            let newFunctions = {}
            for await (const entry of stream) {
                const filePath = path.resolve(process.cwd(), entry);
                let jsonFile = fs.readJsonSync(filePath);
                // jsonFile = addSchema(jsonFile);

                newFunctions = {...newFunctions, ...jsonFile.functions};
            }

            newFunctions = {...newFunctions, ...authFunctions};
            this.serverless.service.functions = newFunctions;
        }
    }
}

const addAuthorizers = async () => {
    const include = ['auth/*.{ts,js}'];
    const stream = fg.stream(include);

    let authFunctions = {};
    for await (const entry of stream) {
        let handler = entry.replace('.ts', '').replace('.js', '');
        let functionName = handler.replace('auth/', '');

        handler = '../' + handler + '.handler';
        functionName = camelCase(functionName);

        authFunctions[`${functionName}`] = { handler };
    }

    return authFunctions;
}

const addSchema = (jsonFile) => {
    for (const fun in jsonFile.functions) {
        const element = jsonFile.functions[fun];

        if(element.events) {
            const method = (element.events[0].http?.method ?? 'get').toLowerCase();

            if(method == 'post' || method == 'put') {
                const route = element.handler.replace('.handler', '');
                jsonFile.functions[fun].events[0].http.request = {
                    schema: {
                        'application/json': '${file(/validators/franchise/create.json)}'
                    }
                }
                console.log(jsonFile.functions[fun].events[0].http.request);
            }
        }
    }

    return jsonFile;
}

module.exports = SetModules;