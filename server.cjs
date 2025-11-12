const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

// Path to your yt-dlp.exe (change if needed)
const ytDlpPath = "C:\\Users\\sajib\\Downloads\\Video Downloader\\yt-dlp.exe";

app.use(express.static(path.join(__dirname, "public")));

app.get("/download/:platform", (req, res) => {
  const platform = req.params.platform.replace(/[^a-z0-9_-]/gi, "");
  const videoUrl = req.query.url;

  if (!videoUrl) return res.status(400).send("Missing video URL.");

  // Unique temporary file
  const tempFile = path.join(os.tmpdir(), `${platform}_${uuidv4()}.mp4`);

  console.log(`🎬 Downloading from ${platform}: ${videoUrl}`);

  // Spawn yt-dlp process
  const ytProcess = spawn(ytDlpPath, ["-o", tempFile, "-f", "mp4", videoUrl]);

  ytProcess.stdout.on("data", (data) => console.log(data.toString()));
  ytProcess.stderr.on("data", (data) => console.error(data.toString()));

  ytProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("❌ yt-dlp failed with code:", code);
      return res.status(500).send("Download failed. Check server logs.");
    }

    console.log(`✅ Download complete: ${tempFile}`);

    res.download(tempFile, `${platform}_video.mp4`, (err) => {
      fs.unlink(tempFile, (err) => {
        if (err) console.error("⚠️ Failed to delete temp file:", err.message);
      });
      if (err) console.error("⚠️ Error sending file:", err.message);
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
