var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var Ingrelist = new Schema({
  Name: String,
  Category: String,

},{
    collection: 'ingrelist'
});

module.exports = mongoose.model('Ingrelist', Ingrelist);
