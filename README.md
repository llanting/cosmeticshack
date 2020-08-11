# Cosmeticshack
Ironhack Project 2

# Description
Collaborative platform with library of recipes for natural cosmetics products.

## User Stories
- 404 - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault.
- 500 - As a user I want to see a nice error page when the team screws it up so that I know that is not my fault.
- LogIn-signup - As a user I want to see a welcome page that gives me the option to either log in as an existing user, or sign up with a new account.
- Add-signup - As a user I want to sign up with my full information so that I can sadd recipes, see my favorites, etc.
- Homepage - As a user I want to see some recipes and be able to log in or sign up.
- User profile - As a user I want to link to my other pages (my favorites, my comments, my recipes (edit and delete button for recipe), edit my user information and see how many people picked my recipe as favorite.
- All recipes - As a user I want to be able to see all recipes and look for specific recipes with a filter and sorting.
- Recipe details - As a user I want to see all the information about a specific recipe, and be able to comment on it and rate it.
- Create recipe - As a user I want to be able to create a new recipe.
- Public profile - As a user I want to be able to check profile-activity of other users (their recipes, profile-picture, how many times a recipe of that user is picked as favorite...). 
- Shopping list - As a user I want to be able to add items to a shopping-list and export this.

## Backlog
- Social logins and account-creation
- Comments (with pictures) and ratings
- Edit userdetails
- PDF export of a recipe
- Share recipes via social media/email
- User recommendations
- Admin user (adding delete button to items)
- Shopping list
- View count

## Routes
- GET /
   - renders homepage.hbs
    
- GET /signup
   - renders signup.hbs
    
- POST /signup
   - redirects to / if user logged in

- GET /login
  - renders login.hbs

- POST /login
  - redirects to / if user logged in
    
- GET /my-profile
    - renders my-profile.hbs

- POST /my-profile
    - Update username, email, password

- GET /my-profile/my-recipes
    - renders my-recipes.hbs

- GET /my-profile/my-favorites
    - renders my-favorites.hbs

- GET /my-profile/my-comments
    - renders my-comments.hbs

- GET /my-profile/my-shoppinglist
    - renders my-shoppinglist.hbs

- POST /my-profile/my-shoppinglist
    - delete items

- GET /public-profile
    - renders public-profile.hbs

- GET /create-recipe
    - renders create-recipe.hbs

- POST /create-recipe
    - redirects to /all-recipes/:[id]

- GET /all-recipes
    - renders all-recipes.hbs

- GET /all-recipes/:[id]
    - renders recipe-details.hbs
    

## Models
- RecipeModel: ({
  name: {
    type: String,
    required: true,
    unique: [true, 'name already exists'] 
  }, 
  category: {
    type: String,
    enum: ['face', 'body', 'hair'],
    required: true,
  },  
  purpose: {
    type: String,
    enum: ['moisturizing', 'repairing', 'sun protection', 'refreshing', 'anti-aging', 'purifying', 'perfuming', 'exfoliating'],
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  cost: {
    type: String,
    enum: ['cheap', 'normal', 'expensive'],
    required: true
  },
  materials: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['easy', 'medium', 'difficult'],
    required: true
  },
  conservation: {
    type: String,
    required: true,
  },
  steps: {
    type: String,
    required: true,
  },
  ingredients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ingredients'
  }, required: true], 
  rating: {
    type: Number
  },
  created by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true
  },
  date added: {
    type: Date, 
    default: Date.now
  },
  image: {
    type: String,
    required: true,
  }}, {
    timestamps: true
  })
  
-> Relation between recipe and user, based on usermodel-id
- UserModel: ({
  username: {
    type: String,
    required: true,
    unique: [true, 'username already exists'] 
  }, 
  usertype: {
    type: String,
    required: true,
    enum: ['user', 'admin'] 
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'email already exists'] 
  },  
  password: {
    type: String,
    required: true
  }}, {
    timestamps: true
  })
  
  
-> Relation between recipe and ingredients, based on ingredient-id (so ingredients in recipemodel will be an array of ingredientid's)
- IngredientModel: ({
    name: {
      type: String,
      required: true,
      unique: [true, 'name already exists'] 
    },
    image: {
      type: String,
      required: true,
    },
    cost: {
      type: String,
      enum: ['cheap', 'normal', 'expensive'],
      required: true
    },
    purpose: {
      type: String,
      enum: ['moisturizing', 'repairing', 'sun protection', 'refreshing', 'anti-aging', 'purifying', 'perfuming', 'exfoliating'],
      required: true
    }}, {
      timestamps: true
    })


## Links

### Trello
[Link to your trello board](https://trello.com/b/G5vKiPDg/cosmetichack)

### Git
[Repository Link](https://github.com/llanting/cosmeticshack)

[Deploy Link](https://cosmeticshack.herokuapp.com/)

### Slides
[Slides Link](https://docs.google.com/presentation/d/1DZyQxbV996NQpF5sjxJAqxnKjfPPqi1QTj5NKP_pAgE/edit#slide=id.g5969a55d39_0_2022)
