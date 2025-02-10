import * as vscode from "vscode";
import axios from "axios";

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Code Review Assistant");

  context.subscriptions.push(
    vscode.commands.registerCommand("codereviewassistant.analyzeCurrentFile", async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
      }

      const code = editor.document.getText(); // Get the code from the current file

      // Clear previous output and initialize loading animation
      outputChannel.clear();
      outputChannel.show();
      outputChannel.appendLine("### Code Review Assistant ###");
      outputChannel.appendLine("Analyzing your code...");
      outputChannel.appendLine(" ");

      // Simulate a loading spinner
      let loading = true;
      const spinner = setInterval(() => {
        if (loading) outputChannel.append(".");
      }, 500);

      try {
        // Send the code to the backend for analysis
        const response = await axios.post("http://52.66.240.193:5000/analyze", { code });



        const { corrected_code, suggestions } = response.data;

        // Stop the loading spinner
        clearInterval(spinner);
        loading = false;

        // Display the results
        outputChannel.appendLine("\n");
        outputChannel.appendLine("### Optimal Code ###\n");
        outputChannel.appendLine(corrected_code.replace(/^```.*\n|```$/g, "")); // Remove markdown code block markers
        outputChannel.appendLine("\n");

        outputChannel.appendLine("### Suggestions ###");
        suggestions.forEach((suggestion: string, index: number) =>
          outputChannel.appendLine(`\n${index + 1}. ${suggestion.replace(/^\*\s\*\*/, "").replace(/\*\*$/, "")}`)
        );

        outputChannel.appendLine("\n### End of Output ###");
      } catch (error) {
        clearInterval(spinner);
        loading = false;
        outputChannel.appendLine("\nError analyzing the code. Please check if the backend is running.");
        console.error(error);
      }
    })
  );
}

export function deactivate() {}
