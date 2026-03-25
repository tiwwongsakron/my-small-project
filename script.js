// --- ส่วนการดึงข้อมูลจากหน้าจอ (DOM Elements) ---
const calculatorDisplay = document.querySelector('h1'); // พื้นที่แสดงตัวเลขผลลัพธ์
const inputBtn = document.querySelectorAll('button');     // ปุ่มกดทั้งหมด (เก็บเป็น Array)
const clearBtn = document.getElementById('clear-btn');   // ปุ่ม Reset (AC)

// --- ส่วนตรรกะการคำนวณ (Logic) ---
// ใช้ Object เก็บฟังก์ชันการคำนวณแยกตามเครื่องหมาย
const calculate = {
    "/": (firstNumber, seconNumber) => seconNumber != 0 ? firstNumber / seconNumber : "error", // เช็คห้ามหารด้วย 0
    "*": (firstNumber, seconNumber) => firstNumber * seconNumber,
    "+": (firstNumber, seconNumber) => firstNumber + seconNumber,
    "-": (firstNumber, seconNumber) => firstNumber - seconNumber,
    "=": (firstNumber, seconNumber) => seconNumber // ถ้ากดเท่ากับ ให้คืนค่าตัวล่าสุดกลับไป
}

// --- ส่วนการเก็บสถานะ (State) ---
let firstValue = 0;      // ตัวเลขตัวแรกที่กดเก็บไว้
let operatorValue = '';  // เครื่องหมายคำนวณที่เลือก (+, -, *, /)
let waitFornext = false; // ตัวแปรเช็คว่า: "กำลังรอตัวเลขถัดไปอยู่ใช่ไหม?" (ใช้ตอนกดเครื่องหมายแล้ว)

// --- ฟังก์ชันหลักในการจัดการเหตุการณ์ ---

// 1. ฟังก์ชันจัดการเมื่อกดเครื่องหมาย (+, -, *, /)
function callOperator(operator) {
    const currentValue = Number(calculatorDisplay.textContent); // ดึงตัวเลขปัจจุบันบนจอมาแปลงเป็น Number

    // กรณีเปลี่ยนเครื่องหมายกลางคัน (เช่น กด + แล้วเปลี่ยนใจกด - ทันที)
    if (operatorValue && waitFornext) {
        operatorValue = operator;
        return;
    }

    if (!firstValue) {
        // ถ้ายังไม่มีตัวเลขตัวแรกเก็บไว้ ให้จำค่าบนหน้าจอเป็นค่าแรก
        firstValue = currentValue;
    } else {
        // ถ้ามีค่าแรกอยู่แล้ว ให้เอาค่าแรกมาคำนวณกับค่าปัจจุบันบนหน้าจอ
        const result = calculate[operatorValue](firstValue, currentValue);
        calculatorDisplay.textContent = result; // แสดงผลลัพธ์ที่คำนวณได้บนจอ
        firstValue = result;                   // เก็บผลลัพธ์ไว้เป็นค่าตั้งต้นสำหรับการคำนวณรอบถัดไป
        
        if (firstValue === "error") resetAll(); // ถ้าหารด้วย 0 ให้ล้างค่าใหม่หมด
    }

    waitFornext = true;      // เปิดสถานะ "รอตัวเลขชุดถัดไป"
    operatorValue = operator; // จำไว้ว่าตอนนี้กำลังใช้เครื่องหมายอะไร
}

// 2. ฟังก์ชันจัดการเมื่อกดตัวเลข (0-9)
function setNumberValue(number) {
    if (waitFornext) {
        // ถ้าอยู่ในสถานะรอเลขใหม่ (หลังกดเครื่องหมาย) ให้ล้างเลขเก่าแล้วขึ้นเลขใหม่ทันที
        calculatorDisplay.textContent = number;
        waitFornext = false; // ปิดสถานะรอ เพราะเริ่มพิมพ์เลขใหม่แล้ว
    } else {
        // ถ้าเป็นโหมดพิมพ์ปกติ
        const displayValue = calculatorDisplay.textContent;
        // ถ้าจอเป็น 0 ให้เริ่มเลขใหม่เลย แต่ถ้าไม่ใช่ให้พิมพ์ต่อท้ายไปเรื่อยๆ
        calculatorDisplay.textContent = displayValue === '0' ? number : displayValue + number;
    }
}

// 3. ฟังก์ชันใส่จุดทศนิยม
function addDecimal() {
    if (waitFornext) return; // ถ้ากำลังรอเลขใหม่ ห้ามใส่จุดดื้อๆ
    
    // ถ้าบนหน้าจอยังไม่มีจุด ถึงจะใส่จุดเพิ่มเข้าไปได้ (ป้องกันจุดซ้ำ)
    if (!calculatorDisplay.textContent.includes(".")) {
        calculatorDisplay.textContent = `${calculatorDisplay.textContent}.`;
    }
}

// --- ส่วนการตั้งค่า Event Listeners (ใส่หูฟังให้ปุ่มต่างๆ) ---

inputBtn.forEach((input) => {
    if (input.classList.length === 0) {
        // ถ้าไม่มี Class (พวกปุ่มตัวเลข) ให้กดแล้วไปที่ setNumberValue
        input.addEventListener('click', () => setNumberValue(input.value));
    } else if (input.classList.contains('operator')) {
        // ถ้าเป็นปุ่มเครื่องหมาย ให้ไปที่ callOperator
        input.addEventListener('click', () => callOperator(input.value));
    } else if (input.classList.contains('decimal')) {
        // ถ้าเป็นปุ่มจุด
        input.addEventListener('click', () => addDecimal());
    }
});

// 4. ฟังก์ชัน Reset ล้างค่าทุกอย่างเป็นค่าเริ่มต้น
function resetAll() {
    firstValue = 0;
    operatorValue = '';
    waitFornext = false;
    calculatorDisplay.textContent = '0';
}

// เมื่อกดปุ่ม Clear ให้รันฟังก์ชัน resetAll
clearBtn.addEventListener('click', () => resetAll());