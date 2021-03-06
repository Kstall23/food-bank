const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const User = require('mongoose').model('User');
const axios = require('axios');
const Item = require('mongoose').model('Item');
const Suggestion = require('mongoose').model('Suggestion');

//GET ROUTES

// user values passed through from auth middleware
router.get('/dashboard', (req, res) => {
  console.log("You're authorized to see this secret message.");
  res.set('Content-Type', 'application/json');
  res.status(200).json({
    user: req.user
  });
});

//Gets inventory on inventory for both user and admin
router.get('/inventory', (req, res) => {
  Item.find((err, items) => {
    if(err)
      res.send(err)
    else{
      res.set('Content-Type', 'application/json');
      res.status(200).json({
        message: "Items or something",
        items: items
      });
    }
  })
});

//GETS ingredients for the recipes and awaits the call to complete until running next functions
const getIngreds = async (recipe) => {
    let apiKey = '7e67a4fb022eb04b5c0f2e087119c728';
    let recipeUrl = 'http://food2fork.com/api/get?key=';
    let recipeId = '&rId=' + recipe.recipe_id;

    return await axios.get(recipeUrl + apiKey + recipeId)
    .then( (response) => {
      return response.data.recipe.ingredients;
    })
    .catch( (error) => {
      console.log(error);
    });
}

//Gets the initial recipe information
const getRecipesIngreds = async (req, res) => {
   let foodItem = req.params.search_term;
   let apiKey = '7e67a4fb022eb04b5c0f2e087119c728';
   let searchUrl = 'http://food2fork.com/api/search?key=';
   let searchField = '&q=' + foodItem;
   let count = '&count=4';


  const recipes = await axios.get(searchUrl + apiKey + searchField + count)
  .then( (response) => {
    return response.data.recipes;
  })
  .catch( (error) => {
    console.log(error);
  });

  for (var i = 0; i < recipes.length; i++) {
    recipes[i]
    recipes[i].ingredients = await getIngreds(recipes[i]);
  }
  res.json(recipes);
}
//GETS recipe inforfor meal plan page
router.get('/recipes/:search_term', getRecipesIngreds);


//POST ROUTES

router.post('/suggestion', (req, res) => {
//Post suggestions to database
  let suggestion = new Suggestion();
    suggestion.body = req.body.suggestion

    suggestion.save((err) => {
      if (err)
        res.send(err);
      res.json({
        message: "Suggestion Created!"
      });
    });
});

router.post('/dashboard', (req, res) => {
//Updates user by id
  User.findById(req.user._id, function(err, user) {
    if (err)
      res.send(err);

    user.save(function(err) {
      if (err)
        res.send(err);
      res.json({
        message: "User Updated!"
      });
    });
  });
});



module.exports = router;
