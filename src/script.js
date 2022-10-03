import { CONSTANTS } from './constants/constants'
import { END_POINTS } from './constants/endPoints'
import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-body-parser'
import { router } from './router/index'
import { mongo } from './mongo/connect'
import { 
  addTask,
  deleteTask,
  checkTask,
  editTask,
  changeValueTask,
  onBlurTask,
  getTasks,
  checkAllTasks,
  clearCompletedTasks,
} from './router/routerTodos'
import { 
  signUp,
  signIn
} from './router/routerAuth'

const app = new Koa()

app
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(async ctx => ctx.body = 'server is working')
  
router
  .post(END_POINTS.SIGN_UP, (ctx) => signUp(ctx))
  .post(END_POINTS.SIGN_IN, (ctx) => signIn(ctx))
  .post(END_POINTS.ADD, (ctx) => addTask(ctx))
  .post(END_POINTS.DELETE, (ctx) => deleteTask(ctx))
  .post(END_POINTS.CHECK, (ctx) => checkTask(ctx))
  .post(END_POINTS.EDIT, (ctx) => editTask(ctx))
  .post(END_POINTS.CHANGE_VALUE, (ctx) => changeValueTask(ctx))
  .post(END_POINTS.BLUR, (ctx) => onBlurTask(ctx))
  .get(END_POINTS.TASKS, (ctx) => getTasks(ctx))
  .get(END_POINTS.CHECK_ALL, (ctx) => checkAllTasks(ctx))
  .get(END_POINTS.CLEAR_COMPLETED, (ctx) => clearCompletedTasks(ctx))


const connectToDB = () => {
  let collectionUsers
  let collectionTasks
  mongo((db) => {
    collectionUsers = db.collection(CONSTANTS.USERS_COLLECTION)
    collectionTasks = db.collection(CONSTANTS.TASKS_COLLECTION)
  })
}

const runServer = () => {
  connectToDB()
  app.listen(CONSTANTS.PORT, () => {
    console.log('server is running')
  })
}

runServer()

