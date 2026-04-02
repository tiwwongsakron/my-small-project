// ==========================================
// ส่วนที่ 1: ดึงส่วนประกอบต่างๆ จากหน้าเว็บ (DOM) มาเตรียมไว้
// ==========================================
const balance = document.getElementById('balance');         // ยอดเงินคงเหลือรวม
const money_plus = document.getElementById('money-plus');   // กล่องแสดงยอด "รายรับ" (สีเขียว)
const money_minus = document.getElementById('money-minus'); // กล่องแสดงยอด "รายจ่าย" (สีแดง)
const list = document.getElementById('list');               // พื้นที่สำหรับแสดงรายการประวัติ (History)
const form = document.getElementById('form');               // แบบฟอร์มกรอกข้อมูล
const text = document.getElementById('text');               // ช่องกรอก "ชื่อรายการ"
const amount = document.getElementById('amount');           // ช่องกรอก "จำนวนเงิน" (ถ้าจ่ายให้ใส่ลบ เช่น -50)

// ==========================================
// ส่วนที่ 2: สมุดบัญชีความจำ (State)
// ==========================================
// สร้าง Array ว่างๆ เปรียบเสมือน "สมุดบัญชี" ไว้จดว่ามีรายการอะไรบ้าง
let transactions = []; 

// ==========================================
// ส่วนที่ 3: ฟังก์ชันผู้ช่วยจิปาถะ (Helpers)
// ==========================================

