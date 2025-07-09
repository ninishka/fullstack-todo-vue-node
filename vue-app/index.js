import { createStore } from 'vuex'
import todos from './modules/todos'
import auth from './modules/auth'

export default createStore({
  modules: {
    todos,
    auth
  },
  strict: process.env.NODE_ENV !== 'production'
}) 