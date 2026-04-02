// ==========================================
// ส่วนที่ 1: ดึงส่วนประกอบต่างๆ จากหน้าเว็บมาเตรียมไว้
// ==========================================
const music_container = document.getElementById('music-container'); // กล่องครอบเครื่องเล่นเพลงทั้งหมด
const playBtn = document.getElementById('play');       // ปุ่ม เล่น/หยุด
const prevBtn = document.getElementById('prev');       // ปุ่ม ย้อนกลับ
const nextBtn = document.getElementById('next');       // ปุ่ม ถัดไป
const audio = document.getElementById('audio');        // ตัวเล่นเสียง (Audio Tag)
const progress = document.getElementById('progress');  // แถบสีที่วิ่งตามเวลาเพลง (หลอดเวลา)
const progress_container = document.getElementById('progress-container'); // พื้นหลังของแถบเวลา
const title = document.getElementById('title');        // ข้อความชื่อเพลง
const cover = document.getElementById('cover');        // รูปหน้าปกเพลง

// ==========================================
// ส่วนที่ 2: คลังเพลงของเรา (ข้อมูลเพลงและสีพื้นหลัง)
// ==========================================
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

// ==========================================
// ส่วนที่ 3: ตั้งค่าเริ่มต้น
// ==========================================
let index = 2; // กำหนดให้เปิดเว็บมาแล้วอยู่ที่เพลงลำดับที่ 3 (Mario) เพราะเริ่มนับจาก 0, 1, 2

// ฟังก์ชันสำหรับ "โหลดข้อมูลเพลง" ไปใส่ในหน้าเว็บ
function loadSongs(songData){
    title.innerText = `SONG ${songData.name}.mp3`; // เปลี่ยนชื่อเพลงบนจอ
    cover.src = `cover/${songData.name}.jpg`;      // เอารูปปกใหม่มาใส่
    audio.src = `music/${songData.name}.mp3`;      // ดึงไฟล์เสียงใหม่มาเตรียมเล่น
    document.body.style.background = songData.background; // เปลี่ยนสีพื้นหลังเว็บตามธีมของเพลงนั้น
}

// สั่งโหลดเพลงเริ่มต้นตอนเปิดเว็บทันที
loadSongs(songs[index]);

// ==========================================
// ส่วนที่ 4: ระบบควบคุมการเล่นเพลง (Play, Pause, Next, Prev)
// ==========================================

// 1. เมื่อกดปุ่ม "เล่น/หยุด" 
playBtn.addEventListener('click', () => {
    // เช็คว่าตอนนี้เครื่องเล่นกำลังมีสถานะ "play" อยู่หรือเปล่า?
    const isPlay = music_container.classList.contains('play');

    if(isPlay){
        pauseSong(); // ถ้าเล่นอยู่ ให้หยุด
    } else {
        playSong();  // ถ้าหยุดอยู่ ให้เล่น
    }
});

// ฟังก์ชัน "เล่นเพลง"
function playSong(){
    music_container.classList.add('play'); // แปะป้ายบอกว่า "ตอนนี้กำลังเล่นอยู่นะ"
    playBtn.querySelector("i.fa-solid").classList.remove('fa-play'); // เอาไอคอนรูป Play ออก
    playBtn.querySelector("i.fa-solid").classList.add('fa-pause');   // เปลี่ยนเป็นไอคอนรูป Pause แทน
    audio.play(); // สั่งให้เสียงเริ่มดัง
}

// ฟังก์ชัน "หยุดเพลง"
function pauseSong(){
    music_container.classList.remove('play'); // ดึงป้าย "กำลังเล่น" ออก
    playBtn.querySelector("i.fa-solid").classList.remove('fa-pause'); // เอาไอคอนรูป Pause ออก
    playBtn.querySelector("i.fa-solid").classList.add('fa-play');     // กลับไปเป็นไอคอนรูป Play เหมือนเดิม
    audio.pause(); // สั่งให้เสียงหยุดพัก
}

// 2. ฟังก์ชันเมื่อกดปุ่ม "เพลงถัดไป"
function nextSong(){
    index++; // เลื่อนลำดับเพลงไปอีก 1
    
    // ถ้าเลื่อนไปจนทะลุเพลงสุดท้ายแล้ว ให้วนกลับมาเริ่มเพลงแรกใหม่ (ลำดับที่ 0)
    if (index > songs.length - 1) {
        index = 0;
    }
    
    loadSongs(songs[index]); // โหลดข้อมูลเพลงใหม่
    playSong();              // แล้วสั่งให้เล่นเลย
}

nextBtn.addEventListener('click', nextSong); // ผูกปุ่ม ถัดไป เข้ากับฟังก์ชัน nextSong

// 3. เมื่อกดปุ่ม "เพลงก่อนหน้า"
prevBtn.addEventListener('click', () => {
    index--; // ถอยลำดับเพลงลง 1
    
    // ถ้าถอยจนทะลุเพลงแรกไปแล้ว (ติดลบ) ให้วนไปหน้าท้ายสุดของเพลย์ลิสต์
    if(index < 0){
        index = songs.length - 1;
    }
    
    loadSongs(songs[index]); // โหลดข้อมูลเพลงใหม่
    playSong();              // แล้วสั่งให้เล่น
});

// ==========================================
// ส่วนที่ 5: ระบบแถบเวลา (Progress Bar)
// ==========================================

// 1. ทำให้ "หลอดเวลา" ขยับตามความยาวเพลงที่เล่นไปแล้ว
audio.addEventListener('timeupdate', updateProgress); // คอยจับตาดูตลอดเวลาที่เพลงกำลังเล่น

function updateProgress(e){
    const { duration, currentTime } = e.srcElement; // ดึงค่า "ความยาวเพลงทั้งหมด" และ "เวลาปัจจุบันที่เล่นอยู่"
    const progressPercent = (currentTime / duration) * 100; // เทียบบัญญัติไตรยางศ์หาเปอร์เซ็นต์
    progress.style.width = `${progressPercent}%`; // สั่งให้แถบสียืดออกไปตามเปอร์เซ็นต์ที่คำนวณได้
}

// 2. ทำให้สามารถ "คลิกจิ้มข้ามเวลาเพลง" ตรงแถบเวลาได้
progress_container.addEventListener('click', setProcess);

function setProcess(e){
    const width = this.clientWidth;   // ความกว้างทั้งหมดของหลอดเวลา
    const clickX = e.offsetX;         // ตำแหน่ง (แกน X) ที่เราเอาเมาส์ไปคลิก
    const duration = audio.duration;  // ความยาวของเพลงนี้ทั้งหมด
    
    // คำนวณว่าจิ้มไปตรงจุดไหน แล้วสั่งให้เวลาของเพลง (currentTime) กระโดดไปตรงจุดนั้นเลย
    audio.currentTime = (clickX / width) * duration;
}

// ==========================================
// ส่วนที่ 6: เล่นอัตโนมัติ
// ==========================================
// เมื่อเพลงเล่นจนจบ (ended) ให้รันฟังก์ชัน nextSong เพื่อเล่นเพลงถัดไปทันที
audio.addEventListener('ended', nextSong);
