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
      result.sort(compare);
      res.json(result);
    }
  });
});

recipeRouter.route('/recipes/:id').get((req, res) => {
  console.log("recipeRoutes, recipes-id");

  let searchname = req.params.id;
  console.log(searchname);
  Recipe.find({Name:searchname}).exec((err, itms) => {
    if (err){
      console.log(err);
    } else {
      console.log(itms);
      res.json(itms);
    }
  });
});

// helper function
function compare(a,b) {
  if (b.Count< a.Count)
    return -1;
  if (b.Count > a.Count)
    return 1;
  return 0;
}


module.exports = recipeRouter;