const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/download/:platform", (req, res) => {
  const platform = req.params.platform;
  const videoUrl = req.query.url;

  if (!videoUrl) return res.status(400).send("Missing video URL.");

  const tempFile = path.join(__dirname, `${platform}_video.mp4`);

  // yt-dlp command
  const command = `yt-dlp -o "${tempFile}" -f mp4 "${videoUrl}"`;

  console.log(`🎬 Downloading from ${platform}: ${videoUrl}`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Download error: ${stderr || error.message}`);
      return res.status(500).send("Download failed.");
    }

    console.log(`✅ Download complete: ${tempFile}`);

    res.download(tempFile, `${platform}_video.mp4`, err => {
      fs.unlink(tempFile, () => {}); // delete temp file after send
      if (err) console.error("⚠️ Error sending file:", err.message);
    });
  });
});

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
