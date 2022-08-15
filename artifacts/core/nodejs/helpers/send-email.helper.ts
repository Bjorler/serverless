import { createTransport } from "nodemailer";
import hbs from "nodemailer-express-handlebars";

export interface EmailConfig {
    from: string
    to: string
    subject: string
    context: string
    template?: any
}

export const SendEmail = (config: EmailConfig) => {
    
}