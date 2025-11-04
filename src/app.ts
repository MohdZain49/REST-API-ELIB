import express from "express"
import createHttpError from "http-errors"
import globalErrorHandler from "./middlewares/globalErrorHandler.ts"
import userRouter from "./user/userRouter.ts"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {

  // const error = createHttpError(400, "something went wrong");
  // throw error;

  res.json({message: "Welcome to elib apis"})
})
 

app.use("/api/users", userRouter)


// global error handler

app.use(globalErrorHandler)


export default app;