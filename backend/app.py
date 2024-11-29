import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)
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

        # Generate content (analyze the code snippet)
        response = model.generate_content(
            f"Analyze the following code snippet and provide suggestions for improvement:\n\n{code_snippet}\n\nSuggestions:"
        )

        # Extract and split the response into suggestions
        suggestions = response.text.split("\n")

        # Return suggestions to the frontend
        return jsonify({"suggestions": suggestions})

    except Exception as e:
        # Log and return the error
        app.logger.error(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
