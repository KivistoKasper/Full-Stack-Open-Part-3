require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()
app.use(express.json())
app.use(express.static('dist'));
app.use(cors());

// ---Morgan---
// create custom token for morgan
morgan.token("show-content", function(req,res){
  return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :show-content'));
// ---Morgan---

// get database contacts to backend
let persons = []
Contact.find({}).then(contacts => {
  //console.log('get firsts: ', contacts)
  persons = persons.concat(contacts)
  //console.log('persons ', persons)
})
  
// ---get info---
app.get('/info', (request, response) => {
  const person_amount = persons.length;
  var now = new Date();
  const info_text = 
    `<div>
        <p> Phonebook has info for ${person_amount} people </p>
        <p> ${now} </p>
    </div>`;
  response.send(info_text)
})

// ---get all persons---
app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contact => {
    response.json(contact)
  })
})

// ---get person with id---
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Contact.findById(id)
  .then(contact => {
    if ( contact){
      response.json(contact);
    } else {
      response.status(404).end();
    }
  })
  .catch((error) => next(error))
})

// ---delete person with id---
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Contact.findByIdAndDelete(id)
    .then(result => {
      persons = persons.filter(person => person.id !== id) // delete from backend
      response.status(204).end() 
    })
    .catch(error => next(error))
})

// ---add person---
app.post('/api/persons', (request, response, next) => {  
  // new concact
  const new_contact = new Contact({
      name: request.body.name,
      number: request.body.number        
  })
  // saving contact to database and locally
  new_contact.save()
    .then(savedContact => {
        persons = persons.concat(savedContact)
        //console.log('persons ', persons)
        response.status(201).json(savedContact)
    })
    .catch(error => next(error))
})

// ---Update contact---
app.put('/api/persons/:id', (request, response, next) => {
  // JS object to update database's contact with
  const contact = {
    name: request.body.name,
    number: request.body.number
  }

  Contact.findByIdAndUpdate(request.params.id, contact, {new: true})
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// handling of non-existent addresses
app.use(unknownEndpoint)

// Error handler middleware 
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })  }

  next(error)
}

// !This is always last!
app.use(errorHandler)

const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })