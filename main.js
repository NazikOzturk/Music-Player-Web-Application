const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");

const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");

const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");

const currentProgress = document.getElementById("current-progress");

let index;

// döngü
let loop = true;

// şarkı listesi
const songsList = [
  {
    name: "Gamzedeyim deva bulmam",
    link: "musics/_Çağrı Çelik - Gamzedeyim Deva Bulmam.mp4",
    artist: "Dedublüman-çağrı çelik",
    image: "musics/dedublüman.jpg",
  },
  {
    name: "Unutulacak dünler var",
    link: "musics/Gazapizm - Unutulacak Dünler.mp4",
    artist: "Gazapizm",
    image: "musics/gazapizm.jpg",
  },
  {
    name: "Seni dert etmeler",
    link: "musics/Madrigal - Seni Dert Etmeler.mp4",
    artist: "Madrigal",
    image: "musics/madrigal.jpg",
  },
  {
    name: "Derinlerde",
    link: "musics/Mark Eliyahu & Cem Adrian - Derinlerde.mp4",
    artist: "Cem Adrian-Mark Eliyahu",
    image: "musics/cem adrian.jpg",
  },
];

// şarkı atama
const setSong = (arrayIndex) => {
  // bir obje içerisini tek bir adımda dışarı çıkartıp, sırasına göre değişkenlere atama
  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  // zamanı ayarla
  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  };
  //şarkı listesini gizle
  playListContainer.classList.add("hide");

  //şarkıyı oynat
  playAudio();
};

//şarkıyı çal
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide"); //görün
  playButton.classList.add("hide"); //kaybol
};

// şarkı kendiliğinden bittiğinde sonrakine geç
audio.onended = () => {
  nextSong();
};

//şarkıyı durdur
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

//sonrakine geç

const nextSong = () => {
  if (loop) {
    if (index == songsList.length - 1) {
      index = 0;
    } else {
      index += 1; // index=index+1
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    setSong(randIndex);
  }
  playAudio();
};

//önceki sarkıya geç
const previousSong = () => {
  pauseAudio();
  if (index > 0) {
    index -= 1; //index=index-1
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
  playAudio();
};

//zaman düzenleyici
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

// tekrar açma kapama
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

//karıştırıcı tıklanıldığında
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = true;
  } else {
    shuffleButton.classList.add("active");
    loop = false;
  }
});

// anlık zamanı yakala
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  // progressi ilerlet
  currentProgress.style.width = `${
    (audio.currentTime / audio.duration) * 100
  }%`;
}, 1000);

// liste ekranını getir
playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

//listeyi kapat
closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

//liste oluşturma

const initializePlayList = () => {
  for (let i in songsList) {
    // 0 1 2 3 4
    playListSongs.innerHTML += `<li class="playlistSong"
      onclick="setSong(${i})">
      <div class="playlist-image-container">
          <img src="${songsList[i].image}"/>
      </div>
      <div class="playlist-song-details">
          <span id="playlist-song-name">
              ${songsList[i].name}
          </span>
          <span id="playlist-song-artist-album">
              ${songsList[i].artist}
          </span>
      </div>
      </li>`;
  }
};

// proggress bar ayarlama

progressBar.addEventListener("click", (event) => {
  let coordStart = progressBar.getBoundingClientRect().left;
  let coorEnd = event.clientX;
  let proggress = (coorEnd - coordStart) / progressBar.offsetWidth;

  currentProgress.style.width = proggress * 100 + "%";

  audio.currentTime = proggress * audio.duration;
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

// zamanı güncelle

audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

//sıradaki butona tıklanıldığında
nextButton.addEventListener("click", nextSong);

//durdur butona tıklanıldığında
pauseButton.addEventListener("click", pauseAudio);

//durdur butona tıklanıldığında
playButton.addEventListener("click", playAudio);

//durdur butona tıklanıldığında

//ekran yükleme
window.onload = () => {
  index = 0;
  setSong(index);
  pauseAudio();
  initializePlayList();
};
