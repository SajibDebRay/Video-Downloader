import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ytdl from 'ytdl-core';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;


app.use(express.static(path.join(__dirname, 'public')));


app.get('/download/youtube', async (req, res) => {
    const url = req.query.url;
    const format = req.query.format || 'highest';
    if (!url || !ytdl.validateURL(url)) return res.status(400).send("Invalid YouTube URL");

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        let itag;
        if (format === '360p') itag = 18;
        else if (format === '720p') itag = 22;

        ytdl(url, { quality: itag }).pipe(res);
    } catch (err) {
        res.status(500).send("Error downloading YouTube video");
    }
});


app.get('/download/facebook', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send("Missing URL");

    try {
        const response = await fetch(url);
        const text = await response.text();

       
        const match = text.match(/"playable_url":"([^"]+)"/);
        if (!match) return res.status(400).send("Unable to extract Facebook video");

        const videoURL = match[1].replace(/\\u0025/g, '%').replace(/\\/g, '');
        const filename = "FacebookVideo.mp4";

        res.header('Content-Disposition', `attachment; filename="${filename}"`);
        const videoRes = await fetch(videoURL);
        videoRes.body.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error downloading Facebook video");
    }
});


app.get('/download/instagram', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send("Missing URL");

    try {
        const response = await fetch(url + '?__a=1&__d=dis');
        const data = await response.json();

        let videoURL = null;
        if (data.graphql && data.graphql.shortcode_media) {
            videoURL = data.graphql.shortcode_media.video_url;
        }
        if (!videoURL) return res.status(400).send("Unable to extract Instagram video");

        const filename = "InstagramVideo.mp4";
        res.header('Content-Disposition', `attachment; filename="${filename}"`);

        const videoRes = await fetch(videoURL);
        videoRes.body.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error downloading Instagram video");
    }
});


app.get('/download/tiktok', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send("Missing URL");

    try {
        const response = await fetch(url);
        const text = await response.text();

        const match = text.match(/"downloadAddr":"([^"]+)"/);
        if (!match) return res.status(400).send("Unable to extract TikTok video");

        const videoURL = match[1].replace(/\\/g, '');
        const filename = "TikTokVideo.mp4";

        res.header('Content-Disposition', `attachment; filename="${filename}"`);
        const videoRes = await fetch(videoURL);
        videoRes.body.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error downloading TikTok video");
    }
});


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
