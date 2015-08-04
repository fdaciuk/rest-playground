var mongoose = require( 'mongoose' );
var contactSchema = new mongoose.Schema({
  primarycontactnumber: { type: String, index: { unique: true } },
  firstname: String,
  lastname: String,
  title: String,
  company: String,
  jobtitle: String,
  othercontactnumbers: [ String ],
  primaryemailaddress: String,
  emailaddresses: [ String ],
  groups: [ String ]
});

var ContactModel = mongoose.model( 'Contact', contactSchema );
exports = module.exports = ContactModel;
