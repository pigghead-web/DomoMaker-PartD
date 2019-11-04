// - REQUIRE -
const controller = require('./controllers');
const mid = require('./middleware');

// - CONNECTIONS -
const router = (app) => {
  // LOGIN
  // mid: we must ensure its secure; ensure they don't see log in page when already logged in
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controller.Account.loginPage);  // GET
  // mid: we must ensure its secure; ensure they are logged out to attempt to sign in
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controller.Account.login);  // POST

  // SIGNUP
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controller.Account.signupPage);  // GET
  // mid: ensure secure; ensure they are logged out to attempt to sign up
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controller.Account.signup);  // POST

  // LOGOUT
  // mid: ensure they are logged in; can't log out if not logged in
  app.get('/logout', mid.requiresLogin, controller.Account.logout);

  // MAKER
  app.get('/maker', mid.requiresLogin, controller.Domo.makerPage);  // GET
  app.post('/maker', mid.requiresLogin, controller.Domo.makeDomo);  // POST

  // /
  app.get('/', mid.requiresSecure, mid.requiresLogout, controller.Account.loginPage);  // DEFAULT
};

// - EXPORTS -
module.exports = router;
