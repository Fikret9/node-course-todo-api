
var express = require('express');
var bodyParser = require('body-parser');

//local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/User');

const {ObjectID} = require('mongodb');
const port = process.env.PORT || 3000;


var app = express();
app.use(bodyParser.json());

//SETTING ROUTES

app.post('/todos',(req,res) => {
	var todo = new Todo({
		text: req.body.text
	});
	
	todo.save().then((doc) => {
		res.send(doc);
	},(e) => {
		res.status(400).send(e);
	});
});

app.get('/todos',(req,res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	},(e) =>{
		res.status(400).send(e);
	})
});

app.get('/todos/:id',(req,res) => {
	var id = req.params.id;
	console.log(id);

	if (!ObjectID.isValid(id)){
		   console.log('invalid object');
		   return res.status(404).send();
	}

	Todo.findById(id).then((todo) => {
		if(!todo) {
			  return status(404).send('not found !');
		}
		res.send({todo});
	 }).catch((e)  => {
	 	console.log('error '+e);
	 	res.status(400).send();
	 })
});

app.delete('/todos/:id',(req,res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)){
		console.log('invalid object');
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) =>{
		console.log(id + ' ' + todo);
		if (!todo) {
			  return status(404).send('not found !');
		}
		res.send({todo});
	}).catch((e) => {
		console.log(e);
		res.status(400).send();
	});
	// remove todo by id
	//success (if doc or no doc) or error 400 with empty body 

})



app.listen(port,() => {
	console.log(`Started on port ${port}`);
})
 
module.exports = {app};