function downloadVideo(platform) {
    let link = '';
    let format = 'highest';

    switch (platform) {
        case 'youtube':
            link = document.querySelector('#youtube-url')?.value.trim();
            format = document.querySelector('#youtube-format')
                ? document.querySelector('#youtube-format').value
                : 'highest';
            break;

        case 'facebook':
            link = document.querySelector('#facebook-url')?.value.trim();
            break;

        case 'instagram':
            link = document.querySelector('#instagram-url')?.value.trim();
            break;

        case 'tiktok':
            link = document.querySelector('#tiktok-url')?.value.trim();
            break;

        default:
            alert("Unsupported platform");
            return;
    }

    if (!link) {
        alert("Please enter a valid URL before downloading.");
        return;
    }

    // Encode URL safely
    const encodedLink = encodeURIComponent(link);
    const downloadURL = `/download/${platform}?url=${encodedLink}&format=${format}`;

    // Show progress indicator
    showLoading(platform);

    // Attempt download
    fetch(downloadURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${platform}_video.mp4`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
            hideLoading();
        })
        .catch(error => {
            console.error(`❌ Error downloading ${platform} video:`, error);
            hideLoading();
            alert(`Error downloading ${platform} video. Check console for details.`);
        });
}

/* 🟡 Optional: Simple loading animation */
function showLoading(platform) {
    const container = document.querySelector(`#${platform}-loader`);
    if (container) {
        container.style.display = 'block';
        container.innerHTML = `<div class="spinner-border text-light" role="status"><span class="sr-only">Loading...</span></div>`;
    }
}

function hideLoading() {
    document.querySelectorAll('[id$="-loader"]').forEach(loader => {
        loader.style.display = 'none';
        loader.innerHTML = '';
    });
}
