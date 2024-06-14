import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

def load_image(filepath):
    img = Image.open(filepath).convert('L')  # Load image and convert to grayscale
    img = img.resize((28, 28))  # Resize image to 28x28 pixels
    img = np.array(img)  # Convert image to numpy array
    img = img.reshape((1, 28, 28, 1))  # Reshape image for model input
    img = img / 255.0  # Normalize pixel values
    return img

def main():
    model = tf.keras.models.load_model('mnist_cnn_model.h5')  # Load trained model

    # Replace '4.jpg' with your image file path
    input_image = load_image('4.jpg')

    # Perform prediction
    predictions = model.predict(input_image)
    predicted_class = np.argmax(predictions)

    print(f'Prediction: {predicted_class}')

if __name__ == "__main__":
    main()
