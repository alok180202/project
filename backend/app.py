from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Route for analyzing code
@app.route('/analyze', methods=['POST'])
def analyze_code():
    data = request.json
    code_snippet = data.get('code', '')
    # Placeholder: Perform analysis (your AI model)
    suggestions = {"suggestions": ["Use better variable names", "Optimize this loop"]}
    return jsonify(suggestions)

# Route for getting suggestions
@app.route('/suggestions', methods=['GET'])
def get_suggestions():
    # Placeholder: Example of static suggestion
    suggestions = {"suggestions": ["Avoid nested loops", "Follow PEP8 standards"]}
    return jsonify(suggestions)

if __name__ == '__main__':
    app.run(debug=True)
