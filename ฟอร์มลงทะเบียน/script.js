// ดึง Element จาก HTML มาเก็บไว้ในตัวแปร เพื่อนำไปใช้งานต่อ
const form = document.getElementById('form'); // ตัวแบบฟอร์ม
const username = document.getElementById('username'); // ช่องกรอกชื่อผู้ใช้
const email = document.getElementById('email'); // ช่องกรอกอีเมล
const password1 = document.getElementById('password'); // ช่องกรอกรหัสผ่านหลัก
const password2 = document.getElementById('re-password'); // ช่องยืนยันรหัสผ่าน

// ดักจับเหตุการณ์ตอนที่ผู้ใช้กดปุ่ม Submit (ส่งฟอร์ม)
form.addEventListener('submit', function(e) {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรช (เพื่อตรวจสอบข้อมูลก่อน)

    // 1. ตรวจสอบว่ามีช่องไหนว่างไหม (ส่ง Array ของ input เข้าไปเช็ก)
    checkInput([username, email, password1, password2]);

    // 2. ตรวจสอบรูปแบบอีเมล (ใช้วิธี trim() เพื่อตัดช่องว่างหน้า-หลังออกก่อนเช็ก)
    if (!validateEmail(email.value.trim())) {
        showerror(email, 'อีเมลไม่ถูกต้อง'); // ถ้าไม่ใช่อีเมลจริง ให้แสดง Error
    } else {
        showsuccess(email); // ถ้าถูกต้อง ให้แสดงสถานะ Success
    }

    // 3. ตรวจสอบว่ารหัสผ่านทั้ง 2 ช่องตรงกันไหม
    checkPassword(password1, password2);

    // 4. ตรวจสอบความยาวของชื่อผู้ใช้ (ต้องอยู่ระหว่าง 5 - 10 ตัวอักษร)
    checkInputLength(username, 5, 10);
});

// ฟังก์ชันแสดงข้อความ Error
function showerror(input, message) {
    const formControl = input.parentElement; // เข้าถึง div ที่หุ้ม input นั้นอยู่
    formControl.className = 'form-control error'; // เปลี่ยน Class เป็น error เพื่อเปลี่ยนสี (CSS)
    const small = formControl.querySelector('small'); // หาแท็ก <small> ภายใน div นั้น
    small.innerText = message; // นำข้อความที่ได้รับมา ใส่ลงในแท็ก <small>
}

// ฟังก์ชันแสดงสถานะสำเร็จ
function showsuccess(input) {
    const formControl = input.parentElement; // เข้าถึง div ที่หุ้ม input
    formControl.className = 'form-control success'; // เปลี่ยน Class เป็น success เพื่อเปลี่ยนสีเขียว
}

// ฟังก์ชันใช้ Regular Expression ตรวจสอบรูปแบบ Email (มี @ มี .com ฯลฯ)
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()); // คืนค่า true ถ้าเป็นอีเมลที่ถูกต้อง
}

// ฟังก์ชันวนลูปตรวจสอบว่ามีช่องว่างหรือไม่
function checkInput(inputArray) {
    inputArray.forEach(function(input) {
        if (input.value.trim() === '') { // ถ้าค่าว่าง (หลังตัดช่องว่างแล้ว)
            showerror(input, `กรุณาป้อน ${getInputCase(input)}`); // แสดง Error
        } else {
            showsuccess(input); // ถ้าไม่ว่าง ให้แสดง Success ไว้ก่อน
        }
    });
}

// ฟังก์ชันปรับตัวอักษรตัวแรกของ ID ให้เป็นตัวพิมพ์ใหญ่ (เช่น username -> Username)
function getInputCase(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// ฟังก์ชันเช็กว่ารหัสผ่านตรงกันไหม
function checkPassword(password1, password2) {
    if (password1.value.trim() !== password2.value) { // ถ้าค่าไม่ตรงกัน
        showerror(password2, 'รหัสผ่านไม่ตรงกัน'); // แสดง Error ที่ช่องยืนยันรหัสผ่าน
    }
}

// ฟังก์ชันตรวจสอบความยาวตัวอักษร
function checkInputLength(input, min, max) {
    if (input.value.length < min) { // ถ้าน้อยกว่าค่าที่กำหนด
        showerror(input, `${getInputCase(input)} ต้องมากกว่า ${min} ตัวอักษร`);
    } else if (input.value.length > max) { // ถ้ามากกว่าค่าที่กำหนด
        showerror(input, `${getInputCase(input)} ต้องไม่เกิน ${max} ตัวอักษร`);
    } else { 
        showsuccess(input); // ถ้าอยู่ในเกณฑ์ ให้แสดง Success
    }
}