'use strict';

const basicLogger = function (req, res, next) {
  const now = new Date();
  console.log(`${now.toLocaleDateString()} ${req.method} ${req.url}`);
  next();
};

module.exports = basicLogger;