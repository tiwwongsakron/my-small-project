const currency_one = document.getElementById('currency-one'); //การเข้าถึงElement ที่มีidเป็น...
const currency_two = document.getElementById('currency-two');

const amount_one = document.getElementById('amount-one'); //const การป้องกันการเปลี่ยนค่าโดยไม่ได้ตั้งใจ ป้องกันการเกิดบั๊กได้ในระดับหนึ่ง
const amount_two = document.getElementById('amount-two');

const rateText = document.getElementById('rate');
const swap = document.getElementById('btn');

currency_one.addEventListener('change',calculateMoney); //addEventListener การรอรับคำสั่ง เมื่อเราทำอะไร
currency_two.addEventListener('change',calculateMoney);
amount_one.addEventListener('input',calculateMoney);
amount_two.addEventListener('input',calculateMoney);


function calculateMoney(){
    const one = currency_one.value; //currency_one จะเปลี่ยนไปตาม ตัวแปร one ในฟังก์ชั่นเมื่อมีการเปลี่ยนค่า
    const two = currency_two.value; 
    fetch(`https://open.er-api.com/v6/latest/${one}`) //fetch คือการออกไปเอาข้อมูลอื่นตามDataอ้างอิง
    .then(res=>res.json()).then(data=>{
        const rate = data.rates[two];
        rateText.innerText=`1 ${one} = ${rate}${two}`
        amount_two.value=(amount_one.value*rate).toFixed(2);  //ค่าปลายทางมีค่าเท่ากับ ค่าต้นทางคูณกับrates //toFixed ปรับทค่าทศนิยมได้
    })

}
swap.addEventListener('click',()=>{
    //USD => THB || THB=> USD
    //TEMP => USD || THB = TEMP (USB)
    const temp = currency_one.value; //ต้นทาง
    currency_one.value = currency_two.value;
    currency_two.value = temp;
    calculateMoney();
});

calculateMoney();
