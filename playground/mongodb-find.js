//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
 

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) => {
	if (err) {
		return console.log('Unable to connect to MOngodb');
	}
	 console.log('Connnected to MOngodb server');

	 const db= client.db('TodoApp');
	 db.collection('Users').find({name: 'Fikret'}).toArray().then((docs) => {
	 	console.log('Users ');
	 	console.log(JSON.stringify(docs,undefined,2));
	 },(err) => {
	 	console.log('Unable to fetch users',err);
	 }); 
	 
	 // db.collection('Todos').find().count().then((count) => {
	 // 	console.log(`Todos count: ${count}`);	 	
	 // },(err) => {
	 // 	console.log('Unable to fetch todos',err);
	 // }); 


	//client.close();

}); 