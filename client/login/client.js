// Called when the user attempts to login in using the login button
const handleLogin = (e) => {
  e.preventDefault();
  
  $('#domoMessage').animate({width:'hide'}, 350);
  
  if($('#user').val() == '' || $('#pass').val() == '') {
    handleError("RAWR! Username or password is empty");
    return false;
  }
  
  console.log($('#input[name=_csrf]').val());
  
  // Grab the action portion of our loginForm
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  
  return false;
};

// Called when user attempts to click the signup button
const handleSignup = (e) => {
  e.preventDefault();
  
  $('#domoMessage').animate({width:"hide"}, 350);
  
  if($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    handleError("RAWR! All field are required");
    return false;
  }
  
  if($('#pass').val() !== $('#pass2').val()) {
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
const LoginWindow = (props) => {
  // return HTML from javascript, this is what JSX is
  //console.log("creating login window");
  return (
    <form id="loginForm" name="loginForm"
          onSubmit={handleLogin}
          action="/login"
          method="POST"
          className="mainForm">
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Sign in" />
    </form>
  );
};

const SignupWindow = (props) => {
  //console.log("creating signup window");
  return (
    <form id="signupForm" name="signupForm"
          onSubmit={handleSignup}
          action="/signup"
          method="POST"
          className="mainForm">
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="text" name="pass" placeholder="password" />
      <label htmlFor="pass2">Re-type Password: </label>
      <input id="pass2" type="text" name="pass2" placeholder="Re-type password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Sign Up" />
    </form>
  );
};

// - RENDER - 
const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector('#content')
  );
};

const createSignupWindow = (csrf) => {
  //console.log("successful bundling");
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector('#content')
  );
};

//const createSignupWindow = (csrf) => {
//  ReactDOM.render(
//    <signupWindow csrf={csrf} />,
//    document.querySelector('#content')
//  );
//};

// - SETUP -
// * A setup function that will allow us to quickly switch between the two above UI layouts
const setup = (csrf) => {
  // Hook up the functions to their respective buttons
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");
  
  signupButton.addEventListener("click", (e) => {
    // Prevent page from reloading
    e.preventDefault();
    // once the signupButton is clicked, fetch the signup window via the signupWindow function
    createSignupWindow(csrf);
    //console.log("Signup button clicked");
    return false;
  });
  
  loginButton.addEventListener("click", (e) => {
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
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
  //console.log("Everything set up!");
});