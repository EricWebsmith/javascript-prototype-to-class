export function toClass(code: string): string {
    const varAt = code.indexOf('var');
    const equalAt = code.indexOf('=', varAt);
    const className = code.substring(varAt + 3, equalAt).trim();
    const openAt = code.indexOf('(', equalAt);
    const closeAt = code.indexOf(')', openAt);
    const constructorParams = code.substring(openAt + 1, closeAt).trim();
    const commentStart = code.lastIndexOf('/**', varAt);
    const commentEnd = code.lastIndexOf('*/', varAt);
    const constructorComment = code.substring(commentStart, commentEnd+2);
    let newconstructorComment = constructorComment.replace(/\n/g, '\n    ');
    
    let newCode = `
class ${className} {
    ${newconstructorComment}
    constructor(${constructorParams}) {

    }
`;

    const methodPrefix = `${className}.prototype.`;
    let methodAt = code.indexOf(methodPrefix);
    while(methodAt>0) {
        const equalAt = code.indexOf('=', methodAt);
        const methodName = code.substring(methodAt+methodPrefix.length, equalAt).trim();
        const openAt = code.indexOf('(', methodAt);
        const closeAt = code.indexOf(')', methodAt);
        const methodParams = code.substring(openAt + 1, closeAt).trim();
        const methodCommentStart = code.lastIndexOf('/**', methodAt);
        const methodCommentEnd = code.lastIndexOf('*/', methodAt);
        const methodComment = code.substring(methodCommentStart, methodCommentEnd+2);
        let newMethodComment = methodComment.replace(/\n/g, '\n    ');
        newCode+=`
    ${newMethodComment}
    ${methodName}(${methodParams}) {

    }
`;
        methodAt = code.indexOf(methodPrefix, methodAt+methodPrefix.length);
    }

    newCode+=`}\n`;

    return newCode;
}
