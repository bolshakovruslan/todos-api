"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongo = void 0;
const constants_1 = require("../constants/constants");
const mongodb_1 = require("mongodb");
const MongoClient = mongodb_1.default.MongoClient;
const mongoClient = new MongoClient(`mongodb://${constants_1.CONSTANTS.HOSTNAME}:27017/`, { useNewUrlParser: true, useUnifiedTopology: true });
let callback, db;
mongoClient.connect((err, client) => {
    if (err) {
        console.log(err);
    }
    console.log("Connected successfully to database");
    db = client.db(constants_1.CONSTANTS.DBNAME);
    callback(db);
});
exports.mongo = (cb) => {
    if (typeof db !== 'undefined') {
        cb(db);
    }
    else {
        callback = cb;
    }
};
//# sourceMappingURL=connect.js.map