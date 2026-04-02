// ==========================================
// ส่วนที่ 1: ดึงองค์ประกอบต่างๆ จากหน้าเว็บ (กล่อง, ปุ่ม, ตัวหนังสือ)
// ==========================================
const countDownForm = document.getElementById('countDownForm');       // ฟอร์มสำหรับกรอกชื่อและวันที่
const inputContainer = document.getElementById('input-container');    // หน้าจอ "ตั้งค่า" (หน้าแรก)
const dateEl = document.getElementById('date-picker');                // ช่องเลือกวันที่
const countDownEl = document.getElementById('countdown');             // หน้าจอ "กำลังนับถอยหลัง"

const countdownTitleEl = document.getElementById('countdown-title');  // ข้อความหัวข้อที่กำลังนับถอยหลัง
const countdownButtonEl = document.getElementById('countdown-button');// ปุ่ม "ยกเลิก" (กลับไปตั้งค่าใหม่)
const timeEl = document.querySelectorAll('span');                     // ตัวเลข วัน, ชั่วโมง, นาที, วินาที (ดึงมาเป็นกลุ่ม)

const completeEl = document.getElementById('complete');               // หน้าจอ "หมดเวลาแล้ว!"
const completeInfoEl = document.getElementById('complete-info');      // ข้อความสรุปตอนหมดเวลา
const completeButton = document.getElementById('complete-button');    // ปุ่ม "ตั้งค่าใหม่" ตอนหมดเวลา

// ==========================================
// ส่วนที่ 2: ตัวแปรสำหรับเก็บข้อมูล (ความจำของระบบ)
// ==========================================
let countDownTitle = ''; // เก็บชื่อกิจกรรม (เช่น "วันเกิด", "ปีใหม่")
let countDownDate = '';  // เก็บวันที่เป้าหมาย

let countDownValue = Date; // เก็บเวลาเป้าหมายในรูปแบบตัวเลข (มิลลิวินาที)
let countDownActive;       // ตัวแปรสำหรับเก็บ "รอบการทำงาน (Interval)" เพื่อใช้สั่งหยุด
let saveCountDown;         // เก็บข้อมูลรูปแบบก้อน Object ไว้เซฟลงเครื่อง

// สร้างตัวแปรคำนวณเวลา (เพื่อให้ง่ายต่อการแปลงหน่วย)
// คอมพิวเตอร์นับเวลาเป็น "มิลลิวินาที" (1 วินาที = 1,000 มิลลิวินาที)
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// ==========================================
// ส่วนที่ 3: ฟังก์ชันตอนกด "ตกลง" ในฟอร์มตั้งค่า
// ==========================================
countDownForm.addEventListener('submit', updateCountDown);

function updateCountDown(e){
    e.preventDefault(); // ป้องกันไม่ให้เว็บรีเฟรชตัวเองตอนกด Submit ฟอร์ม
    
    // ดึงค่าจากช่องที่ 1 (ชื่อ) และช่องที่ 2 (วันที่) มาเก็บไว้
    countDownTitle = e.target[0].value;
    countDownDate = e.target[1].value;

    // เช็คว่าผู้ใช้ลืมพิมพ์ชื่อหรือเปล่า (พิมพ์แต่ช่องว่าง)
    if(countDownTitle === ' '){
        alert("ป้อนข้อมูลไม่ครบ");
    } else {
        // จับชื่อกับวันที่มามัดรวมกันเป็นก้อน
        saveCountDown = { title: countDownTitle, date: countDownDate };
        
        // เซฟข้อมูลลงในความจำเครื่อง (Local Storage) เผื่อผู้ใช้ปิดเว็บเปิดใหม่ จะได้จำได้
        // ต้องแปลงก้อนข้อมูลให้เป็นข้อความ (String) ก่อนเซฟ ด้วย JSON.stringify
        localStorage.setItem('countDown', JSON.stringify(saveCountDown)); 
        
        // แปลงวันที่ที่เลือก ให้กลายเป็นตัวเลขมิลลิวินาที เพื่อเตรียมเอาไปลบกับเวลาปัจจุบัน
        countDownValue = new Date(countDownDate).getTime(); 
        
        setUptime(); // สั่งให้เริ่มนับถอยหลัง!
    }
}

