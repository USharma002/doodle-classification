import json 
import numpy as np
import re
from io import BytesIO
import base64 
from PIL import Image, ImageOps
from flask import Flask, render_template, url_for, request, jsonify, make_response
import sys
import recognition
import matplotlib.pyplot as plt
from image_utils import crop_image

app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template("home.html")

@app.route("/predict", methods=['POST', 'GET'])
def hook():
    image_data = re.sub('^data:image/.+;base64,', '', request.form['imageBase64'])
    im = Image.open(BytesIO(base64.b64decode(image_data)))
    im = crop_image( ImageOps.grayscale(im) )
    img = np.asarray(ImageOps.grayscale(im).resize((28, 28), Image.NEAREST)).reshape((28, 28, 1))

    predictions = recognition.predict_from_image(img/255)

    if not img.any():
        predictions = [[0]*len(recognition.classes_reverse)]
    mp = {}
    for i in range(len(recognition.classes_reverse)):
        mp[recognition.classes_reverse[i]] = str(predictions[0][i])
    return json.dumps(mp)


if __name__ == '__main__':
    app.run(debug=True)