// - REQUIRE -
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
// Part B
const session = require('express-session');
// Part c
const RedisStore = require('connect-redis')(session);  // storing session data + cookies in redis
const url = require('url');
// csurf automatically generates unique tokens for each user for each page
// These tokens are checked upon request to prevent "Cross-Site-Request-Forgery"
const csrf = require('csurf');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

// setting up mongoose
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// Get the username/password for connecting to redis
// * We simply parse it out of the redis url from heroku
let redisURL = {
  hostname: 'redis-15954.c9.us-east-1-2.ec2.cloud.redislabs.com',  // hostname from redislabs
  port: 15954,  // port number from redislabs
};

let redisPASS = 'PSEfCN5MHLQQio06HzhFHkiVaxWghsYU';  // password from redislabs

// the above gets overwritten when running on heroku
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(':')[1];
}

// pull from routes
const router = require('./router.js');

// set up express app
const app = express();

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  key: 'sessionid',  // the name of the cookie so that it can be tracked when requests are made
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS,
  }),
  secret: 'Domo Arigato',  // string used as a seed for hashing/creating unique session keys
  resave: true,  // refresh the key to keep it active
  saveUninitialized: true,  // make sessions even when not loggin in
  cookie: {
    httpOnly: true,
  },
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', '{__dirname}/../views');
app.use(cookieParser());
// csrf must come after cookieParser and app.use(session({...}))
app.use(csrf());
app.use((err, req, res, next) => {
  // * Do nothing if we get a EBADCSRFTOKEN error b/c it indicates that somebody is probably
  // ** up to no good
  if (err.code !== 'EBADSCSRFTOKEN') return next(err);

  console.log('Missing CSRF token');
  return false;
});

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
