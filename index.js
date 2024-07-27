require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()
app.use(express.json())
app.use(cors());
app.use(express.static('dist'));

// ---Morgan---
// create custom token for morgan
morgan.token("show-content", function(req,res){
  return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :show-content'));
// ---Morgan---

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-532532"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-222222"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-44-776561"
  }
]

const person_amount = persons.length;
var now = new Date();
const info_text = 
`<div>
    <p> Phonebook has info for ${person_amount} people </p>
    <p> ${now} </p>
</div>`;

// generate next id in order (not in use)
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => Number(p.id)))
      : 0
    return (maxId + 1)
  }

  // random id generator
  function randomId(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    const id = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    return  id.toString() // The maximum is inclusive and the minimum is inclusive
  }
  
  // get info 
  app.get('/info', (request, response) => {
    response.send(info_text)
  })
  
  // get all persons
  app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contact => {
      response.json(contact)
    })
    //response.json(persons) old stuff
  })

  // get person with id
  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person){
        response.json(person);
    } else {
        response.status(404).end();
    }
  })

  // delete person with id
  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  // ---add person---
  app.post('/api/persons', (request, response) => {  
     
    // check for body
    if (!request.body) {
        return response.status(400).json({ 
          error: 'body missing' 
        })
      }

    const body = request.body
    //console.log(body)

    // check for name and number
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
          })
    }

    const new_person = {
        id: randomId(person_amount, 999),
        name: body.name,
        number: body.number        
    }

    // check if name is already in the phonebook
    if ( persons.some(person => person.name === new_person.name) ){
        return response.status(400).json({ 
            error: 'name already found from the phonebook' 
          })
    }

    persons = persons.concat(new_person)

    response.status(201).json(new_person)
})
  
const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })