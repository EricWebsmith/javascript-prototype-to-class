import * as vscode from 'vscode';
import { Classifier } from './prototype_to_class';

function replaceCode() {
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	for (const selection of editor.selections) {
		const selectionText = editor.document.getText(selection);
		const classifier_ = new Classifier();
		const classCode = classifier_.toClass(selectionText);
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

export function deactivate() { }
