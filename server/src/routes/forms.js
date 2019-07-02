// forms.js

const express = require("express");
const path = require("path");
const fs = require("fs");
// const debug = require('debug')('server:forms');

const api = require("../api");
const utils = require("../utils");

const INDEX_FILE_PATH = path.join(__dirname, "forms.md");

const router = new express.Router();

function defaultHandler(req, res, transformErr = null, transformData = null) {
  return function(err, data) {
    if (err) {
      res.status(400).json(transformErr ? transformErr(err) : err);
    } else {
      res.json(transformData ? transformData(data) : data);
    }
  };
}

router.get("/", (req, res) => {
  fs.readFile(INDEX_FILE_PATH, (err, data) => {
    res.set("Content-Type", "text/plain");
    // res.set("X-Content-Type-Options", "nosniff");
    res.send(err || data);
  });
});

router.get("/read", (req, res) => {
  api.forms().read(defaultHandler(req, res));
});

router.get("/source", function(req, res, next) {
  res.sendFile(__filename);
});

router.post("/create", (req, res) => {
  api.forms().create(defaultHandler(req, res));
});

router.delete("/delete", (req, res) => {
  api.forms().delete(defaultHandler(req, res));
});

router.get("/:formID/read", function(req, res) {
  const { formID } = req.params;
  api.form(formID).read(defaultHandler(req, res));
});

router.get("/:formID/processed", function(req, res) {
  const { formID } = req.params;
  api.form(formID).read(defaultHandler(req, res, null, utils.getProcessedForm));
});

router.delete("/:formID/delete", function(req, res) {
  const { formID } = req.params;
  api.form(formID).delete(defaultHandler(req, res));
});

router.put("/:formID/update", function(req, res) {
  const { formID } = req.params;
  const { code } = req.body;
  if (!!code && utils.isJsonString(code)) {
    api.form(formID).update({ code }, defaultHandler(req, res));
  } else {
    res.status(400).json({ message: "Invalid JSON" });
  }
});

router.all("*", (req, res) => {
  res.status(404);
  res.sendFile(path.join(__dirname, "forms.md"));
});

module.exports = router;
