const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

async function connect(uri, dbname) {
    try {
        const client = await MongoClient.connect(uri);
        console.log("Connected to MongoDB");
        return client.db(dbname);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

module.exports = { connect };