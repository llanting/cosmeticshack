let IngredientModel = require('../models/ingredient.model');
let RecipeModel = require('../models/recipe.model');

require('../app');

//before deployment, add 2 users (with model), and add the user ID in the recipes


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


let dbRecipes = [
   {    
    name: "Lemon Coconut Oil Body Scrub", 
    category: "body",  
    purpose:"exfoliating",
    time: 10,
    cost: "low",
    materials: "whip, bowl, measuring spoon/cup, container",
    level: "easy",
    conservation: "3",
    steps: `First, melt the Coconut Oil for 30 second increments, stirring between each.
    Next, pour the now melted Coconut Oil into a mixing bowl, and slowly add the two cups of salt. Depending on how exfoliating you would like the scrub to be, you might want to add more salt as you mix. (The more salt = the more exfoliation).
    Now, add the two teaspoons of Lemon Extract. For a stronger smell, feel free to add more than the recommended amount.
    Lastly, stir the mixture one last time. Now, cover and store.`,
    ingredients: ["coconut oil", "cosher salt", "lemon essential oil"], 
    rating: 5,
    user: "",
    image: "/images/recipes/lemon-salt-scrub.jpg"
  },
  {
    name: "Vanilla Sugar Scrub", 
    category: "body",  
    purpose:"exfoliating",
    time:10,
    cost: "low",
    materials: "whip, bowl, measuring spoon/cup, container",
    level: "easy",
    conservation: "3",
    steps: `First you want to melt the cup of Coconut Oil for 30 second increments in the microwave, stirring between each. Then, pour the oil into a bowl big enough for mixing.
    Next, add the three cups of sugar while stirring. Keep stirring until the scrub looks nice and mixed. If it appears to have too much liquid, feel free to add more sugar!
    Now, add two teaspoons of Vanilla Extract. Mix again.
    Lastly, store the scrub in something cute such as a canning jar!`,
    ingredients: ["coconut oil", "brown sugar", "vanilla essential oil"],
    rating: 5,
    user: "",
    image: "/images/recipes/brown-sugar-scrub.jpg"
  },
  {
    name: "Whipped gingerbread body butter", 
    category: "body",  
    purpose:["moisturizing", "repairing"],
    time:10,
    cost: "low",
    materials: "whip, bowl, measuring spoon/cup, container",
    level: "easy",
    conservation: "3",
    steps: `Combine shea butter, coconut oil, almond oil, and 1 tsp.ginger,  in a microwave safe dish.
    Melt in microwave in 30 second increments, stirring between each until completely liquid.
    Allow mixture to cool on the counter for about 20 minutes, then place in refrigerator for 15 minutes or until it begins to set a little.
    Mix the mixture with the whip.
    Add remaining ginger, vanilla extract, vitamin E, and cinnamon. Mix until fluffy and smooth- it will look like homeade whipped cream or batter.
     Scoop body butter into wide mouthed jars with an airtight lid to store.  Can be left at room temperature and will be a very soft mixture, for a more firm texture keep in refrigerator.`,
    ingredients: ["shea butter", "coconut oil", "almond oil", "vitamin E oil", "ginger powder", "cinnamon powder", "vanilla essential oil"],
    rating: 5,
    user: "",
    image: "/images/recipes/gingerbread-body-butter.jpg"
  },
  {
    name: "Honey butter bars", 
    category: "body",  
    purpose:["moisturizing", "repairing"],
    time:10,
    cost: "low",
    materials: "whip, bowl, measuring spoon/cup, container",
    level: "medium",
    conservation: "3",
    steps: `Add the butter, coconut oil, and beeswax into your bown and melt the mixture in the microwave.
    Let the mixture get colder and add the honey and essential oils.
    Pour the mixture into molds. For quick cooling you can put them into the freezer, otherwise, these should sit and harden for 4-6 hours.`,
    ingredients: ["shea butter", "mango butter", "coconut oil", "beeswax pastilles", "vanilla essential oil", "honey"],
    rating: 5,
    user: "",
    image: "/images/recipes/solid-body-butter.jpg"
  },
  {
    name: "Solid perfume", 
    category: "body",  
    purpose:["perfuming", "moisturizing", "refreshing"],
    time:10,
    cost: "low",
    materials: "whip, bowl, measuring spoon/cup, container",
    level: "medium",
    conservation: "3",
    steps: `Place a tablespoon of Organic Beeswax Pastilles in a small glass bowl.
    Place the bowl in the top of a double boiler and bring the water to a boil. Stir the beeswax gently with a wooden craft stick until it’s melted.
    Remove it from the heat.
    Stir in about 8-10 drops of your fragrance. How much it takes depends on how strong your fragrance is and how strong you like your perfume.  Experiment until you find the perfect amount for your scent.
    Pour it into a little container with a lid and let it sit until it turns solid.`,
    ingredients: ["beeswax pastilles", "essential oils of choice (optional)"],
    rating: 5,
    user: "",
    image: "/images/recipes/solid-perfume.jpg"
  },
  {
    name: "Natural deodorant", 
    category: "body",  
    purpose:["perfuming", "moisturizing", "refreshing"],
    time:15,
    cost: "low",
    materials: "whip, bowl, measuring spoon/cup, container",
    level: "medium",
    conservation: "3",
    steps: `Mix baking soda and arrowroot together.
    Melt the coconut oil and add it to the mixture. 
    Once a bit harden and less hot, add the essential oils and mix well.
    Pour into a glass container or a clean deodorant stick.`,
    ingredients: ["baking soda", "cornstarch", "coconut oil", "tea tree essential oil", "palmarosa essential oil"],
    rating: 5,
    user: "",
    image: "/images/recipes/natural-deo.jpg"
  },
  {
    name: "Natural sun screen", 
    category: "body",  
    purpose:["sun protection", "moisturizing", "perfuming"],
    time:30,
    cost: "medium",
    materials: "whip, bowl, measuring spoon/cup, container",
    level: "hard",
    conservation: "6",
    steps: `In a double boiler melt butter, coconut oil, and beeswax.
    Once melted, remove the mixture from the heat and stir in the liquid oils and essential oils.
    Wearing  a mask to cover your mouth/nose (or just your t-shirt covering your nose) mix in the zinc oxide. It is best not to breathe in the zinc oxide powder.
    The quantity of non-nano zinc oxide can be adjusted based upon the SPF you are trying to achieve. I used roughly a 15% addition, see this chart here to adjust your recipe to your own needs.
    I like to stir the mixture well prior to pouring to be sure that the zinc oxide is mixed evenly.
    Pour into containers and store in a cool dark location when not in use. `,
    ingredients: ["shea butter", "coconut oil", "beeswax pastilles", "non-nano zinc oxide", "vitamin E oil", "avocado oil", "raspberry seed oil", "lavender essential oil"],
    rating: 5,
    user: "",
    image: "/images/recipes/sunscreen.jpg"
  },
  // {
  //   name: "", 
  //   category: "body",  
  //   purpose:["moisturizing", "repairing"],
  //   time:10,
  //   cost: "low",
  //   materials: "whip, bowl, measuring spoon/cup, container",
  //   level: "medium",
  //   conservation: "3",
  //   steps: ``,
  //   ingredients: [""],
  //   rating: 5,
  //   user: "",
  //   image: ""
  // },
  // {
  //   name: "", 
  //   category: "body",  
  //   purpose:["moisturizing", "repairing"],
  //   time:10,
  //   cost: "medium",
  //   materials: "whip, bowl, measuring spoon/cup, container",
  //   level: "low",
  //   conservation: "3",
  //   steps: ``,
  //   ingredients: [""],
  //   rating: 5,
  //   user: "",
  //   image: ""
  // },
  // {
  //   name: "", 
  //   category: "body",  
  //   purpose:["moisturizing", "repairing"],
  //   time:10,
  //   cost: "medium",
  //   materials: "whip, bowl, measuring spoon/cup, container",
  //   level: "low",
  //   conservation: "3",
  //   steps: ``,
  //   ingredients: [""],
  //   rating: 5,
  //   user: "",
  //   image: ""
  // },
  // {
  //   name: "", 
  //   category: "body",  
  //   purpose:["moisturizing", "repairing"],
  //   time:10,
  //   cost: "medium",
  //   materials: "whip, bowl, measuring spoon/cup, container",
  //   level: "low",
  //   conservation: "3",
  //   steps: ``,
  //   ingredients: [""],
  //   rating: 5,
  //   user: "",
  //   image: ""
  // },
  // {
  //   name: "", 
  //   category: "body",  
  //   purpose:["moisturizing", "repairing"],
  //   time:10,
  //   cost: "medium",
  //   materials: "whip, bowl, measuring spoon/cup, container",
  //   level: "low",
  //   conservation: "3",
  //   steps: ``,
  //   ingredients: [""],
  //   rating: 5,
  //   user: "",
  //   image: ""
  // },

]

  




IngredientModel.create(dbIngredients)
.then((dataAdded)=>{
  console.log('Data added:',dataAdded)
})
.catch((err)=> console.log("error is", err))


RecipeModel.create(dbRecipes)
.then((dataAdded)=>{
  console.log('Data added:',dataAdded)
})
.catch((err)=> console.log("error is", err))




// command: node bin/seeds.js <= comment!!