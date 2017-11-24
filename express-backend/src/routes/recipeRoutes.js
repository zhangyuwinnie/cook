var express = require('express');
var app = express();
var recipeRouter = express.Router();

// Require Item model in our routes module
var Recipe = require('../models/Recipe');
var Ingrelist = require('../models/Ingrelist');



// Defined get data(index or listing) route
recipeRouter.route('/').get(function (req, res) {
  console.log("ingrelist, index");

  Ingrelist.find(function (err, itms){
    if(err){
      console.log(err);
    }
    else {
      console.log(itms);
      res.json(itms);
    }
  });
});

// get recipe route
recipeRouter.route('/recipes').get(function(req, res){
  let ingres = req.query.ingredients;
  console.log("recipeRoutes, recipes");

  // console.log(ingres);
  Recipe.find({IngredientsName:{$in:ingres}}).exec(function (err, itms){
    if(err){
      console.log(err);
    }
    else {

      let result = [];
      for (i = 0; i < itms.length; i++){
        let itm = itms[i];
        ingredients = itms[i].IngredientsName;
        let count = ingres.filter((n) => ingredients.includes(n)).length;
        itm["Count"] = count;
        result.push(itm);
      }
      res.json(result);
    }
  });
});

// helper function
// function contains(arr, element) {
//     for (var i = 0; i < arr.length; i++) {
//         if (arr[i] === element) {
//             return true;
//         }
//     }
//     return false;
// }

module.exports = recipeRouter;