const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const mongoUri = 'mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD +
    '@cluster0.u8ocy.mongodb.net/mongoDriverDemo?retryWrites=true&w=majority';


let _db;

const initDb = callback => {
    if (_db) {
        console.log('Database is already initialized!');
        return callback(null, _db);
    }

    mongoClient.connect(mongoUri)
        .then(client => {
            _db = client.db();
            callback(null, _db);
        })
        .catch(err => {
            callback(err);
        })
};

const getDb = () => {
    if (!_db) {
        throw Error('Database not initialized!');
    }
    return _db;
};

module.exports = {
    initDb,
    getDb
};