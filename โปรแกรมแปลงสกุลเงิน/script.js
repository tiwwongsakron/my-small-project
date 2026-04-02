// ==========================================
// ส่วนที่ 1: ดึงกล่องต่างๆ จากหน้าเว็บมาเตรียมไว้
// ==========================================
// กล่องเลือกสกุลเงิน (Dropdown) เช่น เลือก USD, THB
const currency_one = document.getElementById('currency-one'); // สกุลเงินต้นทาง
const currency_two = document.getElementById('currency-two'); // สกุลเงินปลายทาง

// ช่องพิมพ์ตัวเลขจำนวนเงิน
const amount_one = document.getElementById('amount-one'); // จำนวนเงินต้นทาง
const amount_two = document.getElementById('amount-two'); // จำนวนเงินปลายทาง (ช่องนี้จะเปลี่ยนอัตโนมัติ)

const rateText = document.getElementById('rate'); // พื้นที่สำหรับแสดงข้อความเรทแลกเปลี่ยน (เช่น 1 USD = 35 THB)
const swap = document.getElementById('btn');      // ปุ่มกดสลับสกุลเงิน (ลูกศรขึ้นลง)

// ==========================================
// ส่วนที่ 2: ติดตั้งเซนเซอร์รับรู้การกระทำ (Event Listeners)
// ==========================================
// สั่งว่า "ถ้ามีการเปลี่ยนสกุลเงิน (change) หรือ มีการพิมพ์ตัวเลขใหม่ (input) ให้ไปเรียกฟังก์ชัน calculateMoney มาคิดเลขใหม่ทันที"
currency_one.addEventListener('change', calculateMoney); 
currency_two.addEventListener('change', calculateMoney);
amount_one.addEventListener('input', calculateMoney);
amount_two.addEventListener('input', calculateMoney);

// ==========================================
// ส่วนที่ 3: กลไกหลัก "คำนวณและดึงเรทเงินจากเว็บ" (API)
// ==========================================
function calculateMoney(){
    const one = currency_one.value; // ดึงชื่อสกุลเงินต้นทางมา (เช่น 'USD')
    const two = currency_two.value; // ดึงชื่อสกุลเงินปลายทางมา (เช่น 'THB')
    
    // fetch คือการ "ส่งคนวิ่งไปถามข้อมูลจากเซิร์ฟเวอร์" (ในที่นี้คือไปขอเรทเงินล่าสุดจากเว็บ api)
    fetch(`https://open.er-api.com/v6/latest/${one}`) 
    // .then แรก: พอเซิร์ฟเวอร์ส่งของกลับมา ให้แกะกล่องออกมาเป็นรูปแบบ JSON 
    .then(res => res.json()) 
    // .then สอง: เอาข้อมูลที่แกะแล้ว (data) มาใช้งานต่อ
    .then(data => {
        // ดึงเรทแลกเปลี่ยนเฉพาะสกุลเงินปลายทางที่เราต้องการ
        const rate = data.rates[two]; 
        
        // อัปเดตข้อความเรทเงินให้ผู้ใช้เห็น (เช่น 1 USD = 35.50 THB)
        rateText.innerText = `1 ${one} = ${rate} ${two}`;
        
        // คำนวณเงินปลายทาง: เอาเงินต้นทาง มาคูณกับ เรทแลกเปลี่ยน
        // .toFixed(2) คือการบังคับให้แสดงทศนิยมแค่ 2 ตำแหน่ง (เช่น 35.50999 กลายเป็น 35.51)
        amount_two.value = (amount_one.value * rate).toFixed(2);  
    });
}

// ==========================================
// ส่วนที่ 4: กลไกปุ่ม "สลับสกุลเงิน"
// ==========================================
swap.addEventListener('click', () => {
    // เทคนิคการสลับของ 2 สิ่ง ต้องใช้ "แก้วเปล่า" (temp) 1 ใบมาช่วยพักของ
    // เปรียบเทียบ: สลับน้ำแดง (one) กับ น้ำเขียว (two)
    
    const temp = currency_one.value; // 1. เอาน้ำแดง เทไปพักไว้ในแก้วเปล่า (temp)
    currency_one.value = currency_two.value; // 2. เอาน้ำเขียว เทใส่แก้วน้ำแดงที่เพิ่งว่าง
    currency_two.value = temp; // 3. เอาน้ำแดงที่พักไว้ในแก้ว temp เทใส่แก้วน้ำเขียว
    
    // สลับเสร็จแล้ว ก็เรียกนักบัญชีมาคิดเลขให้ใหม่ด้วย!
    calculateMoney();
});

// ==========================================
// ส่วนที่ 5: เริ่มต้นการทำงาน
// ==========================================
// พอโหลดหน้าเว็บเสร็จปุ๊บ สั่งให้คำนวณเรทเงินโชว์ขึ้นมาก่อนเลย 1 รอบ
calculateMoney();
