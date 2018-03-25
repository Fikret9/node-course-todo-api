const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

 var data = {
 	id: 10
 };


// var token = jwt.sign(data,'123abc') ;
// console.log(token);
// var decoded = jwt.verify(token+'1','123abc');
// console.log(decoded);

var hashpassword='';
 var password  = '123abc!';
 bcrypt.genSalt(10,(err,salt)=>{
 	bcrypt.hash(password,salt,(err,hash)=>{
 		console.log('1:' +hash);
 		hashpassword = hash; 
 	}); 	
 })

//var hashpassword = "$2a$10$O3iBqrQ95Ynhn7oyKsnXPeMfe45g6WxdlLEvSTKI7a2Muqi0n5gYa";
bcrypt.compare(password,hashpassword,(err,result)=>{
	console.log('2:  '+hashpassword);
	console.log('3: '+result);
});

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message : ${message}`);
// console.log(`Hash  : ${hash}`);

// var data = {
// 	id: 4
// };

// var token = {
// 	data: data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }


// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data).toString());

// var resultHash = SHA256(JSON.stringify(token.data)+ 'somesecret')
//                  .toString();

// if (resultHash === token.hash) {
// 	console.log('Data was not changed ');
// }
// else {
// 	console.log('Data was changed ');
// }


