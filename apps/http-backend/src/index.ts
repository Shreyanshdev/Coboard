import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { CreateUserSchema, SigninUserSchema, CreateRoomSchema, CanvasElement } from "@repo/common";
import { connectDB, User, Room, mongoose } from "@repo/db";
import { authMiddleware, AuthenticatedRequest, JWT_SECRET } from "./middleware";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory fallback if MongoDB connection is pending / unreachable
const memoryRooms: Record<string, { id: string; slug: string; name: string; adminId: string; elements: CanvasElement[] }> = {};
const memoryUsers: Record<string, { id: string; username: string; password: string; name: string }> = {};

// Initialize MongoDB connection
connectDB().catch((err) => {
  console.warn("[HTTP-Backend] Initial MongoDB connection error:", err.message);
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "http-backend",
    db: mongoose.connection.readyState === 1 ? "connected" : "in-memory-fallback",
  });
});

// Signup Endpoint
app.post("/api/v1/signup", async (req, res) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input", errors: parsed.error });
    return;
  }

  const { username, password, name } = parsed.data;

  try {
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ username: username.toLowerCase() });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const newUser = await User.create({
        username: username.toLowerCase(),
        password, // In prod, hash with bcrypt
        name,
      });

      const userId = newUser._id.toString();
      const token = jwt.sign({ userId }, JWT_SECRET);
      res.json({ message: "User created successfully", userId, token });
      return;
    }
  } catch (err: any) {
    console.error("[HTTP-Backend] MongoDB signup error:", err.message);
  }

  // Fallback to in-memory store
  if (memoryUsers[username.toLowerCase()]) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  memoryUsers[username.toLowerCase()] = { id: userId, username: username.toLowerCase(), password, name };

  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({ message: "User created successfully", userId, token });
});

// Signin Endpoint
app.post("/api/v1/signin", async (req, res) => {
  const parsed = SigninUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  const { username, password } = parsed.data;

  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ username: username.toLowerCase() });
      if (!user || user.password !== password) {
        res.status(403).json({ message: "Invalid credentials" });
        return;
      }

      const userId = user._id.toString();
      const token = jwt.sign({ userId }, JWT_SECRET);
      res.json({ token, userId, name: user.name });
      return;
    }
  } catch (err: any) {
    console.error("[HTTP-Backend] MongoDB signin error:", err.message);
  }

  // Fallback to in-memory store
  const user = memoryUsers[username.toLowerCase()];
  if (!user || user.password !== password) {
    res.status(403).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token, userId: user.id, name: user.name });
});

// Create Room Endpoint
app.post("/api/v1/room", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const parsed = CreateRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input", errors: parsed.error });
    return;
  }

  const { name, slug } = parsed.data;

  try {
    if (mongoose.connection.readyState === 1) {
      let room = await Room.findOne({ slug });
      if (!room) {
        room = await Room.create({
          slug,
          name,
          adminId: req.userId || "guest",
          elements: [],
        });
      }
      res.json({ roomId: room._id.toString(), slug: room.slug, name: room.name });
      return;
    }
  } catch (err: any) {
    console.error("[HTTP-Backend] MongoDB create room error:", err.message);
  }

  // Fallback to in-memory store
  if (memoryRooms[slug]) {
    res.json({ roomId: memoryRooms[slug].id, slug, name: memoryRooms[slug].name });
    return;
  }

  const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  memoryRooms[slug] = {
    id: roomId,
    slug,
    name,
    adminId: req.userId || "guest",
    elements: [],
  };

  res.json({ roomId, slug, name });
});

// Get Room by Slug (Returns embedded elements directly)
app.get("/api/v1/room/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      let room = await Room.findOne({ slug });
      if (!room) {
        room = await Room.create({
          slug,
          name: `Room ${slug}`,
          adminId: "system",
          elements: [],
        });
      }

      res.json({
        room: {
          id: room._id.toString(),
          slug: room.slug,
          name: room.name,
          adminId: room.adminId,
          elements: room.elements || [],
        },
      });
      return;
    }
  } catch (err: any) {
    console.error("[HTTP-Backend] MongoDB get room error:", err.message);
  }

  // Fallback to in-memory store
  const room = memoryRooms[slug];
  if (!room) {
    const roomId = `room_${slug}`;
    const newRoom = {
      id: roomId,
      slug,
      name: `Room ${slug}`,
      adminId: "system",
      elements: [],
    };
    memoryRooms[slug] = newRoom;
    res.json({ room: newRoom });
    return;
  }

  res.json({ room });
});

// Save Canvas Elements for Room
app.post("/api/v1/room/:slug/elements", async (req, res) => {
  const { slug } = req.params;
  const { elements } = req.body;

  try {
    if (mongoose.connection.readyState === 1) {
      const updatedRoom = await Room.findOneAndUpdate(
        { slug },
        { $set: { elements: elements || [] } },
        { upsert: true, new: true }
      );
      res.json({ message: "Elements saved successfully", count: updatedRoom.elements.length });
      return;
    }
  } catch (err: any) {
    console.error("[HTTP-Backend] MongoDB save elements error:", err.message);
  }

  // Fallback to in-memory store
  if (!memoryRooms[slug]) {
    memoryRooms[slug] = {
      id: `room_${slug}`,
      slug,
      name: `Room ${slug}`,
      adminId: "system",
      elements: elements || [],
    };
  } else {
    memoryRooms[slug].elements = elements || [];
  }

  res.json({ message: "Elements saved successfully", count: memoryRooms[slug].elements.length });
});

import { startKeepAliveBot } from "./keep-alive";

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`HTTP Backend server running on http://localhost:${PORT}`);
  // Start Render auto-ping keep-alive bot (runs every 10 mins)
  startKeepAliveBot(10);
});
