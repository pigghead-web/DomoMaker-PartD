'use strict';

var handleDomo = function handleDomo(e) {
  // Prevent page from reloading
  e.preventDefault();
  // animate the domo message
  $("#domoMessage").animate({ width: 'hide' }, 350);
  // handle potential errors 
  if ($('#domoName').val() == '' || $('#domoAge').val() == '' || $('#domoColor').val() == '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  // send as ajax request
  sendAjax('POST', $('#domoForm').attr('#action'), $('#domoForm').serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

var deleteDomo = function deleteDomo(e) {
  //console.log("Delete Domo triggered");
  e.preventDefault();
  // 2 problems
  // Delete the div element associated with the button click
  //console.log($('#deleteDomoForm').parent);
  // also remove the domo from the list
  console.log($('#deleteDomoForm').serialize());
  sendAjax('GET', '/deleteDomo', $('#deleteDomoForm').serialize(), function () {
    // Reload after the delete request is sent
    loadDomosFromServer();
  });

  return false;
};

var DomoForm = function DomoForm(props) {
  return React.createElement(
    'form',
    { id: 'domoForm',
      onSubmit: handleDomo,
      name: 'domoForm',
      action: '/maker',
      method: 'POST',
      className: 'domoForm'
    },
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
    React.createElement(
      'label',
      { htmlFor: 'age' },
      'Age: '
    ),
    React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Domo Age' }),
    React.createElement(
      'label',
      { htmlFor: 'color' },
      'Color: '
    ),
    React.createElement(
      'select',
      { name: 'color', id: 'domoColor' },
      React.createElement(
        'option',
        { value: '', disabled: 'true', selected: 'true' },
        '- Select a Color -'
      ),
      React.createElement(
        'option',
        { value: 'brown' },
        'Brown'
      ),
      React.createElement(
        'option',
        { value: 'green' },
        'Green'
      )
    ),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement(
      'div',
      { className: 'domoList' },
      React.createElement(
        'h3',
        { className: 'emptyDomo' },
        'No Domos yet'
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    //console.log(domo);
    return React.createElement(
      'div',
      { key: domo._id, className: 'domo' },
      React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
      React.createElement(
        'h3',
        { className: 'domoName' },
        'Name: ',
        domo.name
      ),
      React.createElement(
        'h3',
        { className: 'domoAge' },
        'Age: ',
        domo.age
      ),
      React.createElement(
        'h3',
        { className: 'domoColor' },
        'Color: ',
        domo.color
      ),
      React.createElement(
        'form',
        { id: 'deleteDomoForm', onSubmit: deleteDomo,
          action: '/deleteDomo' },
        React.createElement('input', { className: 'deleteDomoSubmit', type: 'submit', value: 'Delete' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { type: 'hidden', name: 'dName', value: domo.name })
      )
    );
  });

  return React.createElement(
    'div',
    { className: 'domoList' },
    domoNodes
  );
};

// Grab domos from the server and render a domos list
var loadDomosFromServer = function loadDomosFromServer() {
  //debugger;
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
  });
};

// - SETUP -
// Render out domo form to the page, as well as a default domo list to show
var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

  ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

  loadDomosFromServer();
};

// - GET TOKEN - 
var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

// - WINDOW LOAD -
$(document).ready(function () {
  console.log("window loaded");
  getToken();
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
  //debugger;
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      console.log(xhr.responseText);
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
