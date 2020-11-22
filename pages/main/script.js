let inactiveLinks = document.querySelectorAll('.logo, .off');
for(let i = 0; i < inactiveLinks.length; i++) {
inactiveLinks[i].addEventListener("click", function (event) {
    event.preventDefault();
})};

let hamburgerbutton = document.querySelector('.hamburger');
let logo = document.querySelector('.logo');
let mobileMenu = document.querySelector('.mobile-menu');
let overlay = document.createElement('div');
overlay.classList.add('overlay');
let carouselArrowLeft = document.querySelector('.carousel__arrow-left');
let carouselArrowRight = document.querySelector('.carousel__arrow-right');
let carouselItem = document.querySelectorAll('.carousel_item');
let closeButton = document.querySelector('.close-button');

// Обработка нажатия на значок бургер-меню

hamburgerbutton.addEventListener('click', hamburgerSwitch);
hamburgerbutton.addEventListener('click', mobileMenuOpen);


function hamburgerSwitch(e) {
    console.log(e.target);
    if(e.target == e.target.closest('.hamburger') || e.target == e.target.closest('span')) {
    hamburgerbutton.classList.toggle("rotate");
    hamburgerbutton.classList.toggle("fixed");
    logo.classList.toggle("hidden");
    if(!document.body.contains(overlay)) {    
    document.body.prepend(overlay);
    }    
    else overlay.remove();
  }
}

function mobileMenuOpen() {
    mobileMenu.classList.toggle("slide-in");
}

//Нажатие вне пунктов бургер меню

document.body.addEventListener('click', close);

function close(e) {
    if(e.target !== e.target.closest('.list__link') && e.target !== hamburgerbutton && e.target !== e.target.closest('.hamburger span') && e.target !== e.target.closest('.logo') && !e.target.closest('.popup')) {
        mobileMenu.classList.remove("slide-in");
        hamburgerbutton.classList.remove("rotate");
        hamburgerbutton.classList.remove("fixed");
        logo.classList.remove("hidden");
        overlay.remove();
    };
}

// Слайдер
carouselArrowLeft.addEventListener('click', generateSlides);
carouselArrowRight.addEventListener('click', generateSlides);
let json;
async function load() {
let jsonObj = await fetch("./pets.json");
    if (jsonObj.ok) { 
        json = await jsonObj.json();
    } else {
            alert("Ошибка загрузки данных из json: " + jsonObj.status);
          }
        }
        load();
        let tempArr;
        let identArr;
async function generateSlides() {
    removeanimation();
    let jsonOb = await fetch("./pets.json");
    if (jsonOb.ok) { 
        pets = await jsonOb.json();
    } else {
            alert("Ошибка загрузки данных из json: " + jsonObj.status);
          }
        
    tempArr = pets;
    identArr = [];
    for(let value of carouselItem) {
        value.name = value.querySelector('.carousel-item__name');
        let index = tempArr.find(item => item.name == value.name.innerHTML);
        identArr.push(index);
    }

    for(let i = tempArr.length; i >= 0; i--) {
        if(tempArr[i] == identArr[0] || tempArr[i] == identArr[1] || tempArr[i] == identArr[2]) {
            tempArr.splice(i, 1)
        }
    }

    let exc = [];
        for(let value of carouselItem) {
            
            value.img = value.querySelector('img');
            value.name = value.querySelector('.carousel-item__name');

            let randomValue = randIntExcep(0, 4, exc);
            exc.push(randomValue);
            value.img.src = tempArr[randomValue].img;
            value.name.innerHTML = tempArr[randomValue].name;            
      }
       for(value of carouselItem) {
           value.style.animation = "box 1.5s ease-in-out";
       }
    

       function removeanimation() {
        for(value of carouselItem) {
            value.style.animation = "none";
        }
       }
    } 

// Генерация рандомного числа
function randIntExcep(min, max, exp) {
    var n,
        exp = Array.isArray(exp) ? exp : [(isNaN(exp) ? min-1 : exp)];
    while(true){
        n = Math.floor(Math.random() * (max - min + 1)) + min;
        if(exp.indexOf(n) < 0) return n;
    }
}

// Popup
// Навешиваем обработчик на каждый из элементов слайдера

let popup = document.querySelector('.popup-container')

/*Функция обработки событий слайдера 
Проверяем был ли клик на элементе или его содержимом*/
async function openPopup(event) {    
    for(let value of carouselItem) {
        if(event.target.closest('.carousel_item')) {
        //запоминаем на каком элементе был клик   
        let currentItem = event.target.closest('.carousel_item');
         //привязываем классы к переменным   
        let itemTitle = popup.querySelector('.description-title');
        let itemSubTitle = popup.querySelector('.description-subtitle');
        let itemText = popup.querySelector('.description-text');
        let itemImg = popup.querySelector('img');
        let itemAge = popup.querySelector('.age');
        let itemInocul = popup.querySelector('.inocul');
        let itemDiseases = popup.querySelector('.diseases');
        let itemParasites = popup.querySelector('.parasites');
        //задаем в качестве ключа поиска имя питомца
        let codeName = currentItem .querySelector('.carousel-item__name').innerHTML
            // загрузка данных из json
        let jsonObj = await fetch("./pets.json");
    if (jsonObj.ok) { 
        let json = await jsonObj.json();
        /*поиск по заголовку (имени животного) обьекта из которого нужно загрузить
       данные в массиве обьектов json*/
        let currentItemInfo = json.find(item => item.name == codeName);
        //присваиваем данные из найденного обьекта в innerHTML, присвоенныех переменных
        itemTitle.innerHTML = currentItemInfo.name;
        itemSubTitle.innerHTML = currentItemInfo.type + ' - ' + currentItemInfo.breed;
        itemText.innerHTML = currentItemInfo.description;
        itemAge.innerHTML = currentItemInfo.age;
        itemInocul.innerHTML = currentItemInfo.inoculations;
        itemDiseases.innerHTML = currentItemInfo.diseases;
        itemParasites.innerHTML = currentItemInfo.parasites;
        itemImg.src = currentItemInfo.img;
    } else {
        alert("Ошибка загрузки данных из json: " + jsonObj.status);
        return;
      }

        //Отображаем popup и вставляем затемнение
          popup.classList.add('popup-container-active');  
            document.body.prepend(overlay);
            return;
        }
    }
}

//Обработка закрытия окна popup
overlay.addEventListener('click', closePopup);
closeButton.addEventListener('click', closePopup);
document.querySelector('.popup-container').addEventListener('click', closePopup);

function closePopup(e) {
  console.log(e.target)
  if(!e.target.closest('.popup') && (e.target == overlay || e.target == closeButton || e.target == document.querySelector('.popup-container'))) {
    //Скрываем popup и удаляем затемнение
    overlay.remove();
    popup.classList.remove('popup-container-active');
  }
}
    
//Запрет прокрутки
window.addEventListener('wheel', function(e) {  
    if(document.querySelector(".overlay") !== null){
    e.preventDefault();
}
 }, { passive: false })

 window.addEventListener('keydown', function(e) {  
    if((e.which == 33 || e.which == 34 || e.which == 38 || e.which == 40) && document.querySelector(".overlay") !== null){
    e.preventDefault();
}
 }, { passive: false })

 window.addEventListener('touchmove', function(e) {  
    if(document.querySelector(".overlay") !== null){
    e.preventDefault();
}
 }, { passive: false })


 