const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://FullStack:${password}@full-stack-open.rsqtofh.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Full-Stack-Open`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Number = mongoose.model('Number', numberSchema)

if (process.argv.length === 3) {
    Number.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(number => {
          console.log(`${number.name} ${number.number}`)
        })
        mongoose.connection.close()
      })
}
else if (process.argv.length === 5) {
    const number = new Number({
        name: process.argv[3],
        number: process.argv[4]
      })
      
    number.save().then(result => {
    console.log(`Added ${number.name} number ${number.number} to phonebook`)
    mongoose.connection.close()
    })
}
else {
    console.log(`Give a name and a phonenumber`)
    mongoose.connection.close()
}

