import hbs from 'nodemailer-express-handlebars';

export * from 'nodemailer';
export const handlebars = hbs;
export * from './helpers/template.helper'

export * from "generate-password";
export * from "./helpers/createPassword";