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
  if (!request.body.name || !request.body.age) {
    return response.status(400).json({ error: 'NAME AND AGE REQUIRED' });
  }

  // Create an object to store the data that will go into the DomoModel
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => response.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return response.status(400).json({ error: 'DOMO ALREADY EXISTS' });
    }

    return response.status(400).json({ error: 'An Unknown Error Occurred' });
  });

  return domoPromise;
};

module.exports.makerPage = makerPage;
module.exports.makeDomo = makeDomo;
