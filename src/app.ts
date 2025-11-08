import express from "express"
import createHttpError from "http-errors"
import cors from "cors"
import globalErrorHandler from "./middlewares/globalErrorHandler.ts"
import userRouter from "./user/userRouter.ts"
import bookRouter from "./book/bookRouter.ts"
import { config } from "./config/config.ts"

const app = express()

app.use(cors({
  origin: config.frontendOrigin
}))

app.use(express.json())

app.get("/", (req, res) => {

  // const error = createHttpError(400, "something went wrong");
  // throw error;

  res.json({message: "Welcome to elib apis"})
})
 

app.use("/api/users", userRouter)
app.use("/api/books", bookRouter)

// global error handler

app.use(globalErrorHandler)


export default app;