import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
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
const server = http.createServer(app);
const ws = new WebSocketServer({ server });
const port = 3000;
app.use(express.json());
app.use(cors());

ws.on("connection", (socket) => {
  console.log("A new user connected via WebSockets!");

  socket.on("close", () => {
    console.log("A user disconnected.");
  });
});
// Helper function to send data to every open browser tab.
const broadcastMessage = (data: any) => {
  ws.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};

app.get("/api/messages", (req, resp) => {
  resp.json(messages);
});

app.post("/api/messages", (req, res) => {
  const { username, text } = req.body;
  if (!username || !text) {
    return res.status(400).json({
      message: "Expected body to be a JSON object",
    });
  }
  const messageId = Date.now();
  const timestamp = new Date().toISOString();
  const createMessages = {
    id: messageId,
    username: username,
    text: text,
    createdAt: timestamp,
    likes: 0,
    dislikes: 0,
  };
  messages.push(createMessages);
  broadcastMessage({ type: "NEW_MESSAGE", payload: createMessages });
  res.json({ status: "success", message: "message added successfully" });
});

server.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});
