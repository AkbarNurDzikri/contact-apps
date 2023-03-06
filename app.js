const express = require('express')
const app = express()
const port = 3000
// const {loadContact, findContact, addContact, checkDuplicate, deleteContact, updateContacts} = require('./utils/contacts');
require('./utils/db');
const Contact = require('./model/contact');
const {body, validationResult, check} = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// define ejs
app.set('view engine', 'ejs');

//define static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); // readable data from user input form

// config flash
app.use(cookieParser('secret'));
app.use(session({
  cookie: {maxAge: 6000},
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());

// routes
app.get('/', (req, res) => {
  // res.sendFile('./index.html', {root: __dirname}); //cara merender file html tanpa ejs
  const mahasiswa = [
    {
      nama: 'Dzikri Nur Akbar',
      email: 'dzikri@gmail.com',
    },
    {
      nama: 'Khalid Shalahuddin Akbar',
      email: 'khalid@gmail.com',
    },
    {
      nama: 'Bilal Shalahuddin Akbar',
      email: 'bilal@gmail.com',
    },
  ];
  
  res.render('index', {
    nama: 'Dzikri Nur Akbar',
    title: 'Home Page',
    mahasiswa,
  });
});

app.get('/contact', async (req, res) => {
  // const contacts = loadContact();
  const contacts = await Contact.find();
  
  res.render('contact', {
    title: 'Contact Page',
    contacts,
    msg: req.flash('msg'),
  });
});

// new contact
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Add Contact',
  });
});

// process create contact
app.post('/contact', [
  check('email', 'Email tidak valid').isEmail(),
  body('nama').custom((value) => {
    const duplicate = checkDuplicate(value);
    if(duplicate) {
      throw new Error (value + ' sudah digunakan !');
    }

    return true;
  }),
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    // return res.status(400).json({errors: errors.array()});
    res.render('add-contact', {
      title: 'Add Contact',
      errors: errors.array()
    });
  } else {
    addContact(req.body);
    // send flash message
    req.flash('msg', 'Data kontak berhasil ditambahkan !');
    res.redirect('/contact');
  }
});

// delete contact
app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  
  if(!contact) {
    res.status(404);
    res.send('<h1>404</h1>');
  } else {
    deleteContact(req.params.nama);
    req.flash('msg', 'Data kontak berhasil dihapus !');
    res.redirect('/contact');
  }
});

// edit contact
app.get('/contact/edit/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  res.render('edit-contact', {
    title: 'Edit Contact',
    contact,
  });
});

// process update contact
app.post('/contact/update', [
  check('email', 'Email tidak valid').isEmail(),
  body('nama').custom((value, {req}) => {
    const duplicate = checkDuplicate(value);
    if(value !== req.body.oldNama && duplicate) {
      throw new Error (value + ' sudah digunakan !');
    }

    return true;
  }),
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    // return res.status(400).json({errors: errors.array()});
    res.render('edit-contact', {
      title: 'Edit Contact',
      errors: errors.array(),
      contact: req.body,
    });
  } else {
    updateContacts(req.body);
    // send flash message
    req.flash('msg', 'Data kontak berhasil di update !');
    res.redirect('/contact');
  }
});

// detail contact
app.get('/contact/:nama', async (req, res) => {
  // const contact = findContact(req.params.nama);
  const contact = await Contact.findOne({nama: req.params.nama});

  res.render('detail', {
    title: 'Detail Contact',
    contact,
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Page',
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})