const express       = require('express');
const router        = express.Router();
const RecipesModel  = require('../models/recipe.model');
const UserModel     = require('../models/user.model');
const IngredientModel = require('../models/ingredient.model');
const moment        = require('moment');
const uploader      = require('../config/cloudinary.js');
const app           = require('../app');
const CommentModel = require('../models/comment-model');

let ingredientsArr = ["almond oil", "aloe vera gel", "avocado oil", "baking soda", "beeswax pastilles", "brown sugar", "cinnamon powder", "coconut oil", "cornstarch", "cosher salt", "essential oils of choice (optional)", "fresh lemon", "ginger powder", "honey", "lavender essential oil", "lemon essential oil", "mango butter", "non-nano zinc oxide", "nutmeg powder", "olive oil", "palmarosa essential oil", "peppermint essential oil", "raspberry seed oil", "shea butter", "tea tree essential oil", "vanilla essential oil", "vitamin E oil", "witch hazel extract"];
let purposeArr = ['anti-aging', 'exfoliating', 'moisturizing', 'perfuming', 'purifying', 'refreshing', 'repairing', 'sun protection'];
let materialsArr = ["bowl", "container", "funnel", "measuring spoon/cup", "mesh strainer", "pipette droppers", "scale", "spatula", "whisk"];
let categoryArr = ['body', 'face', 'hair'];
let costArr= ['low', 'medium', 'high'];
let levelArr = ['easy', 'medium', 'hard'];

