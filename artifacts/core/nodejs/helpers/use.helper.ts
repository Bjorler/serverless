import middy from "@middy/core";

export const Use = (handler: any) => {
    return middy(handler);
}