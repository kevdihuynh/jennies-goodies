import * as _ from 'lodash';

export function placeHolderReplace(text: string, variables: { [key: string]: string | number}) {
    let modText: string = text;
    if (modText) {
        const variableArray = Object.keys(variables);
        variableArray.forEach((variableName) => {
           const replacer = '\\[\\[' + variableName + '\\]\\]';
           const replaceRegex = new RegExp(replacer, 'g');
           if (variables[variableName]) {
            modText = modText.replace(replaceRegex, variables[variableName].toString());
           } 
        });
    }
    return modText;
}

export const cors = function(request: any, response: any): void {
    const allowedOrigins: Array<String> = ['http://localhost:4200', 'https://www.ventrips.com', 'http://localhost:5001'];
    const origin: any = request.headers.origin;
    if (_.indexOf(allowedOrigins, origin) > -1) {
        response.setHeader('Access-Control-Allow-Origin', origin);
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    }
    return;
}