const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/college')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));


module.exports = mongoose;

