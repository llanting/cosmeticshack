const IngredientModel = require('../models/ingredient.model');
require('../app');

let dbIngredients = [
    {name: "almond oil"},
    {name: "aloe vera gel"},
    {name: "avocado oil"},
    {name: "baking soda"},
    {name: "beeswax pastilles"},
    {name: "brown sugar"},
    {name: "cinnamon powder"},
    {name: "coconut oil"},
    {name: "cornstarch"},
    {name: "cosher salt"},
    {name: "essential oils of choice (optional)"},
    {name: "fresh lemon"},
    {name: "ginger powder"},
    {name: "honey"},
    {name: "lavender essential oil"},
    {name: "lemon essential oil"},
    {name: "mango butter"},
    {name: "non-nano zinc oxide"},
    {name: "nutmeg powder"},
    {name: "olive oil"},
    {name: "palmarosa essential oil"},
    {name: "peppermint essential oil"},
    {name: "raspberry seed oil"},
    {name: "shea butter"},
    {name: "tea tree essential oil"},
    {name: "vanilla essential oil"},
    {name: "vitamin E oil"},
    {name: "witch hazel extract"}
]

IngredientModel.create(dbIngredients)
  .then((dataAdded)=>{
    console.log('Data added:',dataAdded)
  })



  // command: node bin/seeds.js