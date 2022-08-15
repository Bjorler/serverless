import hbs from "nodemailer-express-handlebars";

export const hbsTemplate = (route: string) => {
    return hbs({
        viewEngine: {
            extname: ".handlebars",
            partialsDir: route,
            layoutsDir: route,
            defaultLayout: false
        },
        viewPath: route,
        extName: '.handlebars'
    });
}