// ==========================================
// ส่วนที่ 4: ฟังก์ชัน "กลไกการนับถอยหลัง" (หัวใจหลัก)
// ==========================================
function setUptime(){
    // ใช้ setInterval เพื่อสั่งให้โค้ดข้างในนี้ ทำงานซ้ำๆ "ทุกๆ 1 วินาที"
    countDownActive = setInterval(() => {
        const now = new Date().getTime(); // ดูเวลา ณ วินาทีปัจจุบัน
        const distance = countDownValue - now; // เอา "เวลาเป้าหมาย" ลบ "เวลาปัจจุบัน" (ระยะห่าง)

        // คำนวณออกมาเป็น วัน, ชั่วโมง, นาที, วินาที (ใช้ Math.floor ตัดเศษทศนิยมทิ้ง)
        const days = Math.floor(distance / day); 
        const hours = Math.floor((distance % day) / hour);     // เอาเศษที่เหลือจากวัน มาหาชั่วโมง
        const minutes = Math.floor((distance % hour) / minute); // เอาเศษที่เหลือจากชั่วโมง มาหานาที
        const seconds = Math.floor((distance % minute) / second); // เอาเศษที่เหลือจากนาที มาหาวินาที
        
        inputContainer.hidden = true; // ซ่อนหน้า "ตั้งค่า" ไปซะ เพราะเริ่มนับถอยหลังแล้ว
        
        // เช็คว่า "ถึงเวลาหรือยัง?"
        if(distance < 0){
            // ถ้าระยะห่างติดลบ แสดงว่า "หมดเวลาแล้ว"
            countDownEl.hidden = true;  // ซ่อนหน้าจอนับถอยหลัง
            completeEl.hidden = false;  // โชว์หน้าจอ "หมดเวลา (Complete)" แทน
            completeInfoEl.textContent = `${countDownTitle} วันที่ ${countDownDate}`; // แสดงข้อความสรุปผล
            clearInterval(countDownActive); // สั่ง "หยุด" กลไกการทำงานซ้ำๆ (ไม่งั้นมันจะนับถอยหลังติดลบไปเรื่อยๆ)
        } else {
            // ถ้ายังไม่หมดเวลา ก็ให้อัปเดตตัวเลขบนหน้าจอไปเรื่อยๆ
            countdownTitleEl.textContent = `${countDownTitle}`;
            timeEl[0].textContent = `${days}`;
            timeEl[1].textContent = `${hours}`;
            timeEl[2].textContent = `${minutes}`;
            timeEl[3].textContent = `${seconds}`;
            
            countDownEl.hidden = false; // โชว์หน้าจอนับถอยหลัง
            completeEl.hidden = true;   // ซ่อนหน้าจอหมดเวลา
        }

    }, second); // ,second ตรงนี้คือการบอกว่าให้รันทุกๆ 1 วินาที (1000 มิลลิวินาที)
}

// ==========================================
// ส่วนที่ 5: ฟังก์ชันดึงความจำตอน "เปิดเว็บใหม่"
// ==========================================
function callDatainStore(){
    // เช็คว่าในเครื่องเคยเซฟตั้งค่าอะไรไว้ไหม?
    if(localStorage.getItem("countDown")){
        inputContainer.hidden = true; // ถ้าเคยเซฟ ให้ซ่อนหน้าตั้งค่าไปเลยไม่ต้องกรอกใหม่
        
        // ดึงข้อความที่เซฟไว้ มาแปลงกลับเป็นก้อนข้อมูล (Object) เพื่อเอามาใช้งาน
        saveCountDown = JSON.parse(localStorage.getItem('countDown'));
        
        // เอาค่าเก่ากลับมาใส่ตัวแปร
        countDownTitle = saveCountDown.title;
        countDownDate = saveCountDown.date;
        countDownValue = new Date(countDownDate).getTime();
        
        setUptime(); // สั่งให้เริ่มนับถอยหลังต่อจากของเดิมได้เลย!
    }
}

// ==========================================
// ส่วนที่ 6: ฟังก์ชัน "รีเซ็ต / ยกเลิก"
// ==========================================
function reset(){
    localStorage.removeItem('countDown'); // ลบข้อมูลที่เซฟไว้ออกจากเครื่อง
    completeEl.hidden = true;             // ซ่อนหน้าจอหมดเวลา
    countDownEl.hidden = true;            // ซ่อนหน้าจอนับถอยหลัง
    inputContainer.hidden = false;        // โชว์หน้าตั้งค่ากลับขึ้นมาใหม่
    clearInterval(countDownActive);       // สั่งหยุดกลไกนับเวลา
    
    // ล้างค่าตัวแปรให้เป็นค่าว่าง (เริ่มต้นใหม่หมด)
    countDownTitle = '';
    countDownDate = '';
}

// ==========================================
// ส่วนที่ 7: จุดสตาร์ทการทำงาน
// ==========================================
callDatainStore(); // ตอนเปิดเว็บขึ้นมา ให้ลองเรียกหาข้อมูลที่เซฟไว้ก่อนเป็นอันดับแรก

// เอาปุ่มกดยกเลิก ไปผูกกับฟังก์ชัน reset
countdownButtonEl.addEventListener('click', reset); // ปุ่มยกเลิกหน้าตอนกำลังนับเวลา
completeButton.addEventListener('click', reset);    // ปุ่มตั้งเวลาใหม่หน้าตอนหมดเวลา
