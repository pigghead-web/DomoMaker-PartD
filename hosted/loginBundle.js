'use strict';

// Called when the user attempts to login in using the login button
var handleLogin = function handleLogin(e) {
  e.preventDefault();

  $('#domoMessage').animate({ width: 'hide' }, 350);

  if ($('#user').val() == '' || $('#pass').val() == '') {
    handleError("RAWR! Username or password is empty");
    return false;
  }

  console.log($('#input[name=_csrf]').val());

  // Grab the action portion of our loginForm
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

// Called when user attempts to click the signup button
var handleSignup = function handleSignup(e) {
  e.preventDefault();

  $('#domoMessage').animate({ width: "hide" }, 350);

  if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    handleError("RAWR! All field are required");
    return false;
  }

  if ($('#pass').val() !== $('#pass2').val()) {
    handleError("RAWR! Passwords do not match");
    return false;
  }

  // Grab the action portion of our signupForm
  sendAjax('POST', $("signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

// Syntax using JSX
// ** JSX is a templating language included in REACT. Quickly create + render UI w/ much higher
//  * speed and optimization
var LoginWindow = function LoginWindow(props) {
  // return HTML from javascript, this is what JSX is
  //console.log("creating login window");
  return React.createElement(
    'form',
    { id: 'loginForm', name: 'loginForm',
      onSubmit: handleLogin,
      action: '/login',
      method: 'POST',
      className: 'mainForm' },
    React.createElement(
      'label',
      { htmlFor: 'username' },
      'Username: '
    ),
    React.createElement('input', { id: 'user', type: 'text', name: 'username', placeholder: 'username' }),
    React.createElement(
      'label',
      { htmlFor: 'pass' },
      'Password: '
    ),
    React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Sign in' })
  );
};

var SignupWindow = function SignupWindow(props) {
  //console.log("creating signup window");
  return React.createElement(
    'form',
    { id: 'signupForm', name: 'signupForm',
      onSubmit: handleSignup,
      action: '/signup',
      method: 'POST',
      className: 'mainForm' },
    React.createElement(
      'label',
      { htmlFor: 'username' },
      'Username: '
    ),
    React.createElement('input', { id: 'user', type: 'text', name: 'username', placeholder: 'username' }),
    React.createElement(
      'label',
      { htmlFor: 'pass' },
      'Password: '
    ),
    React.createElement('input', { id: 'pass', type: 'text', name: 'pass', placeholder: 'password' }),
    React.createElement(
      'label',
      { htmlFor: 'pass2' },
      'Re-type Password: '
    ),
    React.createElement('input', { id: 'pass2', type: 'text', name: 'pass2', placeholder: 'Re-type password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Sign Up' })
  );
};

// - RENDER - 
var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector('#content'));
};

var createSignupWindow = function createSignupWindow(csrf) {
  //console.log("successful bundling");
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector('#content'));
};

//const createSignupWindow = (csrf) => {
//  ReactDOM.render(
//    <signupWindow csrf={csrf} />,
//    document.querySelector('#content')
//  );
//};

// - SETUP -
// * A setup function that will allow us to quickly switch between the two above UI layouts
var setup = function setup(csrf) {
  // Hook up the functions to their respective buttons
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", function (e) {
    // Prevent page from reloading
    e.preventDefault();
    // once the signupButton is clicked, fetch the signup window via the signupWindow function
    createSignupWindow(csrf);
    //console.log("Signup button clicked");
    return false;
  });

  loginButton.addEventListener("click", function (e) {
    // Prevent page from reloading
    e.preventDefault();
    // fetch the login page once the loginbutton is clicked
    createLoginWindow(csrf);
    return false;
  });

  // Make a manual call to createLoginWindow, otherwise nothing will appear to begin with
  createLoginWindow(csrf);
};

// a getToken function is require due to the fact that we are never reloading the page
var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
  //console.log("Everything set up!");
});
"use strict";

// * These functions will be shared across bundles
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: "toggle" }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: "hide" }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
