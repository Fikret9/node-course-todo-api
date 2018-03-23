const {mongoose} = require ('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');
 
 // DELET ALL returns how many removed
 // Todo.remove({}).then((result) => {
 // 	console.log(result);
 // });


 // Todo.findOneAndRemove()

 Todo.findByIdAndRemove('5ab45a5257613c6f868d7c39').then((todo) =>{
 	console.log(todo);
 });

 Todo.findOneAndRemove({_id: '5ab45a5257613c6f868d7c39'}).then((todo)=>{
 	console.log(todo);
 });