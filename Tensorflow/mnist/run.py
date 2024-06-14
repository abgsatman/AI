import tensorflow as tf
from tensorflow.keras import layers, models, datasets
import matplotlib.pyplot as plt

# MNIST veri kümesini yükle
(train_images, train_labels), (test_images, test_labels) = datasets.mnist.load_data()

# Görüntüleri normalize et (0-1 aralığına getir)
train_images, test_images = train_images / 255.0, test_images / 255.0

# CNN modelini tanımla
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Model özetini yazdır
model.summary()

# Modeli eğit
history = model.fit(train_images[..., tf.newaxis], train_labels, epochs=5, validation_data=(test_images[..., tf.newaxis], test_labels))

# Eğitim sürecini görselleştir
plt.plot(history.history['accuracy'], label='accuracy')
plt.plot(history.history['val_accuracy'], label='val_accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.ylim([0.5, 1])
plt.legend(loc='lower right')
plt.show()

# Modeli kaydet
model.save('mnist_cnn_model.h5')
print("Model kaydedildi.")
