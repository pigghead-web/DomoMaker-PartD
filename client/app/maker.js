const handleDomo = (e) => {
  // Prevent page from reloading
  e.preventDefault();
  // animate the domo message
  $("#domoMessage").animate( {width:'hide'}, 350 );
  // handle potential errors 
  if($('#domoName').val() == '' || $('#domoAge').val() == '' || $('#domoColor').val() == '') {
    handleError('RAWR! All fields are required');
    return false;
  }
  
  // send as ajax request
  sendAjax('POST', $('#domoForm').attr('#action'), $('#domoForm').serialize(), function() {   
    loadDomosFromServer();
  });
  
  return false;
};

const deleteDomo = (e) => {
  //console.log("Delete Domo triggered");
  e.preventDefault();
  // 2 problems
  // Delete the div element associated with the button click
  //console.log($('#deleteDomoForm').parent);
  // also remove the domo from the list
  console.log($('#deleteDomoForm').serialize());
  sendAjax('GET', '/deleteDomo', $('#deleteDomoForm').serialize(), function() {
    // Reload after the delete request is sent
    loadDomosFromServer();
  });
  
  return false;
}

const DomoForm = (props) => {
  return (
    <form id="domoForm"
          onSubmit={handleDomo}
          name="domoForm"
          action="/maker"
          method="POST"
          className="domoForm"
          >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
            <label htmlFor="color">Color: </label>
            <select name="color" id="domoColor">
              <option value="" disabled="true" selected="true">- Select a Color -</option>
              <option value="brown">Brown</option>
              <option value="green">Green</option>
            </select>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
          </form>
  );
};

const DomoList = function(props) {
  if (props.domos.length === 0) {
    return ( 
      <div className="domoList">
        <h3 className="emptyDomo">No Domos yet</h3>
      </div>
    );
  }
  
  const domoNodes = props.domos.map(function(domo) {
    //console.log(domo);
    return (
      <div key={domo._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName">Name: {domo.name}</h3>
        <h3 className="domoAge">Age: {domo.age}</h3>
        <h3 className="domoColor">Color: {domo.color}</h3>
         <form id="deleteDomoForm" onSubmit={deleteDomo}
         action="/deleteDomo">
          <input className="deleteDomoSubmit" type="submit" value="Delete" />
          <input type="hidden" name="_csrf" value={props.csrf}/>
          <input type="hidden" name="dName" value={domo.name}/>
        </form>
      </div>
    );
  });
  
  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
}

// Grab domos from the server and render a domos list
const loadDomosFromServer = () => {
  //debugger;
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />, document.querySelector("#domos")
    );
  });
};

// - SETUP -
// Render out domo form to the page, as well as a default domo list to show
const setup = function(csrf) {
  ReactDOM.render( 
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );
  
  ReactDOM.render(
    <DomoList domos={[]} />, document.querySelector("#domos")
  );
  
  loadDomosFromServer();
}

// - GET TOKEN - 
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

// - WINDOW LOAD -
$(document).ready(function() {
  console.log("window loaded");
  getToken();
});