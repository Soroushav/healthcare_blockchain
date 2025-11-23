import express from "express";
import cors from "cors";
import certRequestsRouter from "./routes/certRequests";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev origin
  })
);

app.use(express.json());

app.use("/api", certRequestsRouter);

app.listen(4000, () => {
  console.log("Bridge listening on http://localhost:4000");
});