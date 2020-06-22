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