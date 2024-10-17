import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";

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
// app.use("/api/user", userRoute);

app.all("*", (req: Request, res: Response, next) => {
  res.status(404).json({
    msg: "Page not found",
  });
});

app.listen(4000, () => {
  console.log("server listening on port 4000");
});
