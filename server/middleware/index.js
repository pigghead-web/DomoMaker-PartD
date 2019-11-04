// Middleware functions receive a request, response, and the next middleware function to call
// * In order for Middleware functiosn to continue to the controller, we MUST call the next
// ** funcion
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }

  // must call the next function
  return next();
};

const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/maker');
  }

  // must call the next function
  return next();
};

// * If the user is trying to do something secure, check to see if they are on HTTPS
// ** If not, redirect them
const requiresSecure = (req, res, next) => {
  // we are utilizing this due to heroku: we must check if the forwarded request was secure
  // by looking at the request's x-forwarded-proto
  // req.secure is what we would TYPICALLY check for
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }

  // must call the next function
  return next();
};

// bypass the check
const bypassSecure = (req, res, next) => next();

// - EXPORTS -
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// create an environment variable called NODE_ENV
if (process.env.NODE_ENV === 'production') {
  // if we are NOT developing (hence 'production', working program), require the secure
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
