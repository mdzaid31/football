# src/api/predict.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Load the model
model = joblib.load("/model.pkl")

@app.route('/api/predict', methods=['POST'])
def predict():
    # Get data from request
    data = request.get_json()
    home_lineup = float(data['home_lineup'])
    away_lineup = float(data['away_lineup'])

    # Create DataFrame for prediction
    input_data = pd.DataFrame({
        'Home Average': [home_lineup],
        'Away Average': [away_lineup],
    })

    # Make prediction
    result = model.predict(input_data)

    # Return prediction as JSON
    return jsonify({'result': result[0]})

if __name__ == '__main__':
    app.run(debug=True)
