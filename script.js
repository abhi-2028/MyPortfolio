const word = ["a Programmer", "a Web Developer","a Coder"];
const typedTextSpan = document.querySelector(".typed_text");
const cursorSpan = document.querySelector(".cursor");

let wordIdx = 0;
let charIdx = 0;
let typingDelay = 150;
let newWordDelay = 1500; 
let eraseDelay = 90;


function type(){
    if(charIdx < word[wordIdx].length){
        typedTextSpan.textContent += word[wordIdx].charAt(charIdx);
        charIdx++;
        setTimeout(type, typingDelay);
    }else{
        setTimeout(erase, newWordDelay);
    }
}

function erase(){
    if(charIdx > 0){
        typedTextSpan.textContent = word[wordIdx].substring(0,charIdx-1);
        charIdx--;
        setTimeout(erase, eraseDelay);
    }else {
        wordIdx = (wordIdx + 1) % word.length;
        setTimeout(type , typingDelay);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (word.length) setTimeout(type, 1000);
});
