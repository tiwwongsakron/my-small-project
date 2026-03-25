const music_container = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progress_container = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');

const songs = [
    {
        name: "Contra",
        background: "linear-gradient(to bottom, #2d5a27, #000000)" // ธีมป่าทหาร สีเขียวเข้ม-ดำ
    },
    {
        name: "HavestMoon",
        background: "linear-gradient(to bottom, #7cfc00, #fff700)" // ธีมฟาร์ม สีเขียวอ่อน-เหลือง
    },
    {
        name: "Mario",
        background: "linear-gradient(to bottom, #60A3FF, #80D0F0)" // ธีมท้องฟ้า สีฟ้า-ฟ้าอ่อน
    }
];

let index = 2 ;



function loadSongs(songData){
    title.innerText = `SONG ${songData.name}.mp3`;
    cover.src=`cover/${songData.name}.jpg`;
    audio.src=`music/${songData.name}.mp3`;

    document.body.style.background = songData.background;
}


loadSongs(songs[index])

playBtn.addEventListener('click',()=>{
    const isPlay = music_container.classList.contains('play');

    if(isPlay){
        pauseSong();
    }else{
        playSong();
    }
});

function nextSong(){
    index++;
    if (index > songs.length - 1) {
        index = 0;
    }
    loadSongs(songs[index]);
    playSong();

}

nextBtn.addEventListener('click',nextSong);

prevBtn.addEventListener('click',()=>{
    index--;
    if(index<0){
        index=songs.length-1;
    }
    loadSongs(songs[index]);
    playSong();
});

function playSong(){
    music_container.classList.add('play');
    playBtn.querySelector("i.fa-solid").classList.remove('fa-play');
    playBtn.querySelector("i.fa-solid").classList.add('fa-pause');
    audio.play();

}
function pauseSong(){
    music_container.classList.remove('play');
    playBtn.querySelector("i.fa-solid").classList.remove('fa-pause');
    playBtn.querySelector("i.fa-solid").classList.add('fa-play');
    audio.pause();    
}

audio.addEventListener('timeupdate',updateProgress);

function updateProgress(e){
    const {duration,currentTime} = e.srcElement;
    const progressPercent=(currentTime/duration)*100;
    progress.style.width=`${progressPercent}%`;
}
progress_container.addEventListener('click',setProcess);

function setProcess(e){
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX/width)*duration;
}
audio.addEventListener('ended',nextSong);



