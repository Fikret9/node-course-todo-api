const expect  = require ('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo') ;
const {User} = require('./../models/User');
const {ObjectID} = require('mongodb');
var bodyParser = require('body-parser');
const _  = require('lodash');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);
	

describe ('POST /todos',() => {
	
	it('should create a new todo',(done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.set('x-auth',users[0].tokens[0].token)
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
			.set('x-auth',users[0].tokens[0].token)
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
			.set('x-auth',users[0].tokens[0].token)
			.expect(200) 
			.expect((res) => {
				expect(res.body.todos.length).toBe(1);
			})
			.end(done);
		});
	})

describe ('GET /todos/:id',() => {
	it('it should return todo doc',(done) =>{
		request(app)		
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth',users[0].tokens[0].token)
			.expect(200) 
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
		});


	it('it should return todo doc created by another user',(done) =>{
		request(app)		
			.get(`/todos/${todos[1]._id.toHexString()}`)
			.set('x-auth',users[0].tokens[0].token)
			.expect(404) 			
			.end(done);
		});
	it('should return 404 if todo not found',(done) => {
		var newid = new ObjectID().toHexString;
		request(app)		
			.get(`/todos/${newid}`)
			.set('x-auth',users[0].tokens[0].token)
			.expect(404) 			
			.end(done);
		});

	it('should return 404 if todo not found',(done) => {
		var newid = new ObjectID();
		request(app)		
			.get(`/todos/123`)
			.set('x-auth',users[0].tokens[0].token)
			.expect(404) 			
			.end(done);
		});


	})

describe ('DELETE /todos/:id',() => {
	it('it should remove a todo ',(done) =>{
		var hexId = todos[1]._id.toHexString();
		request(app)
		  .delete(`/todos/${hexId}`)
		  .set('x-auth',users[1].tokens[0].token)
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

  it('it should not remove a todo owned by another ',(done) =>{
		var hexId = todos[0]._id.toHexString();
		request(app)
		  .delete(`/todos/${hexId}`)
		  .set('x-auth',users[1].tokens[0].token)
		  .expect(400)
		  .end((err,res) => {
		  	if (err) {
		  		return done(err);
		  	}
		  	Todo.findById(hexId).then((todo) =>{
				expect(todo).toExist();					
				done();
			}).catch((e) => done(e));
		  })
	});

  it('should return 404 if todo not found',(done) => {
		var newid = new ObjectID().toHexString;
		request(app)		
			.delete(`/todos/${newid}`)
			.set('x-auth',users[1].tokens[0].token)
			.expect(404) 			
			.end(done);
		});

	it('should return 404 if todo not found',(done) => {
		var newid = new ObjectID();
		request(app)		
			.delete(`/todos/123`)
			.set('x-auth',users[1].tokens[0].token)
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
		  .set('x-auth',users[0].tokens[0].token)
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

	it('it should not update todo created by other',(done) =>{
		var hexId = todos[0]._id.toHexString();
		var utext = '1st changed body'; 

		request(app)
		  .patch(`/todos/${hexId}`)
		  .set('x-auth',users[1].tokens[0].token)
		  .send({text:utext,completed: true})
		  .expect(404) 
		  .end(done); 
	});

	it('it should clear completedAt when todo is not complete ',(done) =>{
		var hexId = todos[1]._id.toHexString();
		var utext = 'Changed body';
		var ucompleted = false;

		request(app)
		  .patch(`/todos/${hexId}`)
		  .set('x-auth',users[1].tokens[0].token)
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

describe ('GET  /users/me',() => {
	it('it should return user if authenticated ',(done) =>{
		request(app)
		.get('/users/me')
		.set('x-auth',users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		})
		 .end(done);
	});

	it('it should return user 401 if not authenticated ',(done) =>{
		 request(app)
		.get('/users/me')
		.expect(401)
		.expect((res) => {
			expect(res.body).toEqual({});			
		})
		 .end(done);
	});

	});

describe ('POST  /users',() => {
	it('it should create a user ',(done) =>{
		var email = 'example@example.com';
		var password = '123mnb!';
		request(app)
		 .post('/users')
		 .send({email,password})
		 .expect(200)
		 .expect((res) =>{
		 	expect(res.headers['x-auth']).toExist();
		 	expect(res.body._id).toExist();
		 	expect(res.body.email).toBe(email);
		 })
		 	.end((err)=>{
		 		if(err) {
		 			return done(err);
		 		}
		 		User.findOne({email}).then((user) => {
		 			expect(user).toExist();
		 			expect(user.password).toNotBe(password);
		 			done();
		 		});
		 	});
	 
	});

	it('it should return validation errors if request invalid  ',(done) =>{
	    var email = 'andredexample.com';
		var password = '123mnb!';
		request(app)
		 .post('/users')
		 .send({email,password})
		 .expect(400)
		 .end(done);			
	});
		it('it should not create user if email in use ',(done) =>{
		   var email = 'andrew@example.com';
		   var password = '123mnb!';
		request(app)
		 .post('/users')
		 .send({email,password})
		 .expect(400)
		 .end(done);		

	    });
	});

describe ('POST /users/login',() => {
	it('it should login user and return auth token ',(done) =>{
		request(app)
		 .post("/users/login")
		 .send({
		 	email: users[1].email,
		 	password:users[1].password
		 })
		 .expect(200)
		 .expect((res) =>{
		 	expect(res.headers['x-auth']).toExist();
		 })
		 .end((err,res) =>{
		 	if(err) {
		 		return done(err);
		 	}
		 	User.findById(users[1]._id).then((user) =>{
		 		expect(user.tokens[1]).toInclude({
		 			access: 'auth',
		 			token: res.headers['x-auth']
		 		});
		 		done();
		 	}).catch((e)=> done(e));
		 });
	});
  
	it('it should reject invalid login ',(done) =>{
		request(app)
		 .post("/users/login")
		 .send({
		 	email: users[1].email,
		 	password:'12345678'
		 })
		 .expect(400)
		 .expect((res) =>{
		 	expect(res.headers['x-auth']).toNotExist();
		 })
		 .end((err,res) =>{
		 	if(err) {
		 		return done(err);
		 	}
		 	User.findById(users[1]._id).then((user) =>{
		 		expect(user.tokens.length == 1)
		 		done();
		 	}).catch((e)=> done(e));
		 });
		
	});

});

describe ('DELETE /users/me/token',() => {
	it('it should remove off token on logout ',(done) =>{
		request(app)
		.delete("/users/me/token")
		.set('x-auth',users[0].tokens[0].token)
		.expect(200)
		.end((err,res) =>{		
		    if (err) {
		    	return done(err);
		    }		    
			User.findById(users[0]._id).then((user) => {
				expect(user.tokens.length == 0)			
				done();
			}).catch((e) => done(e));		
	});
});

});

