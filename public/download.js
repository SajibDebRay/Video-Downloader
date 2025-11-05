function downloadVideo(platform) {
    let link = '';
    let format = 'highest';

    switch(platform) {
        case 'youtube':
            link = document.querySelector('#youtube-url').value.trim();
            format = document.querySelector('#youtube-format') 
                        ? document.querySelector('#youtube-format').value 
                        : 'highest';
            break;
        case 'facebook':
            link = document.querySelector('#facebook-url').value.trim();
            break;
        case 'instagram':
            link = document.querySelector('#instagram-url').value.trim();
            break;
        case 'tiktok':
            link = document.querySelector('#tiktok-url').value.trim();
            break;
        default:
            alert("Unsupported platform");
            return;
    }

    if (!link) {
        alert("Please enter a valid URL");
        return;
    }

    const downloadURL = `/download/${platform}?url=${encodeURIComponent(link)}&format=${format}`;
    const a = document.createElement('a');
    a.href = downloadURL;
    a.click();
}

