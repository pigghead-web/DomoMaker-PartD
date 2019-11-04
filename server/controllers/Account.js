// - REQUIRE -
// Pull in the models folder, which will import both models/Account.js and models/Index.js
const models = require('../models');

// - VARIABLES & CONSTANTS -
const Account = models.Account;

// - RENDER FUNCTIONS -
// * These functions send back pages when they are called
const loginPage = (req, res) => {
  // generate a new csrfToken for every request
  res.render('login', { csrfToken: req.csrfToken() });
};

const signupPage = (req, res) => {
  // generate a new csrfToken for every request
  res.render('signup', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  // remove a user's session. called on logout so that server knows a user is no longer logged in
  req.session.destroy();
  // * Express documentation: .redirects to the url provided from the specified path
  res.redirect('/');
};

const login = (req, res) => {
  // ** Why are we setting inputted parameters to constants?
  const request = req;
  const response = res;

  const username = `${request.body.username}`;
  const password = `${request.body.pass}`;

  // check to make sure username and password are present when submitting
  if (!username || !password) {
    return response.status(400).json({ error: 'ALL FIELDS ARE REQUIRED' });
  }

  // * Call the static method .authenticate()
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return response.status(401).json({ error: 'WRONG USERNAME OR PASSWORD' });
    }

    // Add a new variable (called account) to our req.session
    // * When a user logs in, we attach all fields from .toAPI to their session for tracking
    request.session.account = Account.AccountModel.toAPI(account);

    return response.json({ redirect: '/maker' });
  });
};

const signup = (req, res) => {
  // ** Why are we setting our inputted parameters as constants?
  const request = req;
  const response = res;

  // * Cast to strings to cover up security flaws
  request.body.username = `${request.body.username}`;
  request.body.pass = `${request.body.pass}`;
  request.body.pass2 = `${request.body.pass2}`;

  // Check to make sure all fields are present
  if (!request.body.username || !request.body.pass || !request.body.pass2) {
    // return a 400 along with json object that includes the exact error
    return response.status(400).json({ error: 'ALL FIELDS ARE REQUIRED!' });
  }

  // Check to make sure the two passwords match one another
  if (request.body.pass !== request.body.pass2) {
    return response.status(400).json({ error: 'BOTH PASSWORDS MUST MATCH' });
  }

  // Generate a new encrypted password hash and salt
  // * Call the static method on the Account schema
  return Account.AccountModel.generateHash(request.body.pass, (salt, hash) => {
    // * Object that is to be made into a promise later
    const accountData = {
      username: request.body.username,
      salt,
      password: hash,
    };

    // * Create a new AccountModel object based off the account schema
    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      // Create a new account variable on our req.session and attach all variables from .toAPI
      request.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return response.status(400).json({ error: 'USERNAME ALREADY IN USE' });
      }

      return response.status(400).json({ error: 'An unknown error occured' });
    });
  });
};

// - EXPORTS -
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