// ฟังก์ชันแปลงตัวเลขให้มี "ลูกน้ำ" (Comma) เช่น 1000 -> 1,000 เพื่อให้อ่านง่าย
function formatNumber(num) {
    // ใช้ Regular Expression (สูตรหาแพทเทิร์นข้อความ) เติมลูกน้ำคั่นทุกๆ 3 หลัก
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

// ฟังก์ชันสุ่มรหัสประจำตัว (ID) ให้แต่ละรายการ 
function autoID(){
    return Math.floor(Math.random() * 1000000); // สุ่มเลขมา 1 ชุดตั้งแต่ 0 ถึงเกือบๆ 1 ล้าน
}

// ==========================================
// ส่วนที่ 4: ฟังก์ชันจัดการหน้าจอและการคำนวณ (Core Logic)
// ==========================================

// 1. ฟังก์ชัน "จัดโต๊ะใหม่" (ดึงข้อมูลมาแสดงตอนเปิดเว็บ หรือตอนมีอัปเดต)
function init(){
    list.innerHTML = ''; // กวาดประวัติเก่าบนหน้าจอทิ้งให้หมดก่อน (เพื่อจะได้เริ่มพิมพ์ใหม่ไม่ให้มันซ้อนกัน)
    
    // เอาข้อมูลในสมุดบัญชี (transactions) มาวนลูป แล้วโยนให้ฟังก์ชัน addDataToList จัดการทีละรายการ
    transactions.forEach(addDataToList); 
    
    // เรียกฟังก์ชันนักบัญชีมาคิดเลขรวมใหม่
    calculateMoney();
}

// 2. ฟังก์ชัน "สร้างใบเสร็จแปะหน้าเว็บ" (รับข้อมูล 1 รายการมาแสดงผล)
function addDataToList(transaction){ // *แก้ชื่อตัวแปรเป็นเอกพจน์เพื่อให้ไม่งงว่ามันคือ 1 รายการ
    // เช็คว่าเงินติดลบไหม? ถ้าติดลบให้ใช้เครื่องหมาย '-' ถ้าเป็นบวกให้ใช้ '+'
    const symbol = transaction.amount < 0 ? '-' : '+'; 
    
    // แปะป้ายสถานะ: ถ้าเงินติดลบ ให้ป้าย 'minus' (เพื่อไปทำสีแดง) ถ้าเป็นบวก ให้ป้าย 'plus' (ทำสีเขียว)
    const status = transaction.amount < 0 ? 'minus' : 'plus';
    
    const item = document.createElement('li'); // สร้างแท็ก <li> เปล่าๆ ขึ้นมา 1 บรรทัด
    
    // Math.abs() คือการทำให้ตัวเลขเป็น "บวก" เสมอ (เช่น -50 ก็กลายเป็น 50) เพราะเราเอาเครื่องหมายไปใส่เองแล้วในตัวแปร symbol
    const result = formatNumber(Math.abs(transaction.amount)); 
    
    item.classList.add(status); // เอาป้ายสถานะ (minus/plus) ไปแปะใส่ <li> เพื่อให้ CSS รู้ว่าต้องใช้สีอะไร
    
    // ยัดข้อความและปุ่ม [x] (สำหรับกดลบ) เข้าไปใน <li> 
    // โดยถ้ากดปุ่ม [x] มันจะไปเรียกฟังก์ชัน removeData พร้อมส่งรหัส ID ของรายการนั้นไปให้
    item.innerHTML = `${transaction.text} <span> ${symbol}${result}</span><button class="delete-btn" onclick="removeData(${transaction.id})">x</button>`;
    
    list.appendChild(item); // นำ <li> ที่ประกอบร่างเสร็จแล้ว ไปแปะลงบนหน้าเว็บจริงๆ (ในส่วนของ list)
}

// 3. ฟังก์ชัน "นักบัญชี" (สรุปยอดรวม, ยอดรับ, ยอดจ่าย)
function calculateMoney(){
    // .map() คือการ "สกัด" เอามาแค่ "ตัวเลขจำนวนเงิน" อย่างเดียว (จากเดิมที่เป็นก้อนข้อมูลมีทั้ง id, text, amount)
    const amounts = transactions.map(transaction => transaction.amount); 
    
    // .reduce() คือการนำตัวเลขทั้งหมดมา "บวกทบกัน" ไปเรื่อยๆ จนได้ยอดสุทธิ (balance)
    const total = amounts.reduce((result, item) => (result += item), 0).toFixed(2);
    
    // คิดยอด "รายรับ": 
    // ใช้ .filter() กรองเอาเฉพาะตัวเลขที่ "มากกว่า 0" (รายรับ) -> แล้วเอามา .reduce() บวกทบกันทั้งหมด
    const income = amounts.filter(item => item > 0).reduce((result, item) => (result += item), 0).toFixed(2);
    
    // คิดยอด "รายจ่าย": 
    // ใช้ .filter() กรองเอาเฉพาะตัวเลขที่ "น้อยกว่า 0" (รายจ่าย) -> แล้วเอามา .reduce() บวกทบกันทั้งหมด
    const expense = amounts.filter(item => item < 0).reduce((result, item) => (result += item), 0).toFixed(2);
    
    // เอาตัวเลขที่คำนวณเสร็จแล้ว ไปแสดงผลบนหน้าจอ (ใส่ ฿ และลูกน้ำ)
    balance.innerText = `฿` + formatNumber(total);
    money_plus.innerText = `฿` + formatNumber(income);
    money_minus.innerText = `฿` + formatNumber(expense);
}

// ==========================================
// ส่วนที่ 5: ฟังก์ชัน เพิ่ม/ลบ ข้อมูล (Actions)
// ==========================================

// 1. ฟังก์ชัน "ลบรายการ" (ฉีกใบเสร็จทิ้ง)
function removeData(id){
    // อัปเดตสมุดบัญชีใหม่ โดยให้ "คัดกรอง (filter) เอาเฉพาะรายการที่ ID ไม่ตรงกับตัวที่ถูกกดลบ" 
    // (พูดง่ายๆ คือ เตะรายการที่ ID ตรงกันทิ้งไป)
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    init(); // สั่งให้รีเซ็ตและจัดโต๊ะใหม่ เพื่อให้รายการที่เพิ่งลบไป หายไปจากหน้าจอ
}

// 2. ฟังก์ชัน "บันทึกรายการใหม่" (ทำงานตอนกดปุ่ม Submit)
function addTransaction(e){
    e.preventDefault(); // เบรกไม่ให้เว็บรีเฟรชตัวเองตอนกดส่งฟอร์ม
    
    // เช็คว่าผู้ใช้ลืมพิมพ์ชื่อรายการ หรือลืมใส่จำนวนเงินไหม? (.trim() ช่วยตัดการเคาะ Spacebar หลอกๆ ออก)
    if(text.value.trim() === '' || amount.value.trim() === ''){
        alert("กรุณาป้อนข้อมูลให้ครบ");
    } else {
        // ถ้ารายละเอียดครบ ให้จับมัดรวมกันเป็นก้อนข้อมูล (Object) 1 ก้อน
        const data = {
            id: autoID(),             // สุ่ม ID ให้
            text: text.value,         // ชื่อรายการ
            amount: +amount.value     // จำนวนเงิน (ใส่เครื่องหมาย + ข้างหน้าเพื่อให้แน่ใจว่ามันถูกแปลงเป็นตัวเลข ไม่ใช่ข้อความ)
        };
        
        transactions.push(data);  // เอาของใหม่ยัดใส่ต่อท้ายสมุดบัญชี
        addDataToList(data);      // แปะใบเสร็จใหม่ลงบนหน้าจอ
        calculateMoney();         // สั่งให้นักบัญชีคิดเลขยอดรวมใหม่
        
        // ล้างช่องกรอกข้อมูลให้ว่างเปล่า เตรียมรอรับการกรอกรอบถัดไป
        text.value = '';
        amount.value = '';
    }     
}

// ==========================================
// ส่วนที่ 6: จุดสตาร์ทระบบ
// ==========================================
// รอฟังคำสั่งว่า ถ้ามีการกดส่งฟอร์ม (submit) ให้ไปเรียกฟังก์ชัน addTransaction มาทำงาน
form.addEventListener('submit', addTransaction);

// ตอนโหลดเปิดเว็บมาครั้งแรก ให้เรียกฟังก์ชันนี้เพื่อโชว์ยอดเริ่มต้น (เป็น 0) ขึ้นมาก่อน
init();
