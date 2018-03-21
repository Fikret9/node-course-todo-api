const {mongoose} = require ('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

var id = '5ab1b8352cf4e91af4f77072';
var userid = '5ab04695ac428b14407b821f';

if (!ObjectID.isValid(id)){
	return console.log('Id not valid');
}

Todo.find({
	_id: id
}).then((todos)=>{
	console.log('Todosfind',todos);
});

Todo.findOne({
	_id: id
}).then((todo)=>{
	console.log('Todofindone',todo);
});

Todo.findById(id) 
   .then((todo)=>{
   	if (!todo) {

   		return console.log('Id not found !');
   	}
	console.log('Todobyid',todo);
   }).catch((e) => console.log(e));


User.findById(userid)
    .then((user)=>{
    	if(!user) {
    		return console.log('User not found !');
    	}
    	console.log('User',user);
    }).catch((e)=>{
		console.log(e);
    });