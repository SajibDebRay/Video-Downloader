function downloadVideo(platform) {
      console.log("Download function triggered for", platform);
      const urlInput = document.querySelector(`#${platform}-url`);
      const loader = document.querySelector(`#${platform}-loader`);

      if (!urlInput) {
        alert(`❌ Missing input field for ${platform}.`);
        return;
      }

      const url = urlInput.value.trim();
      if (!url) {
        alert("Please enter a valid video URL.");
        return;
      }

      loader.style.display = "block";
      loader.innerText = "⏳ Downloading... Please wait.";

      fetch(`http://localhost:3000/download/${platform}?url=${encodeURIComponent(url)}`)
        .then(response => {
          if (!response.ok) throw new Error(`Server error: ${response.status}`);
          return response.blob();
        })
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = `${platform}_video.mp4`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(blobUrl);

          loader.innerText = "✅ Download complete!";
          setTimeout(() => (loader.style.display = "none"), 2000);
        })
        .catch(err => {
          console.error(err);
          alert("❌ Download failed. Check console for details.");
          loader.innerText = "❌ Download failed!";
          setTimeout(() => (loader.style.display = "none"), 3000);
        });
    }