import { default as mongodb } from 'mongodb'
import { mongo } from '../mongo/connect'
import { CONSTANTS } from '../constants/constants'
import { jwtDecode } from '../helpers/helpers'

const ObjectID = mongodb.ObjectID

export const addTask = async (ctx) => {
    let collectionTasks
    
    mongo((db) => {
        collectionTasks = db.collection(CONSTANTS.TASKS_COLLECTION)
    })
    
    const { body, headers } = ctx.request
    
    const token = jwtDecode(headers)

    await collectionTasks.insertOne({
        text: JSON.parse(body),
        active: false,
        edit: false,
        userID: token.userID
    })
  
    const tasks = await collectionTasks.find({userID: token.userID}).toArray()

    ctx.body = JSON.stringify(tasks)
}

export const deleteTask = async (ctx) => {
    let collectionTasks
    
    mongo((db) => {
        collectionTasks = db.collection(CONSTANTS.TASKS_COLLECTION)
    })
    
    const { body, headers } = ctx.request
    
    const token = jwtDecode(headers)
    const request = JSON.parse(body)
  
    await collectionTasks.deleteOne({_id: ObjectID(request)})
    const updatedTasks = await collectionTasks.find({userID: token.userID}).toArray()
  
    ctx.body = JSON.stringify(updatedTasks)
}

export const checkTask = async (ctx) => {
    let collectionTasks
    
    mongo((db) => {
        collectionTasks = db.collection(CONSTANTS.TASKS_COLLECTION)
    })

    const { body, headers } = ctx.request
    
    const token = jwtDecode(headers)
    const request = JSON.parse(body)
      
    const tasks = await collectionTasks.find({userID: token.userID}).toArray()
    tasks.forEach(async (item) => {
        if (ObjectID(item._id).equals(request)) {
          await collectionTasks.updateOne({_id: ObjectID(request)}, {$set: {active: !item.active}})
        }
    })

    const updatedTasks = await collectionTasks.find({userID: token.userID}).toArray()
  
    ctx.body = JSON.stringify(updatedTasks)
}

export const editTask = async (ctx) => {
    let collectionTasks
    
    mongo((db) => {
        collectionTasks = db.collection(CONSTANTS.TASKS_COLLECTION)
    })

    const { body, headers } = ctx.request
    
    const token = jwtDecode(headers)
    const request = JSON.parse(body)
      
    const tasks = await collectionTasks.find({userID: token.userID}).toArray()
    tasks.forEach(async (item) => {
        if (ObjectID(item._id).equals(request)) {
          await collectionTasks.updateOne({_id: ObjectID(request)}, {$set: {edit: !item.edit}})
        }
    })
      
    const updatedTasks = await collectionTasks.find({userID: token.userID}).toArray()
  
    ctx.body = JSON.stringify(updatedTasks)
}

export const changeValueTask = async (ctx) => {
    let collectionTasks
    
    mongo((db) => {
        collectionTasks = db.collection(CONSTANTS.TASKS_COLLECTION)
    })

    const { body, headers } = ctx.request
    
    const token = jwtDecode(headers)
    const request = JSON.parse(body)
  
    const tasks = await collectionTasks.find({userID: token.userID}).toArray()
      tasks.forEach(async (item) => {
        if (ObjectID(item._id).equals(request.id)) {
          await collectionTasks.updateOne({_id: ObjectID(request.id)}, {$set: {edit: false, text: request.text}})
        }
    })
      
    const updatedTasks = await collectionTasks.find({userID: token.userID}).toArray()
  
    ctx.body = JSON.stringify(updatedTasks)
}

export const onBlurTask = async (ctx) => {
    let collectionTasks
    
    mongo((db) => {
        collectionTasks = db.collection(CONSTANTS.TASKS_COLLECTION)
    })

    const { body, headers } = ctx.request
    
    const token = jwtDecode(headers)
    const request = JSON.parse(body)
  
    await collectionTasks.updateOne({_id: ObjectID(request)}, {$set: {edit: false}})
  
    const updatedTasks = await collectionTasks.find({userID: token.userID}).toArray()
  
    ctx.body = JSON.stringify(updatedTasks)
}

export const getTasks = async (ctx) => {
    let collectionTasks
    
    mongo((db) => {
        collectionTasks = db.collection(CONSTANTS.TASKS_COLLECTION)
    })

    const { headers } = ctx.request
    
    const token = jwtDecode(headers)

    const tasks = await collectionTasks.find({userID: token.userID}).toArray()
  
    ctx.body = JSON.stringify(tasks)
}

export const checkAllTasks = async (ctx) => {
    let collectionTasks
    
    mongo((db) => {
        collectionTasks = db.collection(CONSTANTS.TASKS_COLLECTION)
    })

    const { headers } = ctx.request
    
    const token = jwtDecode(headers)

    const tasks = await collectionTasks.find({userID: token.userID}).toArray()
    const allTasksActive = tasks.every((item) => item.active)
  
    await collectionTasks.updateMany({userID: token.userID}, {$set: {active: !allTasksActive}})
  
    const updatedTasks = await collectionTasks.find({userID: token.userID}).toArray()
  
    ctx.body = JSON.stringify(updatedTasks)
}

export const clearCompletedTasks = async (ctx) => {
    let collectionTasks

    mongo((db) => {
        collectionTasks = db.collection(CONSTANTS.TASKS_COLLECTION)
    })

    const { headers } = ctx.request

    const token = jwtDecode(headers)

    await collectionTasks.deleteMany({userID: token.userID, active: true})
  
    const updatedTasks = await collectionTasks.find({userID: token.userID}).toArray()
  
    ctx.body = JSON.stringify(updatedTasks)
}