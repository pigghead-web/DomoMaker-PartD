// - REQUIRE -
const models = require('../models');

const Domo = models.Domo;

// - FUNCTIONS / METHODS -
const makerPage = (req, res) => {
  // Grab all of the domos associated with owner id, stored in the user's session
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  // Make constants that refer to the parameters
  const request = req;
  const response = res;

  // Check if both the name and age are present
  // Part E -> add color
  if (!request.body.name || !request.body.age || !request.body.color) {
    return response.status(400).json({ error: 'Name, age, and color required' });
  }

  // Create an object to store the data that will go into the DomoModel
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    color: req.body.color,  // Part E
    owner: req.session.account._id,
  };

  // create a new domo object based on the data created above
  const newDomo = new Domo.DomoModel(domoData);

  // create a new domo promise
  const domoPromise = newDomo.save();

  domoPromise.then(() => response.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log('Domo promise bug catch');
    console.log(err);
    if (err.code === 11000) {
      return response.status(400).json({ error: 'DOMO ALREADY EXISTS' });
    }

    return response.status(400).json({ error: 'An Unknown Error Occurred' });
  });

  return domoPromise;
};

const getDomos = (req, res) => {
  const request = req;
  const response = res;

  return Domo.DomoModel.findByOwner(request.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return response.status(400).json({ error: 'An error occured' });
    }
    // debugger;
    return res.json({ domos: docs });
  });
};

const deleteDomo = (req, res) => {
  const request = req;
  const response = res;

  return Domo.DomoModel.deleteDomo(request.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return response.status(400).json({ error: 'An error occured' });
    }
    return res.json({ domos: docs });
  });
};

// - EXPORTS -
module.exports.makerPage = makerPage;
module.exports.makeDomo = makeDomo;
module.exports.getDomos = getDomos;
module.exports.deleteDomo = deleteDomo;
