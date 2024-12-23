const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
            .then(() => {
              console.log('MongoDB connected');
            })
            .catch((err) => {
              console.error('MongoDB connection error:', err);
            });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
