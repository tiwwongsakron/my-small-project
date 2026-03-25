const contents = document.querySelectorAll('.content'); 

document.addEventListener('scroll',showText);

function showText(){
    
    contents.forEach((section)=>{
        const imgEl = section.querySelector('img');
        const textEl = section.querySelector('.text');

        const scrollPos = window.pageYOffset;
        const textPos = imgEl.offsetTop + imgEl.offsetHeight / 50
        if(scrollPos > textPos){
            textEl.classList.add('show-reveal');
        }else{
            textEl.classList.remove('show-reveal')
        }
    });
}

