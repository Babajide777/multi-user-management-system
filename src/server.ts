import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import authRoute from "./routes/authRoute";
import taskRoute from "./routes/taskRoute";

const app: Application = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Multi User Management Server running");
});

//routes
app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);

app.all("*", (req: Request, res: Response, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
    payload: [],
  });
});

app.listen(4000, () => {
  console.log("server listening on port 4000");
});
