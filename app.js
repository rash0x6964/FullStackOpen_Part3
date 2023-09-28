const config = require('./utils/config')
const express = require("express")
const app = express()
const cors = require("cors")
const morgan = require("morgan")
const peopleRouter = require("./controllers/people")
const middleware = require("./utils/middleware")
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set("strictQuery", false)

logger.info("connecting to", config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then((result) => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

app.use(express.static("dist"))
app.use(cors())
app.use(express.json())
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
)

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body)
})
morgan(middleware.requestLogger)

// routes
app.use("/api/people", peopleRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
