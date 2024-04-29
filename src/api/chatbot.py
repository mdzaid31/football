from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import json
import numpy as np
import pickle
import nltk
from nltk import WordNetLemmatizer
import tensorflow as tf
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "*"]}})

# Load necessary data and models for chatbot
lemmatizer = WordNetLemmatizer()
words = pickle.load(open('C:/Users/HomePC/Desktop/football/src/api/words.pkl', 'rb'))
classes = pickle.load(open('C:/Users/HomePC/Desktop/football/src/api/classes.pkl', 'rb'))
intents = json.loads(open('C:/Users/HomePC/Desktop/football/src/api/intents.json').read())
model = tf.keras.models.load_model('C:/Users/HomePC/Desktop/football/src/api/chatbot_model.keras')

# Load the model for prediction
model_prediction = joblib.load("C:/Users/HomePC/Desktop/football/src/model.pkl")

# Functions for processing messages for chatbot
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]], 'probability': str(r[1])})
    return return_list

def get_response(intents_list, intents_json):
    if not intents_list:
        # If no intent is recognized, return a default response
        return "I'm sorry, I didn't understand that.\n Is there anything else I can assist you with?"
    tag = intents_list[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            result = random.choice(i['responses'])
            break
    return result

# API endpoint for receiving and responding to messages for chatbot
@app.route('/api/chatbot', methods=['POST'])
def chatbot_response():
    user_message = request.json.get('message')
    predicted_intents = predict_class(user_message)
    response = get_response(predicted_intents, intents)
    return jsonify({'response': response})

# API endpoint for making predictions
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
    result = model_prediction.predict(input_data)

    # Return prediction as JSON
    return jsonify({'result': result[0]})

if __name__ == '__main__':
    app.run(debug=True)
