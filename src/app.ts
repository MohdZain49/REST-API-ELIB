import express from "express"
import createHttpError from "http-errors"
import globalErrorHandler from "./middlewares/globalErrorHandler.ts"

const app = express()


app.get("/", (req, res) => {

  const error = createHttpError(400, "something went wrong");
  throw error;

  res.json({message: "Welcome to elib apis"})
})



// global error handler

app.use(globalErrorHandler)


export default app;