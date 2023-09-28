const peopleRouter = require("express").Router()
const Person = require("../models/person")

peopleRouter.get("/", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person)
  })
})

peopleRouter.get("/info", (request, response) => {
  response.send(`
	  <p>Phonebook has info for ${persons.length} people</p>
	  <p>${new Date()}</p>
	  `)
})

peopleRouter.get("/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) response.json(person)
      else response.status(404).end()
    })
    .catch((error) => next(error))
})

peopleRouter.delete("/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error))
})

peopleRouter.post("/", (request, response) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then((person) => {
    response.json(person)
  })
})

peopleRouter.put("/:id", (req, res, next) => {
  const body = req.body

  console.log("body", body)

  const person = {
    name: body.name,
    number: body.number,
  }

  console.log("person", person)

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatePerson) => res.json(updatePerson))
    .catch((error) => next(error))
})

module.exports = peopleRouter
