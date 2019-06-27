// utils.js

const moment = require('moment');
const debug = require('debug')('server:utils');

const DEFAULT_DESCRIPTION_WHEN_HIDDEN = 'Content hidden';

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function getProcessedNode(node) {
  const {
    title,
    description,
    descriptionWhenHidden = DEFAULT_DESCRIPTION_WHEN_HIDDEN,
    stime = null,
    ttime = null,
    children,
    ...others
  } = node;

  const now = moment();
  const hidden =
    (!!stime && moment(stime).isAfter(now)) ||
    (!!ttime && moment(ttime).isBefore(now));
  debug(
      'stime = %o, ttime = %o, hidden = %o',
      moment(stime).format(),
      moment(ttime).format(),
      hidden
  );
  return {
    title,
    description: hidden ? descriptionWhenHidden : description,
    children: !!children && !hidden
      ? children.map((element) => getProcessedNode(element))
      : undefined,
    ...others,
  };
}

function getProcessedForm(form) {
  const {code} = form;
  const json = JSON.parse(code);
  const processedJson = getProcessedNode(json);
  return processedJson;
}

module.exports = {
  isJsonString,
  getProcessedForm,
};
