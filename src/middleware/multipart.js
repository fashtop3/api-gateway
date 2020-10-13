// var config = require('../../config');
const FormData = require('form-data');
const Blob = require("cross-blob");

/**
 * form submission injection
 * handles api : content_handling: passthrough|to_text|to_binary
 * @param req
 * @param res
 * @param next
 */
module.exports = (req, res, next) => {

  let regExp = new RegExp('multipart/form-data');
  if (regExp.test(req.headers['content-type'])) {
    // console.log(req.headers['content-type'])
    let form = new FormData();
    for (const key in req.files) {
      if (req.files.hasOwnProperty(key)) {
        form.append(key, req.files[key].data, req.files[key].name)
      }
    }


    // handles content_handling
    for (const i in req.body) {
      if (req.body.hasOwnProperty(i)) {
        switch (req.content_handling) {
          case "to_binary":
            // ensure it's not picking from FormData{} object
            if (!req.body.hasOwnProperty('_boundary')) {
              form.append(i, Buffer.from(req.body[i]))
            }
            break;
          case "to_text":
            form.append(i, Buffer.from(JSON.stringify(req.body[i])), {
              contentType: 'text/plain'
            })
            break;
          default: //passthrough
            form.append(i, Buffer.from(JSON.stringify(req.body[i])))
        }
      }
    }

    delete req.headers['content-length']
    req.headers['content-type'] = `multipart/form-data; boundary=${form._boundary}`;
    req.body = form;
  }
  next();
};
