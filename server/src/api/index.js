const DB_FORMS_FLNAME =
  '/Users/nguyenttk/Documents/timed-content-viewer/server/forms.db';

// const debug = require('debug')('server:api');
const Datastore = require('nedb');

function loadDB(dbFlname) {
  const result = new Datastore({filename: dbFlname});
  result.loadDatabase();
  return result;
}

const db = {
  forms: loadDB(DB_FORMS_FLNAME),
};

// Selectors

const DEFAULT_FORM = {
  code: '',
};

function form(id) {
  return {
    read: (cb) => {
      db.forms.findOne({_id: id}, cb);
    },
    delete: (cb) => {
      db.forms.remove({_id: id}, {}, cb);
    },
    update: (newForm, cb) => {
      db.forms.update(
          {_id: id},
          newForm,
          {returnUpdatedDocs: true},
          (err, numAffected, affectedDocuments, upsert) =>
            cb && cb(err, {numAffected, affectedDocuments, upsert})
      );
    },
  };
}

function forms() {
  return {
    create: (cb) => {
      db.forms.insert(DEFAULT_FORM, cb);
    },
    read: (cb) => {
      db.forms.find({}, cb);
    },
    delete: (cb) => {
      db.forms.remove({}, {multi: true}, cb);
    },
  };
}

module.exports = {
  form,
  forms,
};
