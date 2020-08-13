require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const bcryptjs     = require('bcryptjs');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const moment       = require('moment');


moment().format(); 

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/cosmetichack';

mongoose
  .connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

// Session set-up, saved for one day
app.use(session({
  secret: 'team-dutchies',
  cookie: {
    maxAge: 60*60*24*1000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 
  })
}));  

// This doesn't seem to work. In the right place?
app.use((req,res,next) => {
  res.locals.user = req.user;
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon3.ico')));

//Hbs helper to check if equal
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// Register partials
hbs.registerPartials(__dirname + "/views/partials")

// default value for title local
app.locals.title = 'Cosmeticshack';


const general = require('./routes/general');
app.use('/', general);

const authentication = require('./routes/authentication');
app.use('/', authentication);

const recipes = require('./routes/recipes');
app.use('/', recipes)


// Require routes general and auhtentication above this one, because of 404 in routes/general.js
const profile = require('./routes/profile');
app.use('/', profile)



module.exports = app;
