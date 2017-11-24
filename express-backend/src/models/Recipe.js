var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var Recipe = new Schema({
  Name: String,
  Tags: String,
  Cusine: String,
  Type: String,
  TimeToCook: String,
  IngredientsName: Array,
  Substitutions: Array,
  IngredientsDetails: Array,
  Steps: Array,
  Image: String,
  Count: Number

},{
    collection: 'recipes'
});

module.exports = mongoose.model('Recipe', Recipe);
