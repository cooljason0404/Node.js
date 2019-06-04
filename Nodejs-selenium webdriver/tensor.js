var tf = require('@tensorflow/tfjs');
var model = tf.sequential();

var tensor_input = tf.input(48, 140, 3);
model.add(tf.layers.conv2d({
    inputShape: tensor_input,
    kernel_size: [3, 3],
    filters: 32,
    padding: 'same',
    activation: 'relu'
}),tf.layers.BatchNormalization({

}),tf.layers.MaxPooling2D({
    poolSize: [2, 2],
}),tf.layers.dropout({
    rate: 0.3
}));

model.add(tf.layers.conv2d({
    inputShape: tensor_input,
    kernel_size: [3, 3],
    filters: 64,
    padding: 'same',
    activation: 'relu'
}),tf.layers.BatchNormalization({

}),tf.layers.MaxPooling2D({
    poolSize: [2, 2],
}),tf.layers.dropout({
    rate: 0.3
}));

model.add(tf.layers.conv2d({
    inputShape: tensor_input,
    kernel_size: [3, 3],
    filters: 128,
    padding: 'same',
    activation: 'relu'
}),tf.layers.BatchNormalization({

}),tf.layers.MaxPooling2D({
    poolSize: [2, 2],
}),tf.layers.dropout({
    rate: 0.3
}));

model.add(tf.layers.conv2d({
    inputShape: tensor_input,
    kernel_size: [3, 3],
    filters: 256,
    padding: 'same',
    activation: 'relu'
}),tf.layers.BatchNormalization({

}),tf.layers.MaxPooling2D({
    poolSize: [2, 2],
}),tf.layers.flatten({

}),tf.layers.dropout({
    rate: 0.3
}));

model.add(tf.layers.dense({
    units : 34,
    name : 'digit1',
    activation : 'softmax'
}),tf.layers.dense({
    units : 34,
    name : 'digit2',
    activation : 'softmax'
}),tf.layers.dense({
    units : 34,
    name : 'digit3',
    activation : 'softmax'
}),tf.layers.dense({
    units : 34,
    name : 'digit4',
    activation : 'softmax'
}),tf.layers.dense({
    units : 34,
    name : 'digit5',
    activation : 'softmax'
}),tf.layers.dense({
    units : 34,
    name : 'digit6',
    activation : 'softmax'
}));

var adam = tf.train.adam();
model.compile({
    optimizer: adam,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
});
model.summary();