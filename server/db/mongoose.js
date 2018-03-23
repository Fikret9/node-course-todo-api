var mongoose = require('mongoose');
// Promise setup
mongoose.Promise = global.Promise;
var db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://fikret:fikret123@ds121599.mlab.com:21599/todoapp'
};

mongoose.connect(db.localhost);

module.exports = {mongoose};
