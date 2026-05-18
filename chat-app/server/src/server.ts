import express from "express";
import cors from "cors";
import { type Message } from "./types/type.js";

const messages: Message[] = [
  {
    id: 1,
    username: "Alice",
    text: "Hey everyone! Welcome to the new CYF chat app.",
    createdAt: "2026-05-17T16:00:00Z",
    likes: 0,
    dislikes: 0,
  },
  {
    id: 2,
    username: "Bob",
    text: "Wow, this is looking great! Is it built with TypeScript?",
    createdAt: "2026-05-17T16:02:00Z",
    likes: 2,
    dislikes: 0,
  },
  {
    id: 3,
    username: "Jamal",
    text: "Yes! Full-stack TypeScript with a strict vertical slice layout.",
    createdAt: "2026-05-17T16:05:00Z",
    likes: 5,
    dislikes: 0,
  },
];

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.get("/api/messages", (req, resp) => {
  resp.json(messages);
});

app.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});
