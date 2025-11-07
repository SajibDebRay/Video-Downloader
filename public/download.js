function download() {
  const url = document.querySelector("#video-url").value.trim();
  const platform = document.querySelector("#platform").value;
  const loader = document.querySelector("#loader");

  if (!url) {
    alert("Please enter a valid video URL.");
    return;
  }

  loader.style.display = "block";

  fetch(`/download/${platform}?url=${encodeURIComponent(url)}`)
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
      loader.style.display = "none";
    })
    .catch(err => {
      console.error(err);
      alert("❌ Download failed. Check the console for details.");
      loader.style.display = "none";
    });
}
