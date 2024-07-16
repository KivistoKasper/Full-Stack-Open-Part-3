const express = require('express')
const app = express()


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

  app.get('/info', (request, response) => {
    response.send(info_text)
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person){
        response.json(person);
    } else {
        response.status(404).end();
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })