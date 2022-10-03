import { CONSTANTS } from '../constants/constants'
import { default as mongodb } from 'mongodb'
const MongoClient = mongodb.MongoClient
const mongoClient = new MongoClient(`mongodb://${CONSTANTS.HOSTNAME}:27017/`, { useNewUrlParser: true, useUnifiedTopology: true })
let callback, db

mongoClient.connect((err, client) => {
    if (err) {
      console.log(err)
    }
      
    console.log("Connected successfully to database")
       
    db = client.db(CONSTANTS.DBNAME)
    callback(db)
})

export const mongo = (cb) => {
  if (typeof db !== 'undefined') {
    cb(db)
  } else { 
    callback = cb
  }
}

