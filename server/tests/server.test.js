



const expect  = require ('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo') ;
const {ObjectID} = require('mongodb');
var bodyParser = require('body-parser');
const _  = require('lodash');


const todos = [{
	_id: new ObjectID(),
	text: 'first test todo' 
	},{
	_id: new ObjectID(),
	text: 'second test todo',
	completed: true,
	completedAt: 123	
	}];


beforeEach((done)=> {
	Todo.remove({}).then(() => {
		Todo.insertMany(todos);
	}).then(() => done());
	});

describe ('POST /todos',() => {
	
	it('should create a new todo',(done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text: text})
			.expect(200)
			.expect((res)=> {
				expect(res.body.text).toBe(text);
			})
			.end((err,res)=> {
				if (err) {
					return done(err);
				}
				Todo.find({text}).then((todos) =>{
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
		 });
	});


	it('should not create todo with invalid body data',(done) => {
		 
		request(app)
			.post('/todos')
			.send({})
			.expect(400) 
			.end((err,res)=> {
				if (err) {
					return done(err);
				}
				Todo.find().then((todos) =>{
					expect(todos.length).toBe(2);					
					done();
				}).catch((e) => done(e));
		 });
	});


});


describe ('GET /todos',() => {
	it('it should get all todos',(done) =>{
		request(app)		
			.get('/todos')
			.expect(200) 
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
		});
	})

describe ('GET /todos/:id',() => {
	it('it should return todo doc',(done) =>{
		request(app)		
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200) 
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
		});

	it('should return 404 if todo not found',(done) => {
		var newid = new ObjectID().toHexString;
		request(app)		
			.get(`/todos/${newid}`)
			.expect(404) 			
			.end(done);
		});

	it('should return 404 if todo not found',(done) => {
		var newid = new ObjectID();
		request(app)		
			.get(`/todos/123`)
			.expect(404) 			
			.end(done);
		});


	})

describe ('DELETE /todos/:id',() => {
	it('it should remove a todo ',(done) =>{
		var hexId = todos[1]._id.toHexString();
		request(app)
		  .delete(`/todos/${hexId}`)
		  .expect(200)
		  .expect((res) => {
		  	console.log('del:' +res.body.todo);
		  	expect(res.body.todo._id).toBe(hexId);
		  })
		  .end((err,res) => {
		  	if (err) {
		  		return done(err);
		  	}
		  	Todo.findById(hexId).then((todo) =>{
				expect(null).toNotExist();					
				done();
			}).catch((e) => done(e));
		  })
	});


  it('should return 404 if todo not found',(done) => {
		var newid = new ObjectID().toHexString;
		request(app)		
			.delete(`/todos/${newid}`)
			.expect(404) 			
			.end(done);
		});

	it('should return 404 if todo not found',(done) => {
		var newid = new ObjectID();
		request(app)		
			.delete(`/todos/123`)
			.expect(404) 			
			.end(done);
		});
});

describe ('UPDATE /todos/:id',() => {
	it('it should update todo ',(done) =>{
		var hexId = todos[0]._id.toHexString();
		var utext = '1st changed body'; 

		request(app)
		  .patch(`/todos/${hexId}`)
		  .send({text:utext,completed: true})
		  .expect(200)
		  .expect((res) => { 
		  	console.log(res.body.todo);
		  	expect(res.body.text).toBe(utext);
		  	expect(res.body.completed).toBe(true);
		  	expect(res.body.completedAt).toBeA('number');
		  })
		  .end((err,res) => {
		  	if (err) {
		  		console.log(err);
		  		return done(err);
		  	}
		  	Todo.findById(hexId).then((todo) =>{
				expect(null).toNotExist();					
				done();
			}).catch((e) => done(e));
		  })
	});

	it('it should clear completedAt when todo is not complete ',(done) =>{
		var hexId = todos[1]._id.toHexString();
		var utext = 'Changed body';
		var ucompleted = false;

		request(app)
		  .patch(`/todos/${hexId}`)
		  .send({text: utext,completed: ucompleted})
		  .expect(200)
		  .expect((res) => { 
		  	expect(res.body.text).toBe(utext);
		  	expect(res.body.completed).toBe(false);
		  	expect(res.body.completedAt).toBe(null);
		  	//expect(res.body.completedAt).toBeA(number);
		  })
		  .end((err,res) => {
		  	if (err) {
		  		return done(err);
		  	}
		  	Todo.findById(hexId).then((todo) =>{
				expect(null).toNotExist();					
				done();
			}).catch((e) => done(e));
		  })
	});
  




})