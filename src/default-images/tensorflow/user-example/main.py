import tensorflow as tf
import numpy as np
from tensorflow.keras import Model, layers

# MNIST dataset parameters.
num_classes = 10 # 0 to 9 digits
num_features = 784 # 28*28

# Training parameters.
learning_rate = 0.01
training_steps = 1000
batch_size = 256
display_step = 100



# Prepare MNIST data.
from tensorflow.keras.datasets import mnist
(x_train, y_train), (x_test, y_test) = mnist.load_data()
# Convert to float32.
x_train, x_test = np.array(x_train, np.float32), np.array(x_test, np.float32)
# Flatten images to 1-D vector of 784 features (28*28).
x_train, x_test = x_train.reshape([-1, num_features]), x_test.reshape([-1, num_features])
# Normalize images value from [0, 255] to [0, 1].
x_train, x_test = x_train / 255., x_test / 255.

# Use tf.data API to shuffle and batch data.
train_data = tf.data.Dataset.from_tensor_slices((x_train, y_train))
train_data = train_data.repeat().shuffle(5000).batch(batch_size).prefetch(1)

# Create TF Model.
class NeuralNet(Model):
    # Set layers.
    def __init__(self):
        super(NeuralNet, self).__init__(name="NeuralNet")
        # First fully-connected hidden layer.
        self.fc1 = layers.Dense(64, activation=tf.nn.relu)
        # Second fully-connected hidden layer.
        self.fc2 = layers.Dense(128, activation=tf.nn.relu)
        # Third fully-connecter hidden layer.
        self.out = layers.Dense(num_classes, activation=tf.nn.softmax)

    # Set forward pass.
    def __call__(self, x, is_training=False):
        x = self.fc1(x)
        x = self.out(x)
        if not is_training:
            # tf cross entropy expect logits without softmax, so only
            # apply softmax when not training.
            x = tf.nn.softmax(x)
        return x

# Build neural network model.
neural_net = NeuralNet()



# Cross-Entropy loss function.
def cross_entropy(y_pred, y_true):
    y_true = tf.cast(y_true, tf.int64)
    crossentropy = tf.nn.sparse_softmax_cross_entropy_with_logits(labels=y_true, logits=y_pred)
    return tf.reduce_mean(crossentropy)

# Accuracy metric.
def accuracy(y_pred, y_true):
    # Predicted class is the index of highest score in prediction vector (i.e. argmax).
    correct_prediction = tf.equal(tf.argmax(y_pred, 1), tf.cast(y_true, tf.int64))
    return tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

# Adam optimizer.
optimizer = tf.optimizers.Adam(learning_rate)

# Optimization process. 
def run_optimization(x, y):
    # Wrap computation inside a GradientTape for automatic differentiation.
    with tf.GradientTape() as g:
        pred = neural_net(x, is_training=True)
        loss = cross_entropy(pred, y)

        # Compute gradients.
        gradients = g.gradient(loss, neural_net.trainable_variables)

        # Update W and b following gradients.
        optimizer.apply_gradients(zip(gradients, neural_net.trainable_variables))



# Run training for the given number of steps.
for step, (batch_x, batch_y) in enumerate(train_data.take(training_steps), 1):
    # Run the optimization to update W and b values.
    run_optimization(batch_x, batch_y)
    
    if step % display_step == 0:
        pred = neural_net(batch_x, is_training=False)
        loss = cross_entropy(pred, batch_y)
        acc = accuracy(pred, batch_y)
        print("step: %i, loss: %f, accuracy: %f" % (step, loss, acc))



# Save TF model.
neural_net.save_weights(filepath="results/tfmodel.ckpt")



# Re-build neural network model with default values.
neural_net = NeuralNet()
# Test model performance.
pred = neural_net(batch_x)
print("accuracy: %f" % accuracy(pred, batch_y))

# Load saved weights.
neural_net.load_weights(filepath="results/tfmodel.ckpt")



# Test that weights loaded correctly.
pred = neural_net(batch_x)
print("accuracy: %f" % accuracy(pred, batch_y))

