const express = require("express")
const morgan = require("morgan")
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "rash",
    number: "39-53-6423122",
  },
]

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/info", (request, response) => {
  response.send(`
	<p>Phonebook has info for ${persons.length} people</p>
	<p>${new Date()}</p>
	`)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((item) => item.id === id)

  if (person) response.json(person)
  else response.status(404).end()
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((item) => item.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0
  return maxId + 1
}

const nameExist = (name) => {
  return persons.find((item) => item.name === name)
}

app.post("/api/persons", (request, response) => {
  const person = request.body

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: "content missing",
    })
  } else if (nameExist(person.name)) {
    return response.status(400).json({
      error: "name must be unique",
    })
  }

  person.id = generateId()
  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
