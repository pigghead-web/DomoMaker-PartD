// - REQUIRE -
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');  // ??

let DomoModel = {};

// mongoose.Types.ObjectID converts string ID to real Mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setColor = (color) => _.escape(color).trim();

// - SCHEMA -
const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  color: {  // Part E
    type: String,
    required: true,
    trim: true,
    set: setColor,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

// - STATIC FUNCTIONS / METHODS -
DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  color: doc.color,  // Part E
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name age color').exec(callback);
};

// Delete a domo
DomoSchema.statics.deleteDomo = (dName, callback) => {
  const search = {
    // owner: convertId(ownerId),
    name: dName,  // hard coding this will remove the domo no problem
  };
  return DomoModel.deleteOne(search).select('name').exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
