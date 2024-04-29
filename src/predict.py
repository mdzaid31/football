import pandas as pd
import joblib
import sys

# Load the model
model = joblib.load("C:/Users/HomePC/Desktop/football/src/model.pkl")

# Parse input data
home_lineup = float(sys.argv[1])
away_lineup = float(sys.argv[2])

# Create a DataFrame for prediction
input_data = pd.DataFrame({
    'Home Average': [home_lineup],
    'Away Average': [away_lineup],
})

# Make prediction
result = model.predict(input_data)

# Print the prediction result
print(result[0])