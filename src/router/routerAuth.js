import { mongo } from '../mongo/connect'
import { CONSTANTS } from '../constants/constants'
import { REGISTRATION, LOGIN } from '../constants/responseText'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signUp = async (ctx) => {
    let collectionUsers

    mongo((db) => {
        collectionUsers = db.collection(CONSTANTS.USERS_COLLECTION)
    })
    
    const { body } = ctx.request
    const parsedBody = JSON.parse(body)
    const cryptedPassword = await bcrypt.hash(parsedBody.password, 10)

    const candidate = await collectionUsers.findOne({username: parsedBody.username})
    if (candidate) {
        return ctx.body = JSON.stringify({text: REGISTRATION.FAILED})
    } else {
        await collectionUsers.insertOne({
            username: parsedBody.username,
            password: cryptedPassword
        })
    
        ctx.body = JSON.stringify({status: 200, text: REGISTRATION.SUCCESS, username: parsedBody.username, password: parsedBody.password})
    }
}

export const signIn = async (ctx) => {
    let collectionUsers

    mongo((db) => {
        collectionUsers = db.collection(CONSTANTS.USERS_COLLECTION)
    })
    
    const { body } = ctx.request
    const parsedBody = JSON.parse(body)

    const user = await collectionUsers.findOne({username: parsedBody.username})
    if (!user) {
        return ctx.body = JSON.stringify({status: 400, text: LOGIN.FAILED_NOT_FOUND, token: null })
    }

    const isMatch = await bcrypt.compare(parsedBody.password, user.password)
    if (!isMatch) {
        return ctx.body = JSON.stringify({status: 400, text: LOGIN.FAILED_WRONG_PASS, token: null })
    }
    
    const token = jwt.sign(
        { userID: user._id },
        'todo',
        {expiresIn: '5h'}
    )

    ctx.body = JSON.stringify({status: 200, text: LOGIN.SUCCESS, token })
}