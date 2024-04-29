import random
import json
import pickle
import numpy as np
import tensorflow as tf

import nltk
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()

intents = json.loads(open('C:/Users/HomePC/Desktop/football/src/api/intents.json').read())

words = []
classes = []
documents = []
ignoreLetters = ['?', '!', '.', ',']


for intent in intents['intents']:
    for pattern in intent['patterns']:
        wordList = nltk.word_tokenize(pattern)
        words.extend(wordList)
        documents.append((wordList, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])
words = [lemmatizer.lemmatize(word.lower()) for word in words if word not in ignoreLetters]

words = sorted(set(words))
classes = sorted(set(classes))

pickle.dump(words, open('C:/Users/HomePC/Desktop/football/src/api/words.pkl', 'wb'))
pickle.dump(classes, open('C:/Users/HomePC/Desktop/football/src/api/classes.pkl', 'wb'))

training = []
outputEmpty = [0] * len(classes)

for document in documents:
    bag = []
    wordPatterns = document[0]
    wordPatterns = [lemmatizer.lemmatize(word.lower()) for word in wordPatterns]
    for word in words:
        bag.append(1) if word in wordPatterns else bag.append(0)
    outputRow = list(outputEmpty)
    outputRow[classes.index(document[1])] = 1
    training.append(bag + outputRow)

random.shuffle(training)

training = np.array(training)
trainX = training[:, :len(words)]
trainY = training[:, len(words):]


model = tf.keras.Sequential()
model.add(tf.keras.layers.Dense(256, input_shape=(len(trainX[0]),), activation = 'relu'))
model.add(tf.keras.layers.Dropout(0.1))
model.add(tf.keras.layers.Dense(64, activation = 'relu'))
model.add(tf.keras.layers.Dropout(0.001))
model.add(tf.keras.layers.Dense(64, activation = 'relu'))
model.add(tf.keras.layers.Dropout(0.0001))
model.add(tf.keras.layers.Dense(64, activation = 'relu'))
model.add(tf.keras.layers.Dropout(0.01))
model.add(tf.keras.layers.Dense(len(trainY[0]), activation='softmax'))

nadam = tf.keras.optimizers.Nadam(learning_rate=0.001)
model.compile(loss='categorical_crossentropy', optimizer=nadam, metrics=['accuracy'])
model.fit(trainX, trainY, epochs=300, batch_size=1000,verbose=1) 
model.save('C:/Users/HomePC/Desktop/football/src/api/chatbot_model.keras')

print('Done')