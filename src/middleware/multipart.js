// var config = require('../../config');
const FormData = require('form-data');

module.exports = (req, res, next) => {

  const FORM_MULTIPART = 'multipart/form-data';

  if (req.headers['content-type'] === FORM_MULTIPART) {
    let form = new FormData();
    for (const key in req.files) {
      if (req.files.hasOwnProperty(key)) {
        form.append(key, req.files[key].data, req.files[key].name)
      }
    }

    for (const i in req.body) {
      if (req.body.hasOwnProperty(i))
        form.append(i, req.body[i])
    }

    req.headers['content-type'] = `multipart/form-data; boundary=${form._boundary}`;
    req.body = form;
  }
  next();
};
