const mongoose = require('mongoose');

// Database Schema
const Contact = mongoose.model('Contact', {
  nama: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
});

// Create 1 Data
// const contact1 = new Contact({
//   nama: 'Siska',
//   email: 'siska@gmail.com',
// });

// Save to Collection
// contact1.save().then((contact) => console.log(contact));

module.exports = Contact;