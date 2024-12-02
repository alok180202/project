import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("codereviewassistant.analyzeCurrentFile", () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
      }

      const code = editor.document.getText(); // Get the code from the current file

      // Create and show the webview panel
      const panel = vscode.window.createWebviewPanel(
        "codeReviewAssistant",
        "Code Review Assistant",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(
              path.join(context.extensionPath, "webview", "static")
            )
          ]
        }
      );

      // Set the HTML content for the webview
      panel.webview.html = getWebviewContent(panel.webview, context.extensionPath);

      // Post the code to the webview
      setTimeout(() => {
        panel.webview.postMessage({ type: "analyzeCode", code });
      }, 500);
    })
  );
}

function getWebviewContent(webview: vscode.Webview, extensionPath: string): string {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.file(
      path.join(extensionPath, "webview", "static", "js", "main.408d26ab.js")
    )
  );

  const cssUri = webview.asWebviewUri(
    vscode.Uri.file(
      path.join(extensionPath, "webview", "static", "css", "main.1b1a381a.css")
    )
  );

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Code Review Assistant</title>
      <link rel="stylesheet" href="${cssUri}">
      <script>
        const vscode = acquireVsCodeApi();
        window.addEventListener('message', (event) => {
          if (event.data.type === 'analyzeCode') {
            console.log('Code received in webview:', event.data.code);
          }
        });
      </script>
    </head>
    <body>
      <div id="root"></div>
      <script src="${scriptUri}"></script>
    </body>
    </html>
  `;
}

export function deactivate() {}
