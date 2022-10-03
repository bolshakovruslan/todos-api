"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCompletedTasks = exports.checkAllTasks = exports.getTasks = exports.onBlurTask = exports.changeValueTask = exports.editTask = exports.checkTask = exports.deleteTask = exports.addTask = void 0;
const mongodb_1 = require("mongodb");
const connect_1 = require("../mongo/connect");
const constants_1 = require("../constants/constants");
const ObjectID = mongodb_1.default.ObjectID;
exports.addTask = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let collection;
    connect_1.mongo((db) => {
        collection = db.collection(constants_1.CONSTANTS.DBNAME);
    });
    const { body } = ctx.request;
    collection.insertOne({
        text: JSON.parse(body),
        active: false,
        edit: false,
    });
    const tasks = yield collection.find({}).toArray();
    ctx.body = JSON.stringify(tasks);
});
exports.deleteTask = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let collection;
    connect_1.mongo((db) => {
        collection = db.collection(constants_1.CONSTANTS.DBNAME);
    });
    const { body } = ctx.request;
    const request = JSON.parse(body);
    yield collection.deleteOne({ _id: ObjectID(request) });
    const updatedTasks = yield collection.find({}).toArray();
    ctx.body = JSON.stringify(updatedTasks);
});
exports.checkTask = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let collection;
    connect_1.mongo((db) => {
        collection = db.collection(constants_1.CONSTANTS.DBNAME);
    });
    const { body } = ctx.request;
    const request = JSON.parse(body);
    const tasks = yield collection.find({}).toArray();
    tasks.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
        if (ObjectID(item._id).equals(request)) {
            yield collection.updateOne({ _id: ObjectID(request) }, { $set: { active: !item.active } });
        }
    }));
    const updatedTasks = yield collection.find({}).toArray();
    ctx.body = JSON.stringify(updatedTasks);
});
exports.editTask = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let collection;
    connect_1.mongo((db) => {
        collection = db.collection(constants_1.CONSTANTS.DBNAME);
    });
    const { body } = ctx.request;
    const request = JSON.parse(body);
    const tasks = yield collection.find({}).toArray();
    tasks.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
        if (ObjectID(item._id).equals(request)) {
            yield collection.updateOne({ _id: ObjectID(request) }, { $set: { edit: !item.edit } });
        }
    }));
    const updatedTasks = yield collection.find({}).toArray();
    ctx.body = JSON.stringify(updatedTasks);
});
exports.changeValueTask = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let collection;
    connect_1.mongo((db) => {
        collection = db.collection(constants_1.CONSTANTS.DBNAME);
    });
    const { body } = ctx.request;
    const request = JSON.parse(body);
    const tasks = yield collection.find({}).toArray();
    tasks.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
        if (ObjectID(item._id).equals(request.id)) {
            yield collection.updateOne({ _id: ObjectID(request.id) }, { $set: { edit: false, text: request.text } });
        }
    }));
    const updatedTasks = yield collection.find({}).toArray();
    ctx.body = JSON.stringify(updatedTasks);
});
exports.onBlurTask = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let collection;
    connect_1.mongo((db) => {
        collection = db.collection(constants_1.CONSTANTS.DBNAME);
    });
    const { body } = ctx.request;
    const request = JSON.parse(body);
    yield collection.updateOne({ _id: ObjectID(request) }, { $set: { edit: false } });
    const updatedTasks = yield collection.find({}).toArray();
    ctx.body = JSON.stringify(updatedTasks);
});
exports.getTasks = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let collection;
    connect_1.mongo((db) => {
        collection = db.collection(constants_1.CONSTANTS.DBNAME);
    });
    const tasks = yield collection.find({}).toArray();
    ctx.body = JSON.stringify(tasks);
});
exports.checkAllTasks = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let collection;
    connect_1.mongo((db) => {
        collection = db.collection(constants_1.CONSTANTS.DBNAME);
    });
    const tasks = yield collection.find({}).toArray();
    const allTasksActive = tasks.every((item) => item.active);
    yield collection.updateMany({}, { $set: { active: !allTasksActive } });
    const updatedTasks = yield collection.find({}).toArray();
    ctx.body = JSON.stringify(updatedTasks);
});
exports.clearCompletedTasks = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let collection;
    connect_1.mongo((db) => {
        collection = db.collection(constants_1.CONSTANTS.DBNAME);
    });
    yield collection.deleteMany({ active: true });
    const updatedTasks = yield collection.find({}).toArray();
    ctx.body = JSON.stringify(updatedTasks);
});
//# sourceMappingURL=routerHandlers.js.map