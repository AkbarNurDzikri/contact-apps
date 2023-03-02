const fs = require('fs');

// create folder data if not exist
const dirPath = './data';
if(!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// create file contacts.json if not exist
const dataPath = './data/contacts.json';
if(!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', 'utf-8');
}

// get all contact at contacts.json
const loadContact = () => {
  const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// get contact by Name
const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
  return contact;
};

// create and replace contacts.json
const saveContacts = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
};

// add new contact
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

// check duplicate name
const checkDuplicate = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
};

module.exports = {loadContact, findContact, addContact, checkDuplicate};