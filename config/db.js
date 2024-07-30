const mongoose = require("mongoose");
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async (mongoosexd = mongoose) => {
    try {
        await mongoosexd.connect(db, {
        });
        console.log('MongoDB Conectado...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
