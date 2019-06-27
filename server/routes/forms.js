const express = require('express');
const api = require('../api');
const path = require('path');
const debug = require('debug')('server:forms');

const router = new express.Router();

function defaultHandler(req, res) {
  return function(err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.json(data);
    }
  };
}

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'forms.md'));
});

router.get('/read', (req, res) => {
  api.forms().read(defaultHandler(req, res));
});

router.get('/source', function(req, res, next) {
  res.sendFile(__filename);
});

router.post('/create', (req, res) => {
  api.forms().create(defaultHandler(req, res));
});

router.delete('/delete', (req, res) => {
  api.forms().delete(defaultHandler(req, res));
});

router.get('/:formID/read', function(req, res) {
  const {formID} = req.params;
  api.form(formID).read(defaultHandler(req, res));
});

router.delete('/:formID/delete', function(req, res) {
  const {formID} = req.params;
  api.form(formID).delete(defaultHandler(req, res));
});

router.put('/:formID/update', function(req, res) {
  const {formID} = req.params;
  debug(formID, req.body);
  api.form(formID).update(req.body, defaultHandler(req, res));
});

router.all('*', (req, res) => {
  res.status(404);
  res.sendFile(path.join(__dirname, 'forms.md'));
});

module.exports = router;