// All recipes
router.get('/all-recipes', (req, res) => {
    let currentUser = req.session.loggedInUser;
    RecipesModel.find()
        .then((recipe) => {
            UserModel.findById(currentUser._id)
                .then((result) => {
                    let newRecipes = recipe.map((elem) => {
                        if (result.favorites.includes(elem._id)) {
                            let newElem = JSON.parse(JSON.stringify(elem))
                            newElem.alreadyFav = true;
                            return newElem;
                        } else {
                            return elem;
                        }
                    })
                    res.render('recipes/all-recipes.hbs', {recipe: newRecipes, ingredientsArr, currentUser, purposeArr})
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
});



// Search 
router.get('/all-recipes/search', (req,res) => {
    let currentUser = req.session.loggedInUser;
    let {category, purpose, ingredients} = req.query;
    let search = {}
    search.purpose = purpose;
    search.category = category;
    search.ingredients = ingredients;

    // Find 'and' or 'or'
    RecipesModel.find({$or: [{category: search.category}, {purpose: search.purpose}, {ingredients: search.ingredients}]})
        .then((recipe) => {
            if (recipe.length === 0) {
                res.render('recipes/all-recipes.hbs', {recipe, purposeArr, ingredientsArr, errorMessage: 'No matches found', currentUser})
            } else {
                res.render('recipes/all-recipes.hbs', {recipe, purposeArr, ingredientsArr, currentUser})
            }
        })
        .catch((err) => console.log(err));
});

// Sort -> doesn't work yet!
router.get('/all-recipes/sort', (req, res) => {
    let currentUser = req.session.loggedInUser;
    const {rating} = req.query
   
    if (rating === 'high-low') {
        RecipesModel.find()
            .sort({'rating': -1})
            .then((recipe) => {
                res.render('recipes/all-recipes.hbs', {recipe, purposeArr, currentUser})
            })
            .catch((err) => console.log(err));
    } else {
        RecipesModel.find()
            .sort('rating')
            .then((recipe) => {
                res.render('recipes/all-recipes.hbs', {recipe, purposeArr, currentUser})
            })
            .catch((err) => console.log(err));
    }
})

// Creating recipe
router.get('/create-recipe', (req, res) => {
    let currentUser = req.session.loggedInUser;
    IngredientModel.find()
    .then((ingredients) => {
        let purpose = ['anti-aging', 'exfoliating', 'moisturizing', 'perfuming', 'purifying', 'refreshing', 'repairing', 'sun protection'];
        let materials = ["whisk", "bowl", "measuring spoon/cup", "container", "spatula", "scale", "funnel", "mesh strainer", "pipette droppers"];
        res.render('recipes/create-recipe.hbs', {ingredients, purpose, materials, currentUser})
    })
    .catch((err) => console.log(err))  
});


router.post('/create-recipe', uploader.single("imageUrl"), (req, res, next) => {
    const {name, category, preparation, cost, materials, level, purpose, conservation, steps, imageUrl, ingredients} = req.body;
    
    if(!name || !category || !purpose || !preparation || !cost || !materials || !level || !conservation || !steps || !ingredients){
        res.status(500).render('recipes/create-recipe.hbs', {errorMessage: 'Please fill in all fields'})
        return;
    }

    console.log('file is: ', req.file)
    if (req.file === undefined) {
        req.file = {
            fieldname: 'imageUrl',
            originalname: 'default-img.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            path: 'https://res.cloudinary.com/dumj6yt5u/image/upload/v1597302744/default-img_avmif5.jpg', 
            size: 125913,
            filename: 'defaultimg'
        }
        console.log(req.file)
    
        RecipesModel.create(req.body)
        .then((createdRecipe) => {
            RecipesModel.findByIdAndUpdate(createdRecipe._id, {$set: {image: req.file.path, user: req.session.loggedInUser._id}})
                .then((recipe) => {
                    res.redirect('/all-recipes/' + recipe._id);
                    UserModel.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {recipes: [recipe]}})
                        .then(() => console.log('succes1'))
                        .catch((err) =>  console.log(err));
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err));

    } else {
        RecipesModel.create(req.body)
        .then((createdRecipe) => {
            RecipesModel.findByIdAndUpdate(createdRecipe._id, {$set: {image: req.file.path, user: req.session.loggedInUser._id}})
                .then((recipe) => {
                    res.redirect('/all-recipes/' + recipe._id);
                    UserModel.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {recipes: [recipe]}})
                        .then(() => console.log('succes'))
                        .catch((err) =>  console.log(err));
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err));
    }
});

// Edit and delete my recipes
router.get('/my-profile/my-recipes/:recipeId/edit', (req, res) => {
    let currentUser = req.session.loggedInUser
    RecipesModel.findById(req.params.recipeId)
        .then((recipe) => {

            IngredientModel.find()
                .then((ingredients) => {
                    if (typeof recipe.purpose == 'string') {
                        recipe.purpose = [recipe.purpose]
                    }
                    let newPurpose = purposeArr.map((p) => {
                        return {
                            name: p,
                            isChecked : recipe.purpose.includes(p.toLowerCase())
                        }
                    })
                    if (typeof recipe.ingredients == 'string') {
                        recipe.ingredients = [recipe.ingredients]
                    }
                    let newIngredients = ingredientsArr.map((i) => {
                        return {
                            name: i,
                            isChecked : recipe.ingredients.includes(i)
                        }
                    })
                    if (typeof recipe.materials == 'string') {
                        recipe.materials = [recipe.materials]
                    }
                    let newMaterials = materialsArr.map((m) => {
                        return {
                            name: m,
                            isChecked : recipe.materials.includes(m)
                        }
                    })
                    let newCategory = categoryArr.map((c) => {
                        return {
                            name: c,
                            isChecked : recipe.category.includes(c)
                        }
                    })
                    let newCost = costArr.map((c) => {
                        return {
                            name: c,
                            isChecked : recipe.cost.includes(c)
                        }
                    })
                    let newLevel = levelArr.map((l) => {
                        return {
                            name: l,
                            isChecked : recipe.level.includes(l)
                        }
                    })
                    res.render('recipes/edit-recipe.hbs', {recipe, category: newCategory, ingredients: newIngredients, purpose: newPurpose, materials: newMaterials, cost: newCost, level: newLevel, currentUser})
                }) 
                .catch((err) => console.log(err)) 
        })
});

router.post('/my-profile/my-recipes/:recipeId/edit', (req, res) => {
    RecipesModel.findByIdAndUpdate(req.params.recipeId, {$set: req.body})
        .then((recipe) => {
            res.redirect('/all-recipes/' + recipe._id)
        })
        .catch((err) => console.log(err))  
});

router.get('/my-profile/my-recipes/:recipeId/delete', (req, res) => {
    RecipesModel.findByIdAndDelete(req.params.recipeId)
        .then(() => {
            res.redirect('/my-profile/' + req.session.loggedInUser._id + '/my-recipes')
        })
        .catch((err) => console.log(err))
});


// Favorite button route (all-recipes page)
router.post('/all-recipes/:recipeId/favorite', (req, res) => {
    UserModel.update({ _id: req.session.loggedInUser._id }, { $push: { favorites: req.params.recipeId } }) 
        .then(() => {
            res.redirect('/all-recipes')
        })
        .catch((err) => console.log(err))  
});

// Unavorite button route (all-recipes page)
router.post('/all-recipes/:recipeId/unfavorite', (req, res) => {
    UserModel.update({ _id: req.session.loggedInUser._id }, { $pull: { favorites: req.params.recipeId }}) 
        .then(() => {
            res.redirect('/all-recipes')
        }).catch((err) => {
            console.log(err)    
        });
});

// Unavorite button route (public-profile page) -> needs to change the route to public-profile
router.post('/all-recipes/:recipeId/public/unfavorite', (req, res) => {
    UserModel.update({ _id: req.session.loggedInUser._id }, { $pull: { favorites: req.params.recipeId }}) 
        .then(() => {
            res.redirect('/all-recipes')
        }).catch((err) => {
            console.log(err)    
        });
});


// Comments
let ratingArr  = [];
router.post('/all-recipes/:recipeId/comment', (req, res) => {

    if (Number(req.body.rating) > 0 && Number(req.body.rating) < 6) {
    CommentModel.create({text: req.body.text, user: req.session.loggedInUser._id, recipe: req.params.recipeId, rating: req.body.rating})
        .then(() => {
            ratingArr.push(Number(req.body.rating))
       
            let sum = ratingArr.reduce((a, b) => {
                return a + b;
            }, 0);

            let average  = Math.round(sum / ratingArr.length);
            
            RecipesModel.findByIdAndUpdate(req.params.recipeId, {$set: {rating: average}})
                .then(() => {
                    res.redirect('/all-recipes/' + req.params.recipeId)
                })
                .catch((err) => console.log(err));
        })
        // It goes here!
        .catch(() => {
            res.redirect('/all-recipes/' + req.params.recipeId)
        })
       
    } else {
        CommentModel.create({text: req.body.text, user: req.session.loggedInUser._id, recipe: req.params.recipeId})
        .then(() => {
            res.redirect('/all-recipes/' + req.params.recipeId)
        })
        .catch(() => res.redirect('/all-recipes/' + req.params.recipeId))
    } 
});


// Recipe-details
router.get('/all-recipes/:recipeId', (req, res) => {
    let currentUser = req.session.loggedInUser;
    RecipesModel.findById(req.params.recipeId)
        // To insert user-info, next to id
        .populate('user')
        .then((recipe) => {
            // Changes recipe.date to a readable format
            let newDate = moment(recipe.date).format("MMMM DD, YYYY");
            
                if (recipe.level == "easy"){  

                    if (recipe.cost == "low"){

                        if (recipe.rating == '0'){
                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                console.log(comment)
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/1-round.jpg', rating: '0'})
                            })
                            .catch((err) => console.log(err))
                            
                        } else if (recipe.rating == '1'){
                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-1star.png'})
                            })
                            .catch((err) => console.log(err))
                        
                        } else if (recipe.rating == '2'){
                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-2star.png'})
                            })
                            .catch((err) => console.log(err))

                        } else if (recipe.rating == '3'){
                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-3star.png'})
                            })
                            .catch((err) => console.log(err))

                        } else if (recipe.rating == '4'){
                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-4star.png'})
                            })
                            .catch((err) => console.log(err))

                        } else if (recipe.rating == '5'){
                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-5star.png'})
                            })
                            .catch((err) => console.log(err))

                        }

                         
                    } 
                    else if (recipe.cost == "medium"){

                        if (recipe.rating == 0) {

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/1-round.jpg', rating: '0'})
                            })
                            .catch((err) => console.log(err))      

                        } else if (recipe.rating == 1){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-1star.png'})
                            })
                            .catch((err) => console.log(err))                            

                        } else if (recipe.rating == 2){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-2star.png'})
                            })
                            .catch((err) => console.log(err))

                        } else if (recipe.rating == 3){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-3star.png'})
                            })
                            .catch((err) => console.log(err))

                        } else if (recipe.rating == 4){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-4star.png'})
                            })
                            .catch((err) => console.log(err))

                        } else if (recipe.rating == 5){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-5star.png'})
                            })
                            .catch((err) => console.log(err))

                        }
                                             
                    } else if (recipe.cost == "high"){

                        if (recipe.rating == 0){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/1-round.jpg', rating: '0'})
                            })
                            .catch((err) => console.log(err))

                        } else if (recipe.rating == 1){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-1star.png'})
                            })
                            .catch((err) => console.log(err)) 
                            

                        } else if (recipe.rating == 2){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-2star.png'})
                            })
                            .catch((err) => console.log(err))  

                        } else if (recipe.rating == 3){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-3star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 4){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-4star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 5){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/1-round.jpg', rating: '/images/btn-5star.png'})
                            })
                            .catch((err) => console.log(err)) 
                        }                      
                         
                    }

                } else if (recipe.level == "medium"){
                    if (recipe.cost == "low"){

                        if (recipe.rating == 0){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/2-round.jpg', rating: '0'})
                            })
                            .catch((err) => console.log(err))  

                        } else if (recipe.rating == 1){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-1star.png'})
                            })
                            .catch((err) => console.log(err))  
                            

                        } else if (recipe.rating == 2){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-2star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 3){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-3star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 4){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-4star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 5){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-5star.png'})
                            })
                            .catch((err) => console.log(err)) 
                        }

                             
                    } else if (recipe.cost == "medium"){

                        if (recipe.rating == 0){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/2-round.jpg', rating: '0'})
                            })
                            .catch((err) => console.log(err))     

                        } else if (recipe.rating == 1){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-1star.png'})
                            })
                            .catch((err) => console.log(err))                              

                        } else if (recipe.rating == 2){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-2star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 3){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-3star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 4){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-4star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 5){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-5star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        }
                                           
                    } else if (recipe.cost == "high"){

                        if (recipe.rating == 0){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/2-round.jpg', rating: '0'})
                            })
                            .catch((err) => console.log(err))

                        } else if (recipe.rating == 1){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-1star.png'})
                            })
                            .catch((err) => console.log(err))
                            

                        } else if (recipe.rating == 2){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-2star.png'})
                            })
                            .catch((err) => console.log(err))

                        } else if (recipe.rating == 3){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-3star.png'})
                            })
                            .catch((err) => console.log(err))

                        } else if (recipe.rating == 4){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-4star.png'})
                            })
                            .catch((err) => console.log(err))

                        } else if (recipe.rating == 5){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/2-round.jpg', rating: '/images/btn-5star.png'})
                            })
                            .catch((err) => console.log(err))
                        }                          
                    }


                } else if (recipe.level == "hard"){
                    if (recipe.cost == "low"){

                        if (recipe.rating == 0){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/3-round.jpg', rating: '0'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 1){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-1star.png'})
                            })
                            .catch((err) => console.log(err)) 
                            

                        } else if (recipe.rating == 2){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-2star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 3){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-3star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 4){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-4star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 5){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/1-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-5star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        }


                                             
                    } else if (recipe.cost == "medium"){

                        if (recipe.rating == 0){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/3-round.jpg', rating: '0'})
                            })
                            .catch((err) => console.log(err))    

                        } else if (recipe.rating == 1){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-1star.png'})
                            })
                            .catch((err) => console.log(err))                             

                        } else if (recipe.rating == 2){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-2star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 3){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-3star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 4){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-4star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 5){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/2-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-5star.png'})
                            })
                            .catch((err) => console.log(err)) 
                        }

                                             
                    } else if (recipe.cost == "high"){

                        if (recipe.rating == 0){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/3-round.jpg', rating: '0'})
                            })
                            .catch((err) => console.log(err))                              

                        } else if (recipe.rating == 1){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-1star.png'})
                            })
                            .catch((err) => console.log(err))                              

                        } else if (recipe.rating == 2){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-2star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 3){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-3star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 4){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-4star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        } else if (recipe.rating == 5){

                            CommentModel.find({recipe: req.params.recipeId})
                            .populate('user')
                            .then((comment) => {
                                let commentDate = moment(comment.date).format("MMMM DD, YYYY");
                                res.render('recipes/recipe-details.hbs', {recipe, comment, date: newDate, commentDate, currentUser, cost: '/images/3-round.jpg', level: '/images/3-round.jpg', rating: '/images/btn-5star.png'})
                            })
                            .catch((err) => console.log(err)) 

                        }
                        
                    }
                }  
            })
            .catch((err) => console.log(err))  
        .catch((err) => console.log(err))
});



module.exports = router;
