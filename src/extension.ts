import * as vscode from 'vscode';
import {toClass} from './model';

function replaceCode() {
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	for (const selection of editor.selections) {
		const selectionText = editor.document.getText(selection);
		const classCode = toClass(selectionText);
		editor.edit(builder => {
			builder.delete(selection);
			builder.insert(selection.anchor, classCode);
		});
	}
}

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('javascript-prototype-to-class.toClass', replaceCode);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
