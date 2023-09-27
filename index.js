const express = require("express")
const app = express()

const cors = require("cors")
const morgan = require("morgan")
const mongoose = require("mongoose")

require("dotenv").config()
const Person = require("./models/person")

app.use(express.static("dist"))
app.use(cors())
app.use(express.json())
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
)

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body)
})

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    tokens.body(req, res),
  ].join(" ")
})

// ----------------------------------------------------

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person)
    // mongoose.connection.close()
  })
})

app.get("/info", (request, response) => {
  response.send(`
	<p>Phonebook has info for ${persons.length} people</p>
	<p>${new Date()}</p>
	`)
})

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) response.json(person)
      else response.status(404).end()
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error))
})

app.post("/api/persons", (request, response) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then((person) => {
    response.json(person)
  })
})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  console.log('body',body);

  const person = {
    name: body.name,
    number: body.number,
  }

  console.log('person',person);


  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatePerson) => res.json(updatePerson))
    .catch((error) => next(error))
})

//-------------------------- END POINT --------------------------

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

//---------------------------------------------------------------

//------------------------- ERROR HANDLER ----------------------
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  }

  next(error)
}

app.use(errorHandler)
//---------------------------------------------------------------

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
