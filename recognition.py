from PIL import Image, ImageOps
from tensorflow.keras.models import load_model
import numpy as np
import matplotlib.pyplot as plt
import pickle

size = (28, 28)

model = load_model('doodle_model.h5')
with open('classes.pkl', 'rb') as handle:
    classes = pickle.load(handle)
    classes_reverse = {k:v for v,k in classes.items()}

def predict_from_image(img):
     prediction = model.predict(np.array([img.reshape((*size, 1))]))
     index = np.argmax(prediction)
     return prediction

# https://codepen.io/martin42/pen/aZBBOX