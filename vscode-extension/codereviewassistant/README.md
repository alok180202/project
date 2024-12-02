# CodeReviewAssistant

CodeReviewAssistant is an AI-powered code review tool designed as a Visual Studio Code extension. It assists developers in analyzing and improving their code by offering optimal corrections and actionable suggestions.

---

## 🚀 Features

- **Code Analysis**: Analyze the currently open file for potential issues and improvements.
- **Optimal Code Suggestions**: Receive the best version of your code after analysis.
- **Actionable Feedback**: Get recommendations for enhancements such as better error handling, variable naming, modularity, and more.
- **Integrated Output**: Displays analysis results directly in the VS Code Output tab.

---

## 📋 Requirements

- **Backend**: Flask-based Python backend running at `http://127.0.0.1:5000`.
- **Frontend**: React-based webview files integrated within the extension.
- **Environment**:
  - **Node.js** (for extension development and builds)
  - **Python 3.8+** (for backend API)
  - **Dependencies**:
    - Flask
    - Axios (for extension-backend communication)

---

## 🛠️ Installation

### Step-by-Step Instructions:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/alok180202/project.git
2. **Install backend dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
3. **Install extension dependencies**:
   ```bash
   cd ../vscode-extension
   npm install
4. **Start the backend server**:
   ```bash
   cd ../backend
   python app.py
5. **Launch the extension**:
   - Open the vscode-extension folder in Visual Studio Code.
   - Run the "Run Extension" command from the VS Code debug panel.

---
## 🖱️ Extension Commands
This extension contributes the following commands:
- codereviewassistant.analyzeCurrentFile: Analyzes the currently active file in the editor.
---
## ⚠️ Known Issues
- Ensure the backend is running before using the extension. Otherwise, communication with the backend may fail.
- Output formatting issues might occur for non-standard code snippets.
---
## 📝 Release Notes
- **0.0.2**
  - Added Flask API backend integration.
  - Improved output formatting in the VS Code Output tab.
  - Fixed bugs in code suggestions.
- **0.0.1**
  - Initial release with core functionality.
---
## 📄 License
This project is licensed under the MIT License. See the LICENSE file for more details.

---
## 🌐 Repository

- [GitHub Repository](https://github.com/alok180202/project)
---


