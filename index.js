import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const BASE_URL = "https://streamed.pk/api";

// Health check
app.get("/", (req, res) => {
  res.send("✅ Stream Proxy is running");
});

// Proxy: Matches
app.get("/api/matches/live", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/matches/live`);
    if (!response.ok) throw new Error(`Upstream error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Matches proxy error:", err);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

// Proxy: Streams
app.get("/api/stream/:source/:id", async (req, res) => {
  const { source, id } = req.params;
  try {
    const response = await fetch(`${BASE_URL}/stream/${source}/${id}`);
    if (!response.ok) throw new Error(`Upstream error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Stream proxy error:", err);
    res.status(500).json({ error: "Failed to fetch streams" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
});
