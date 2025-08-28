import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import teamRouter from './routes/team';
import teamsRouter from './routes/teams';

dotenv.config();

const databaseUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27016";
mongoose.connect(databaseUri, {});
mongoose.pluralize(undefined);

const app = express();

// Middleware setup
app.use(express.json({ limit: 5000000 }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/', teamsRouter);

app.get("/hello", (req: any, res: any) => {
  res.json({
    message: "hello"
  });
});

app.use('/:reference', teamRouter);

// 404 Handler
app.use((_: any, res: any) => {
  res.status(404);
  res.send("Not found");
  res.end();
});

// Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(500).send(process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.stack);
});

// Start Server
const PORT = process.env.PORT || 2011;
app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
