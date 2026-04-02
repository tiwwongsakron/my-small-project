// ==========================================
// ส่วนที่ 1: ดึงช่องกรอกข้อมูลต่างๆ จากหน้าเว็บมาเตรียมไว้
// ==========================================
const form = document.getElementById('form');           // ตัวกล่องฟอร์มทั้งหมด (ครอบทุกช่องไว้)
const username = document.getElementById('username');   // ช่องกรอก "ชื่อผู้ใช้"
const email = document.getElementById('email');         // ช่องกรอก "อีเมล"
const password1 = document.getElementById('password');  // ช่องกรอก "รหัสผ่าน"
const password2 = document.getElementById('re-password');// ช่องกรอก "ยืนยันรหัสผ่าน" อีกรอบ

// ==========================================
// ส่วนที่ 2: ดักจับเหตุการณ์ตอนที่คนกดปุ่ม "ยืนยัน (Submit)"
// ==========================================
form.addEventListener('submit', function(e) {
    // เบรกเว็บไว้ก่อน! ห้ามเพิ่งรีเฟรชหน้าหรือส่งข้อมูลไปจริงๆ ขอตรวจการบ้านก่อน
    e.preventDefault(); 

    // ด่านที่ 1: ตรวจว่า "มีใครแอบส่งช่องว่างเปล่าๆ มาไหม?" (ส่งแบบเหมาเข้าไปเช็กทุกช่อง)
    checkInput([username, email, password1, password2]);

    // ด่านที่ 2: ตรวจว่า "พิมพ์อีเมลมามั่วหรือเปล่า?" (มี @ มี .com ไหม)
    // .trim() คือการตัดช่องว่าง(Spacebar) ที่ผู้ใช้อาจจะเผลอเคาะทิ้งไปก่อนเช็ก
    if (!validateEmail(email.value.trim())) {
        showerror(email, 'รูปแบบอีเมลไม่ถูกต้อง'); // ถ้าอีเมลปลอม ให้ขึ้นตัวแดงเตือน
    } else {
        showsuccess(email); // ถ้าอีเมลเป๊ะ ให้ขึ้นตัวเขียวผ่าน
    }

    // ด่านที่ 3: ตรวจว่า "รหัสผ่าน 2 ช่อง พิมพ์มาเหมือนกันเป๊ะไหม?"
    checkPassword(password1, password2);

    // ด่านที่ 4: ตรวจว่า "ชื่อผู้ใช้ สั้นหรือยาวเกินไปไหม?" (ตั้งกฎไว้ว่าต้อง 5 ถึง 10 ตัวอักษร)
    checkInputLength(username, 5, 10);
});

// ==========================================
// ส่วนที่ 3: ฟังก์ชันแปลงโฉมหน้าตาช่องกรอก (เปลี่ยนสีแดง/เขียว)
// ==========================================

// ฟังก์ชันเมื่อ "กรอกผิดพลาด" (แสดงกล่องสีแดง + ข้อความเตือน)
function showerror(input, message) {
    const formControl = input.parentElement; // มองหา div กล่องใหญ่ที่ครอบช่องกรอกนี้อยู่
    formControl.className = 'form-control error'; // แปะป้ายบอก CSS ว่า "ช่องนี้ผิดนะ ให้เปลี่ยนเป็นสีแดง!"
    
    const small = formControl.querySelector('small'); // หาพื้นที่สำหรับใส่ข้อความเตือน (แท็ก <small>)
    small.innerText = message; // เอาข้อความเตือนที่ส่งมา ไปแปะให้ผู้ใช้เห็น
}

// ฟังก์ชันเมื่อ "กรอกถูกต้อง" (แสดงกล่องสีเขียว)
function showsuccess(input) {
    const formControl = input.parentElement; // มองหา div กล่องใหญ่ที่ครอบช่องกรอกนี้อยู่
    formControl.className = 'form-control success'; // แปะป้ายบอก CSS ว่า "ช่องนี้ผ่าน! ให้เปลี่ยนเป็นสีเขียว"
}

// ==========================================
// ส่วนที่ 4: ฟังก์ชันย่อยที่ใช้ในการตรวจสอบ (หน่วยสอดแนม)
// ==========================================

// 1. หน่วยสอดแนม "อีเมล" (ใช้สูตรสำเร็จรูปลับๆ ที่เรียกว่า Regular Expression)
function validateEmail(email) {
    // โค้ดหน้าตาแปลกๆ บรรทัดนี้คือสูตรเช็กว่า ต้องมีตัวอักษร ตามด้วย @ ตามด้วย . 
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()); // ถ้าตรงสูตรเป๊ะ คืนค่าว่า "จริง (True)"
}

// 2. หน่วยสอดแนม "ช่องว่าง" (ไล่ตรวจทีละช่อง)
function checkInput(inputArray) {
    inputArray.forEach(function(input) {
        if (input.value.trim() === '') { // ถ้าข้อความว่างเปล่า (แอบเคาะเว้นวรรคมาก็โดนจับได้เพราะโดน trim ตัดทิ้ง)
            // ให้แจ้งเตือน โดยดึงชื่อช่องมาบอกด้วยว่าลืมกรอกช่องไหน
            showerror(input, `กรุณาป้อนข้อมูลช่อง ${getInputCase(input)}`); 
        } else {
            showsuccess(input); // ถ้ากรอกมาแล้ว ก็ให้ผ่านไปก่อน
        }
    });
}

// 3. ฟังก์ชันตัวช่วยแต่งหน้าตา "ข้อความแจ้งเตือน" ให้ดูสวยขึ้น
// เช่น ดึง id คำว่า 'username' มาเปลี่ยนให้เป็น 'Username' (ตัว U พิมพ์ใหญ่)
function getInputCase(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// 4. หน่วยสอดแนม "รหัสผ่านแฝด"
function checkPassword(password1, password2) {
    // เอารหัสผ่านช่อง 1 มาเทียบกับช่อง 2
    if (password1.value.trim() !== password2.value) { 
        showerror(password2, 'รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง'); // ถ้าไม่เหมือนกัน ให้ด่าที่ช่อง 2
    }
}

// 5. หน่วยสอดแนม "ความยาวข้อความ" (สายวัด)
function checkInputLength(input, min, max) {
    if (input.value.length < min) { 
        // ถ้าพิมพ์มาสั้นกว่าที่กำหนด
        showerror(input, `${getInputCase(input)} ต้องมีอย่างน้อย ${min} ตัวอักษร`);
    } else if (input.value.length > max) { 
        // ถ้าพิมพ์มายาวเกินไป
        showerror(input, `${getInputCase(input)} ต้องยาวไม่เกิน ${max} ตัวอักษร`);
    } else { 
        showsuccess(input); // ถ้าความยาวพอดีเกณฑ์ ให้ผ่านฉลุย
    }
}
