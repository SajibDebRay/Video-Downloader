// server.cjs
const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

const app = express();
const PORT = 3000;

// Full path to yt-dlp.exe (Windows)
const ytDlpPath = "C:\\Users\\sajib\\Downloads\\Video Downloader\\yt-dlp.exe";

// Serve static files from public folder if needed
app.use(express.static(path.join(__dirname, "public")));

app.get("/download/:platform", (req, res) => {
  const platform = req.params.platform.replace(/[^a-z0-9_-]/gi, "");
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send("Missing video URL.");
  }

  // Unique temp filename using timestamp
  const tempFile = path.join(os.tmpdir(), `${platform}_${Date.now()}.mp4`);

  console.log(`🎬 Downloading from ${platform}: ${videoUrl}`);

  // Spawn yt-dlp process
  const ytProcess = spawn(ytDlpPath, ["-o", tempFile, "-f", "mp4", videoUrl]);

  ytProcess.stdout.on("data", (data) => console.log(data.toString()));
  ytProcess.stderr.on("data", (data) => console.error(data.toString()));

  ytProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`❌ yt-dlp exited with code ${code}`);
      return res.status(500).send("Download failed. Check server logs.");
    }

    console.log(`✅ Download complete: ${tempFile}`);

    // Send file to client
    res.download(tempFile, `${platform}_video.mp4`, (err) => {
      // Delete temp file
      fs.unlink(tempFile, (unlinkErr) => {
        if (unlinkErr) console.error("⚠️ Failed to delete temp file:", unlinkErr.message);
      });

      if (err) console.error("⚠️ Error sending file:", err.message);
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

