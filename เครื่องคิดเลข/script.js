// ==========================================
// ส่วนที่ 1: ดึงของจากหน้าเว็บมาเตรียมไว้ใช้งาน
// ==========================================
const calculatorDisplay = document.querySelector('h1'); // หน้าจอแสดงผล
const inputBtn = document.querySelectorAll('button');   // ปุ่มทั้งหมดบนเครื่องคิดเลข
const clearBtn = document.getElementById('clear-btn');  // ปุ่มล้างค่า (AC)

// ==========================================
// ส่วนที่ 2: สูตรคำนวณ (บวก ลบ คูณ หาร)
// ==========================================
const calculate = {
    "/": (firstNumber, seconNumber) => seconNumber != 0 ? firstNumber / seconNumber : "error", // หาร (ป้องกันการหารด้วย 0)
    "*": (firstNumber, seconNumber) => firstNumber * seconNumber, // คูณ
    "+": (firstNumber, seconNumber) => firstNumber + seconNumber, // บวก
    "-": (firstNumber, seconNumber) => firstNumber - seconNumber, // ลบ
    "=": (firstNumber, seconNumber) => seconNumber                // เท่ากับ (คืนค่าตัวหลังสุด)
}

// ==========================================
// ส่วนที่ 3: ความจำของเครื่องคิดเลข (ตัวแปรเก็บสถานะ)
// ==========================================
let firstValue = 0;      // จำตัวเลข "ชุดแรก"
let operatorValue = '';  // จำ "เครื่องหมาย" ที่เพิ่งกด (+, -, *, /)
let waitFornext = false; // สวิตช์เช็คว่า: "ตอนนี้กำลังรอพิมพ์เลขชุดที่สองอยู่ใช่ไหม?"

// ==========================================
// ส่วนที่ 4: ฟังก์ชันการทำงานหลัก
// ==========================================

// 1. เมื่อกดปุ่ม "เครื่องหมาย" (+, -, *, /, =)
function callOperator(operator) {
    const currentValue = Number(calculatorDisplay.textContent); // อ่านเลขจากหน้าจอมาเป็นตัวเลขจริงๆ

    // ถ้าเผลอกดเปลี่ยนเครื่องหมายกะทันหัน (เช่น กด + แล้วเปลี่ยนใจกด - ทันที)
    // ให้จำเครื่องหมายใหม่ล่าสุดไปเลย แล้วจบการทำงาน
    if (operatorValue && waitFornext) {
        operatorValue = operator;
        return;
    }

    // ถ้ายังไม่มีเลขชุดแรกในความจำ ให้เอาเลขบนจอตอนนี้แหละเป็นชุดแรก
    if (!firstValue) {
        firstValue = currentValue;
    } else {
        // ถ้ามีเลขชุดแรกเก็บไว้อยู่แล้ว ให้จับมาคำนวณกับเลขบนหน้าจอได้เลย
        const result = calculate[operatorValue](firstValue, currentValue);
        calculatorDisplay.textContent = result; // โชว์คำตอบบนจอ
        firstValue = result;                    // เอาคำตอบไปตั้งต้นใหม่ เผื่อกดคำนวณต่อยาวๆ
        
        if (firstValue === "error") resetAll(); // ถ้าเจอ Error (เช่นหาร 0) ให้ล้างเครื่องใหม่หมด
    }

    waitFornext = true;       // เปิดสวิตช์บอกว่า "เตรียมพิมพ์เลขชุดถัดไปได้เลยนะ"
    operatorValue = operator; // จำเครื่องหมายล่าสุดที่กดไว้
}

// 2. เมื่อกดปุ่ม "ตัวเลข" (0-9)
function setNumberValue(number) {
    // ถ้าสวิตช์ "รอพิมพ์เลขใหม่" เปิดอยู่ (คือเพิ่งกดเครื่องหมายมา)
    if (waitFornext) {
        calculatorDisplay.textContent = number; // ให้เอาเลขใหม่ไปทับบนจอเลย
        waitFornext = false;                    // ปิดสวิตช์ซะ เพราะเริ่มพิมพ์เลขใหม่แล้ว
    } else {
        // ถ้าเป็นการพิมพ์เลขปกติ
        const displayValue = calculatorDisplay.textContent;
        // ถ้าบนจอเป็น 0 ตัวเดียว ให้พิมพ์เลขใหม่ทับไปเลย แต่ถ้าไม่ใช่ ให้พิมพ์ต่อท้ายกันไปเรื่อยๆ (เช่น 1..2..3)
        calculatorDisplay.textContent = displayValue === '0' ? number : displayValue + number;
    }
}

// 3. เมื่อกดปุ่ม "จุดทศนิยม" (.)
function addDecimal() {
    if (waitFornext) return; // ถ้าเพิ่งกดเครื่องหมายมา ห้ามขึ้นต้นด้วยจุดดื้อๆ ให้ข้ามไปเลย
    
    // ถ้าบนหน้าจอยังไม่มีจุด ถึงจะยอมให้เติมจุดต่อท้ายได้ (ป้องกันการพิมพ์จุดเบิ้ล เช่น 1.2.3)
    if (!calculatorDisplay.textContent.includes(".")) {
        calculatorDisplay.textContent = `${calculatorDisplay.textContent}.`;
    }
}

// ==========================================
// ส่วนที่ 5: สั่งให้ปุ่มต่างๆ ทำงานเมื่อถูกคลิก
// ==========================================
inputBtn.forEach((input) => {
    if (input.classList.length === 0) {
        // กลุ่มปุ่มตัวเลขปกติ (ไม่มี Class) -> ให้ทำงานฟังก์ชันพิมพ์ตัวเลข
        input.addEventListener('click', () => setNumberValue(input.value));
    } else if (input.classList.contains('operator')) {
        // กลุ่มปุ่มเครื่องหมาย -> ให้ทำงานฟังก์ชันคำนวณ
        input.addEventListener('click', () => callOperator(input.value));
    } else if (input.classList.contains('decimal')) {
        // ปุ่มจุดทศนิยม -> ให้เติมจุด
        input.addEventListener('click', () => addDecimal());
    }
});

// 4. เมื่อกดปุ่ม AC (ล้างหน้าจอ)
function resetAll() {
    // ล้างความจำทุกอย่างกลับไปเป็นศูนย์เหมือนตอนเปิดเว็บใหม่
    firstValue = 0;
    operatorValue = '';
    waitFornext = false;
    calculatorDisplay.textContent = '0';
}

clearBtn.addEventListener('click', () => resetAll()); // สั่งให้ปุ่ม AC ล้างค่าเมื่อโดนคลิก
