const xss = require('xss');

function sanitize(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitize(obj[key]);
    } else if (typeof obj[key] === 'string') {
      obj[key] = xss(obj[key]);
    }
  }
}

const xssClean = (req, res, next) => {
  ['body', 'params', 'query'].forEach((property) => {
    if (req[property]) {
      sanitize(req[property]);
    }
  });
  next();
};

module.exports = xssClean;
