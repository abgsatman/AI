import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf

#initialization opf tensors
x = tf.constant(4, shape=(1, 1), dtype = tf.float32)
print(x)
#math operations

#indexing