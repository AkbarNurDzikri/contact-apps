const express = require('express')
const app = express()
const port = 3000
const {loadContact, findContact, addContact, checkDuplicate} = require('./utils/contacts');
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

app.get('/contact', (req, res) => {
  const contacts = loadContact();
  
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

// detail contact
app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

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