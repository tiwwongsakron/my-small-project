// ==========================================
// ส่วนที่ 1: ดึงองค์ประกอบต่างๆ จากหน้าเว็บมาเตรียมไว้
// ==========================================
const swichToggle = document.querySelector('input[type="checkbox"]'); // สวิตช์เปิด-ปิด (Checkbox)
const toggleIcon = document.getElementById('toggle-icon'); // กล่องที่เก็บ "ข้อความ" และ "ไอคอนพระอาทิตย์/พระจันทร์"
const nav = document.getElementById('nav');                // แถบเมนูด้านบน (Navigation Bar)
const image1 = document.getElementById('image1');          // รูปภาพที่ 1
const image2 = document.getElementById('image2');          // รูปภาพที่ 2
const image3 = document.getElementById('image3');          // รูปภาพที่ 3

// ==========================================
// ส่วนที่ 2: ฟังก์ชันหลัก "สลับโหมด" (หัวใจสำคัญ)
// ==========================================
function switchMode(e){
    // เช็คว่าสวิตช์ถูก "เปิด" (ติ๊กถูก) อยู่หรือเปล่า?
    if(e.target.checked){
        // ถ้าสวิตช์เปิด = ไปโหมดมืด (Dark Mode)
        document.documentElement.setAttribute('data-theme', 'dark'); // แปะป้ายบอกเว็บทั้งหน้าว่า "ตอนนี้ใช้ธีมมืดนะ" (เพื่อให้ CSS เปลี่ยนสีตาม)
        darkMode();               // สั่งให้เปลี่ยนหน้าตาเป็นโหมดมืด
        imageSwitchMode('dark');  // สั่งให้เปลี่ยนรูปภาพเป็นเซ็ตโหมดมืด
    } else {
        // ถ้าสวิตช์ปิด = กลับไปโหมดสว่าง (Light Mode)
        document.documentElement.setAttribute('data-theme', 'light'); // แปะป้ายบอกเว็บว่า "กลับมาใช้ธีมสว่าง"
        lightMode();               // สั่งให้เปลี่ยนหน้าตาเป็นโหมดสว่าง
        imageSwitchMode('light');  // สั่งให้เปลี่ยนรูปภาพเป็นเซ็ตโหมดสว่าง
    }
}

// ==========================================
// ส่วนที่ 3: ฟังก์ชันจัดการหน้าตาเว็บแยกตามโหมด
// ==========================================

// เมื่อเข้าสู่ "โหมดมืด"
function darkMode(){
    toggleIcon.children[0].textContent = "โหมดกลางคืน"; // เปลี่ยนข้อความ (ลูกคนแรกในกล่อง) เป็น "โหมดกลางคืน"
    toggleIcon.children[1].classList.replace("fa-sun", "fa-moon"); // เปลี่ยนไอคอน (ลูกคนที่สอง) จากพระอาทิตย์ เป็น พระจันทร์
    nav.style.backgroundColor = 'rgb(0 0 0 / 50%)'; // เปลี่ยนสีพื้นหลังแถบเมนูให้เป็น สีดำแบบโปร่งแสง (เพื่อให้ดูเข้ากับธีมมืด)
}

// เมื่อเข้าสู่ "โหมดสว่าง"
function lightMode(){
    toggleIcon.children[0].textContent = "โหมดกลางวัน"; // เปลี่ยนข้อความกลับเป็น "โหมดกลางวัน"
    toggleIcon.children[1].classList.replace("fa-moon", "fa-sun"); // เปลี่ยนไอคอนกลับจากพระจันทร์ เป็น พระอาทิตย์
    nav.style.backgroundColor = 'rgb(255 255 255 / 50%)'; // เปลี่ยนสีพื้นหลังแถบเมนูให้เป็น สีขาวแบบโปร่งแสง
}   

// ==========================================
// ส่วนที่ 4: ฟังก์ชันสำหรับ "เปลี่ยนรูปภาพ" ตามโหมด
// ==========================================
// รับค่า 'mode' เข้ามา (ซึ่งจะเป็นคำว่า 'dark' หรือ 'light') เพื่อเอาไปต่อท้ายชื่อไฟล์รูป
function imageSwitchMode(mode){
    image1.src = `img/undraw_continuous-_${mode}.svg`; // ตัวอย่าง: ถ้าโหมด dark ก็จะดึงรูปชื่อ undraw_continuous-_dark.svg มาใช้
    image2.src = `img/undraw_exam-prep_${mode}.svg`;
    image3.src = `img/undraw_playing-fetch_${mode}.svg`;
}

// ==========================================
// ส่วนที่ 5: เริ่มต้นการทำงาน (จับตาดูสวิตช์)
// ==========================================
// สั่งให้ระบบคอยจับตาดูสวิตช์ (swichToggle) ไว้ ถ้ามีการ "เปลี่ยนสถานะ" (change) ให้เรียกใช้ฟังก์ชัน switchMode ทันที
swichToggle.addEventListener("change", switchMode);
