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
  {
    name: "Lemon sugar hand scrub", 
    category: "body",  
    purpose:["exfoliating", "moisturizing"],
    time:10,
    cost: "low",
    materials: "whip, bowl, measuring spoon/cup, container",
    level: "easy",
    conservation: "1",
    steps: `Put the granulated sugar in a small bowl.
    Zest the entire lemon.
    Cut the lemon in half and juice one half of it.
    Remove any seeds and put the zest and lemon juice in with the sugar.
    Add 1 tbsp olive oil. You can add a little bit more if it’s too dry but you don’t want it to be liquid.
    Mix well. To use rub a quarter sized amount between your hands and rinse under hot water.
    Store in the refrigerator between uses.
    Now that you have a gardener’s hand scrub, head out to the garden and tackle those weeds!`,
    ingredients: ["fresh lemon", "olive oil", "brown sugar"],
    rating: 5,
    user: "",
    image: "/images/recipes/hand-scrub.jpg"
  },
  {
    name: "Honey hand balm", 
    category: "body",  
    purpose:["moisturizing", "perfuming", "repairing"],
    time:10,
    cost: "medium",
    materials: "whip, bowl, measuring spoon/cup, container",
    level: "easy",
    conservation: "3",
    steps: `Combine everything (except for the raw honey and essential oils) in a microwave safe bowl.
    Warm up until everything has completely melted.
    Place the bowl of melted oils in the freezer for about 2 minutes. When you take it out the mixture should be solid around the edges but still liquid in the middle.
    Stir for about 15 seconds until the mixture comes together almost like a thick batter.
    Add the honey and essential oils. Stir again.
    Spoon the balm into a lidded glass container and pop into the refrigerator for 15 minutes to cool completely.`,
    ingredients: ["coconut oil", "almond oil", "olive oil", "beeswax pastilles", "shea butter", "honey", "essential oils of choice (optional)"],
    rating: 5,
    user: "",
    image: "/images/recipes/honey-hand-balm.jpg"
  },
  {
    name: "Tea tree oil lip balm", 
    category: "face",  
    purpose:["moisturizing", "repairing", "perfuming"],
    time:10,
    cost: "low",
    materials: "whip, bowl, measuring spoon/cup, container",
    level: "easy",
    conservation: "3",
    steps: `Melt beeswax, shea butter and coconut oil in a double boiler or small glass bowl over a small pot of boiling water, stirring constantly until melted.
    Remove pan from heat but keep over the still-hot water to keep the mixture melted.
    Add essential oils to your preference.
    Let tubes sit at room temperature for several hours until cooled and completely hardened before capping them.`,
    ingredients: ["beeswax pastilles", "shea butter", "coconut oil", "peppermint essential oil", "tea tree essential oil"],
    rating: 5,
    user: "",
    image: "/images/recipes/tea-tree-oil-lip-balm.jpg"
  },
  {
    name: "Aloe hand sanitizer", 
    category: "body",  
    purpose:["purifying", "refreshing"],
    time:10,
    cost: "medium",
    materials: "whip, bowl, measuring spoon/cup, container",
    level: "easy",
    conservation: "6",
    steps: `In a glass bowl, mix the oils together.
    Add witch hazel and mix again.
    Add aloe vera and mix to combine.
    Transfer in a little bottle. 
    Shake gently before using.`,
    ingredients: ["witch hazel extract", "aloe vera gel", "tea tree essential oil", "lavender essential oil", "vitamin E oil"],
    rating: 5,
    user: "",
    image: "/images/recipes/aloe-hand-sanitizer.jpeg"
  },
  {
    name: "Honey face mask", 
    category: "face",  
    purpose:["moisturizing", "purifying", "refreshing"],
    time:10,
    cost: "low",
    materials: "whip, bowl, measuring spoon/cup, container",
    level: "easy",
    conservation: "6",
    steps: `Mix together all the ingredients and stir until the spices are incorporated into the honey.
    For thicker mask, use less honey.`,
    ingredients: ["honey", "cinnamon powder", "nutmeg powder"],
    rating: 5,
    user: "",
    image: "/images/recipes/Honey-cinnamon-face-mask.bmp"
  },
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