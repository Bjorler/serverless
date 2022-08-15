const fs = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');
const yaml = require('js-yaml');

module.exports.createFile = (input, output, data) => {
    const templateStr = fs.readFileSync(path.resolve(__dirname, `../${input}`)).toString('utf8')
    const template = hbs.compile(templateStr)   
    const outputPath = path.resolve(process.cwd(), output);

    if(!fs.pathExistsSync(outputPath)) {
        fs.outputFileSync(path.resolve(process.cwd(), `${output}`), template(data));
    } 
    // else {
    //     console.log('Ya existe un archivo con ese nombre:', output);
    // }
}

module.exports.getFile = (name) => {
    const filePath = path.resolve(process.cwd(), name);
    
    if(fs.pathExistsSync(filePath)) {
        return fs.readJsonSync(filePath);
    } else {
        return null;
    }
}

module.exports.writeJson = (name, content) => {
    const filePath = path.resolve(process.cwd(), name)
    fs.outputJsonSync(filePath, content, { spaces: 2 })
}

module.exports.readYml = (input) => {
    const ymlPath = path.resolve(process.cwd(), input);
    const file = fs.readFileSync(ymlPath, 'utf8');
    return yaml.load(file);
}

module.exports.fileExists = (file) => {
    const filePath = path.resolve(process.cwd(), file);
    return fs.pathExistsSync(filePath)
}

module.exports.updateYml = (input, content) => {
    
}