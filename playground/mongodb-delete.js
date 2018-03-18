//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
 

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) => {
	if (err) {
		return console.log('Unable to connect to MOngodb');
	}
	 console.log('Connnected to MOngodb server'); 
	 const db= client.db('TodoApp');
	 
	 //deleteMany
	  db.collection('Users').deleteMany({name: 'Fikret'})
	                        .then((result) => {
	                        	console.log(result);
	                        });


 	//deleteOne
	// db.collection('Users').deleteOne({_id: new ObjectID('5aae7d7656e51111641f9a17')})
	                        // .then((result) => {
	                        // 	console.log(result);
	                        // })

	//findOne And deleteOne
     db.collection('Users').findOneAndDelete({_id: new ObjectID('5aae991bc96f9a2bad46fe05')})
     				.then((result) => {
	                    	console.log(JSON.stringify(result,undefined,2));
	                      });


	//client.close();

}); 