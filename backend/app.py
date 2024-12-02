import os
import re
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv
import google.generativeai as genai
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Path to the React build directory (within the VS Code extension)
BUILD_DIR = os.path.join(os.path.dirname(__file__), "../vscode-extension/codereviewassistant/webview")

# Create the Flask app with static folder and template folder for React
app = Flask(__name__, static_folder=os.path.join(BUILD_DIR, "static"), template_folder=BUILD_DIR)
CORS(app)

# Configure the generative AI client with the API key
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# Load the model
model_name = "gemini-1.5-flash"
model = genai.GenerativeModel(model_name=model_name)

@app.route('/analyze', methods=['POST'])
def analyze_code():
    try:
        # Get the code snippet from the request
        data = request.get_json()
        code_snippet = data.get("code")

        if not code_snippet:
            return jsonify({"error": "No code snippet provided"}), 400

        # Step 1: Get only the optimal corrected code
        response_code = model.generate_content(
            f"Analyze the following code snippet and provide only the corrected and optimal code in response:\n\n{code_snippet}\n\nCorrected Code:"
        )

        # Extract corrected code from the response using regex
        corrected_code = re.sub(r"```.*?\n|```", "", response_code.text).strip()

        # Step 2: Get the suggestions for improvement
        response_suggestions = model.generate_content(
            f"Analyze the following code snippet and provide suggestions for improvement strictly in points:\n\n{code_snippet}\n\nSuggestions:"
        )

        # Extract suggestions from the response and split into a list
        suggestions = [s.strip() for s in response_suggestions.text.strip().split("\n") if s]

        # Return both corrected code and suggestions to the frontend
        return jsonify({
            "corrected_code": corrected_code,
            "suggestions": suggestions
        })

    except Exception as e:
        # Log and return the error
        app.logger.error(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

# Route to serve the React app
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(BUILD_DIR, path)):
        return send_from_directory(BUILD_DIR, path)
    else:
        return send_from_directory(BUILD_DIR, "index.html")


if __name__ == '__main__':
    app.run(debug=True)
