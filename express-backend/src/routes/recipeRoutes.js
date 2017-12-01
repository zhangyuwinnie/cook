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
        substitutions = itms[i].Substitutions;
        let count = 0;
        let subcount = 0;
        ingredients.filter((n) => {
          if (ingres.includes(n)){
            count++;
          } else {
            // console.log(substitutions);
            // console.log(n);
            if (substitutions[0] != null){
               console.log(substitutions[0][n]);
            }
            // console.log(ingres);

            if (substitutions[0] != null && hasOne(substitutions[0][n], ingres)) {
              subcount++;
            }
          }
        });
        itm["Count"] = count;
        itm["SubCount"] = subcount;
        result.push(itm);
      }
      result.sort(compare);
      // console.log(result);
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
  if (b.Count< a.Count){
    return -1;
  } else if (b.Count > a.Count){
    return 1;
  } else if (b.SubCount< a.SubCount){
    return -1;
  } else if (b.SubCount> a.SubCount){
    return 1;
  }
  return 0;
}

function hasOne(a, b){
  if (a != null){
    if (!Array.isArray(a)){
      return b.includes(a);
    }
    for (var i = 0; i < a.length; i++){


      if (a.find((ele) => b.includes(ele))){
        return true;
      }
    }
  }
  return false;
}


module.exports = recipeRouter;