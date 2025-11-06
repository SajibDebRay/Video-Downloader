import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ytdlp from "yt-dlp-exec";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;


app.use(express.static(path.join(__dirname, "public")));


app.get("/download/youtube", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).send("Invalid YouTube URL");

  try {
    const info = await ytdlp(videoURL, {
      dumpSingleJson: true,
      noWarnings: true,
      quiet: true,
    });

    const format = info.formats.find(
      (f) => f.ext === "mp4" && f.acodec !== "none" && f.vcodec !== "none"
    );
    if (!format) return res.status(500).send("No downloadable format found");

    res.header(
      "Content-Disposition",
      `attachment; filename="${info.title.replace(/[^\w\s]/g, "_")}.mp4"`
    );

    const videoStream = ytdlp.raw(videoURL, {
      format: format.format_id,
      quiet: true,
    });

    videoStream.stdout.pipe(res);
  } catch (err) {
    console.error("YouTube download error:", err);
    res.status(500).send("Error downloading YouTube video");
  }
});


app.get("/download/facebook", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).send("Invalid Facebook URL");

  try {
    
    const apiURL = `https://api.vevioz.com/video/facebook?url=${encodeURIComponent(videoURL)}`;
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error("Facebook API error");

    const data = await response.json();
    if (!data || !data.link) throw new Error("No download link found");

    const videoResponse = await fetch(data.link);
    res.header(
      "Content-Disposition",
      `attachment; filename="facebook_video.mp4"`
    );
    videoResponse.body.pipe(res);
  } catch (err) {
    console.error("Facebook download error:", err);
    res.status(500).send("Error downloading Facebook video");
  }
});


app.get("/download/instagram", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).send("Invalid Instagram URL");

  try {
    const apiURL = `https://api.vevioz.com/video/instagram?url=${encodeURIComponent(videoURL)}`;
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error("Instagram API error");

    const data = await response.json();
    if (!data || !data.link) throw new Error("No download link found");

    const videoResponse = await fetch(data.link);
    res.header(
      "Content-Disposition",
      `attachment; filename="instagram_video.mp4"`
    );
    videoResponse.body.pipe(res);
  } catch (err) {
    console.error("Instagram download error:", err);
    res.status(500).send("Error downloading Instagram video");
  }
});


app.get("/download/tiktok", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).send("Invalid TikTok URL");

  try {
    const apiURL = `https://api.vevioz.com/video/tiktok?url=${encodeURIComponent(videoURL)}`;
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error("TikTok API error");

    const data = await response.json();
    if (!data || !data.link) throw new Error("No download link found");

    const videoResponse = await fetch(data.link);
    res.header(
      "Content-Disposition",
      `attachment; filename="tiktok_video.mp4"`
    );
    videoResponse.body.pipe(res);
  } catch (err) {
    console.error("TikTok download error:", err);
    res.status(500).send("Error downloading TikTok video");
  }
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
