export class Classifier {
    className: string = '';
    oldCode: string = '';
    oldCtor: string = '';
    oldMethods: string[] = [];

    parseClassName() {
        const match1 = this.oldCode.match(/(var|let|const)\s*([a-zA-Z0-9]*)\s*=\s*function/);
        if (match1 !== null) {
            this.className = match1[2];
            return;
        }

        const match2 = this.oldCode.match(/function\s*([a-zA-Z0-9]+)\s\(/);
        if (match2 !== null) {
            this.className = match2[1];
            return;
        }
    }

    format(s: string) {
        return s.trim().replace(/^;/, '').replace(/;$/, '');
    }

    segment() {
        let closeAt = this.oldCode.indexOf('\n}');
        this.oldCtor = this.oldCode.substring(0, closeAt + 2);
        this.oldCtor = this.format(this.oldCtor);

        let previousCloseAt = closeAt;
        closeAt = this.oldCode.indexOf('\n}', closeAt + 3);
        while (closeAt > 0) {
            const methodCode = this.format(this.oldCode.substring(previousCloseAt + 4, closeAt + 3));
            this.oldMethods.push(methodCode);
            previousCloseAt = closeAt;
            closeAt = this.oldCode.indexOf('\n}', closeAt + 3);
        }
    }

    getComment(code: string, searchStart: number) {
        const commentStart = code.lastIndexOf('/**', searchStart);
        if (commentStart < 0) { return ''; }
        const commentEnd = code.indexOf('*/', commentStart);
        if (commentEnd < 0) { return ''; }
        return code.substring(commentStart, commentEnd + 2);
    }

    getBody(code: string, start: number) {
        const bodyStart = code.indexOf('{', start);
        const bodyEnd = code.indexOf('\n}', bodyStart);
        const body = code.substring(bodyStart, bodyEnd + 2);
        return body;
    }

    indent(codeBlock: string) {
        let indented = codeBlock.replace(/\n/g, '\n    ');
        indented = indented.replace(/\n\s+\n/g, '\n\n');
        return indented;
    }

    getParams(code: string, start: number) {
        const openAt = code.indexOf('(', start);
        const closeAt = code.indexOf(')', openAt);
        return code.substring(openAt + 1, closeAt).trim();
    }

    getNewCtor() {
        const classNameAt = this.oldCtor.indexOf(this.className);
        const params = this.getParams(this.oldCtor, classNameAt);
        const comment = this.getComment(this.oldCtor, classNameAt);
        const body = this.getBody(this.oldCtor, classNameAt);

        let newctorComment = comment.replace(/\n/g, '\n    ');
        if (newctorComment !== '') {
            newctorComment += '\n    ';
        }

        let newCtor = `${newctorComment}constructor(${params}) ${this.indent(body)}`;
        return newCtor;
    }

    getNewMethod(methodCode: string): (string | null) {
        const methodPrefix = `${this.className}.prototype.`;
        const methodAt = methodCode.indexOf(methodPrefix);
        if (methodAt === -1) {
            return null;
        }
        const equalAt = methodCode.indexOf('=', methodAt);
        const methodName = methodCode.substring(methodAt + methodPrefix.length, equalAt).trim();
        const params = this.getParams(methodCode, equalAt);
        const comment = this.getComment(methodCode, methodAt);
        const body = this.getBody(methodCode, methodAt);

        let newctorComment = comment.replace(/\n/g, '\n    ');
        if (newctorComment !== '') {
            newctorComment += '\n    ';
        }
        return `${newctorComment}${methodName}(${params}) ${this.indent(body)}`;
    }

    toClass(oldCode: string): string {
        if (oldCode === '' || oldCode === null || oldCode === undefined) {
            return oldCode;
        }
        this.oldCode = oldCode;
        this.parseClassName();
        this.segment();
        const newCtor = this.getNewCtor();
        let newCode = `
class ${this.className} {
    ${newCtor}
`;

        for (const oldMethod of this.oldMethods) {
            const newMethod = this.getNewMethod(oldMethod);
            if (newMethod === null) {
                continue;
            }

            newCode += `
    ${newMethod}
`;

        }

        newCode += `}\n`;

        return newCode;
    }
}
