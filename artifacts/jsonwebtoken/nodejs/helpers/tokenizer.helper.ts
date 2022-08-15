import { decode, verify } from "jsonwebtoken";

export const tokenizer = (token: string, secretKey: string) => {

    const error1000 = {
        error: 1000,
        message: "Don't forget to send a value for the token"
    };

    if(!token) {
        throw error1000;
    }

    const tokenParts = token.split(' ');
    const tokenValue = tokenParts[1];

    if(tokenParts[0].toLowerCase() != 'bearer' || !tokenValue) {
        throw error1000;
    }

    const decoded = verify(tokenValue, secretKey);
    
    if(!decoded) {
        throw {
            error: 1001,
            message: 'Token is not valid'
        };
    }

    return decoded;
}