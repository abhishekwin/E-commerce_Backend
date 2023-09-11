const getTodos = require('./getuser');
// const getTodo = require('./get-todo');
const createTodo = require('./createuser');
const loginUser = require('./loginUser');
// const updateTodo = require('./update-todo');
// const deleteTodo = require('./delete-todo');

module.exports = {
    paths:{
        '/user/get_users':{
            ...getTodos,
        },
        '/user/sign_up':{
            ...createTodo
        },
        '/user/login':{
            ...loginUser
        }
        // '/todos/{id}':{
        //     ...getTodo,
        //     ...updateTodo,
        //     ...deleteTodo
        // }
    }
}