const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const playlist = document.getElementById('playlist');
const nowPlaying = document.querySelector('.now-playing');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const searchInput = document.getElementById('search-input');
const songCount = document.getElementById('song-count');
const clearBtn = document.getElementById('clear-playlist');
const fileInput = document.getElementById('file-input');

// 🎵 MUSIC FILES (UPDATE BASE SA ACTUAL FILES MO)
let songs = [
    { name: 'Die On This Hill', artist: 'Seinna Spiro', url: 'song1.mp3', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500' },
    { name: 'song2', artist: 'Artist 2', url: 'music/song2.mp3', cover: 'https://images.unsplash.com/photo-1459749411177-287ce3276916?w=500' },
    { name: 'song3', artist: 'Artist 3', url: 'music/song3.mp3', cover: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=500' },
    { name: 'song4', artist: 'Artist 4', url: 'music/song4.mp3', cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500' },
    { name: 'song5', artist: 'Artist 5', url: 'music/song5.mp3', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' }
];

let songIndex = 0;
let isShuffle = false;
let isRepeat = false;
let filteredSongs = [...songs];

// Initialize
loadSong(songs[songIndex]);
renderPlaylist();
updateSongCount();

// Load Song
function loadSong(song) {
    title.innerText = song.name;
    artist.innerText = song.artist;
    cover.src = song.cover;
    audio.src = song.url;
    renderPlaylist();
}

// Render Playlist
function renderPlaylist() {
    playlist.innerHTML = '';
    
    if (filteredSongs.length === 0) {
        playlist.innerHTML = '<div class="no-songs">No songs found</div>';
        return;
    }
    
    filteredSongs.forEach((song, index) => {
        const originalIndex = songs.indexOf(song);
        const item = document.createElement('div');
        item.className = `playlist-item ${originalIndex === songIndex ? 'active' : ''}`;
        
        item.innerHTML = `
            <img src="${song.cover}" alt="${song.name}">
            <div class="item-info">
                <h4>${song.name}</h4>
                <p>${song.artist}</p>
            </div>
            ${originalIndex === songIndex && !audio.paused ? 
                '<div class="playing-indicator"><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>' : 
                '<i class="fas fa-play item-play"></i>'}
        `;
        
        item.onclick = () => {
            songIndex = originalIndex;
            loadSong(songs[songIndex]);
            playSong();
        };
        
        playlist.appendChild(item);
    });
}

// Update Song Count
function updateSongCount() {
    songCount.innerText = `(${songs.length} songs)`;
}

// Play Song
function playSong() {
    nowPlaying.classList.add('playing');
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    audio.play();
    renderPlaylist();
}

// Pause Song
function pauseSong() {
    nowPlaying.classList.remove('playing');
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    audio.pause();
    renderPlaylist();
}

// Play/Pause
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// Previous
prevBtn.addEventListener('click', () => {
    if (isShuffle) {
        songIndex = Math.floor(Math.random() * songs.length);
    } else {
        songIndex--;
        if (songIndex < 0) songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
});

// Next
nextBtn.addEventListener('click', () => {
    if (isShuffle) {
        songIndex = Math.floor(Math.random() * songs.length);
    } else {
        songIndex++;
        if (songIndex > songs.length - 1) songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
});

// Shuffle
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

// Repeat
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
});

// Volume Control
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audio.volume = volume;
    
    if (volume == 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
});

// Search Function
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
        filteredSongs = [...songs];
    } else {
        filteredSongs = songs.filter(song =>
            song.name.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm)
        );
    }
    
    renderPlaylist();
});

// Add More Music
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    const newSongs = files.map(file => ({
        name: file.name.replace(/\.[^/.]+$/, ""),
        artist: 'Local File',
        url: URL.createObjectURL(file),
        cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500'
    }));
    
    songs = [...songs, ...newSongs];
    filteredSongs = [...songs];
    updateSongCount();
    renderPlaylist();
    alert(`${newSongs.length} songs added! 🎵`);
});

// Clear Playlist
clearBtn.addEventListener('click', () => {
    if (confirm('Clear all songs from playlist?')) {
        songs = [];
        filteredSongs = [];
        songIndex = 0;
        audio.pause();
        audio.src = '';
        title.innerText = 'No songs';
        artist.innerText = 'Add music to play';
        renderPlaylist();
        updateSongCount();
    }
});

// Progress Bar
audio.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.innerText = formatTime(currentTime);
        durationEl.innerText = formatTime(duration);
    }
});

progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

// Format Time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Auto Next
audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextBtn.click();
    }
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        playBtn.click();
    } else if (e.code === 'ArrowRight') {
        nextBtn.click();
    } else if (e.code === 'ArrowLeft') {
        prevBtn.click();
    }
});