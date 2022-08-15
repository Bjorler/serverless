import Ajv from "ajv";
const ajv = new Ajv();

export const Validate = (validator?: Object) => {

    const before = async(request: any) => {
        
        if(!validator) {
            return;
        }

        const valid = ajv.compile(validator);
        const data = request.event.body;
        const check = valid(data);

        if(!check && valid.errors) {
            const errorList = valid.errors.map(message => {
                return `${message.instancePath} ${message.message}`.trim();
            })         
            throw { scode: 'validation', sdebug: errorList }
        }
    }

    return {
        before,
    }
}