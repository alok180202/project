import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('codereviewassistant.analyzeCode', async () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const codeSnippet = editor.document.getText(editor.selection);

            if (!codeSnippet.trim()) {
                vscode.window.showErrorMessage("Please select some code to analyze.");
                return;
            }

            vscode.window.showInformationMessage("Analyzing your code...");

            try {
                const response = await axios.post('http://127.0.0.1:5000/analyze', {
                    code: codeSnippet
                });

                const suggestions = response.data.suggestions.join("\n");
                vscode.window.showInformationMessage("Code Analysis Complete!");
                vscode.window.showInformationMessage(suggestions);

                // Display suggestions in a new output channel
                const outputChannel = vscode.window.createOutputChannel("Code Review Suggestions");
                outputChannel.appendLine("Suggestions:");
                outputChannel.appendLine(suggestions);
                outputChannel.show();
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage("Error analyzing code: " + error.message);
                } else {
                    vscode.window.showErrorMessage("An unknown error occurred.");
                }
            }
            
        } else {
            vscode.window.showErrorMessage("No active editor found.");
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
