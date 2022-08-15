import  generator  from 'generate-password';

export function createPassword() {
    let extension = Math.random() * (12 - 8) + 8;
    let password = generator.generate({
        length: extension,
        numbers: true,
        symbols: '#?!¿@(.)$=%^/&¡*-',
        lowercase: true,
        uppercase: true,
        strict: true,
    });

    return password;
}