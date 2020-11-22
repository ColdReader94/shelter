let inactiveLinks = document.querySelectorAll('.off');
for(let i = 0; i < inactiveLinks.length; i++) {
inactiveLinks[i].addEventListener("click", function (event) {
    event.preventDefault();
})};


let hamburgerbutton = document.querySelector('.hamburger');
let logo = document.querySelector('.logo');
let mobileMenu = document.querySelector('.mobile-menu');
let overlay = document.createElement('div');
overlay.classList.add('overlay');
let header = document.querySelector('.header');
let carouselItem;
let closeButton = document.querySelector('.close-button');
  //Пагинация
  let paginationNext = document.querySelector('.next');
  let paginationPrev = document.querySelector('.previous');
  let page = document.querySelector('.number');
  let paginationEnd = document.querySelector('.toend');
  let paginationStart = document.querySelector('.tostart');
  
  

hamburgerbutton.addEventListener('click', hamburgerSwitch);
hamburgerbutton.addEventListener('click', mobileMenuOpen);


function hamburgerSwitch(e) {
    if(e.target == e.target.closest('.hamburger') || e.target == e.target.closest('span')) {
    hamburgerbutton.classList.toggle("rotate");
    hamburgerbutton.classList.toggle("fixed");
    header.classList.toggle("unstick");
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

document.body.addEventListener('click', close);

function close(e) {
    if(e.target !== e.target.closest('.list__link') && e.target !== hamburgerbutton && e.target !== e.target.closest('.hamburger span') && e.target !== e.target.closest('.logo') && !e.target.closest('.popup')) {
        mobileMenu.classList.remove("slide-in");
        hamburgerbutton.classList.remove("rotate");
        hamburgerbutton.classList.remove("fixed");
        header.classList.remove("unstick");
        logo.classList.remove("hidden");
        overlay.remove();
    };
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


// Загрузка элементов из json и формирование псевдослучайного массива
let petsList = [];
let fullPetsList = [];

async function generateSlides(e) { 
    let jsonObj = await fetch("./pets.json");
    if (jsonObj.ok) { 
        let petsList = await jsonObj.json();
        fullPetsList = (() => {
            let tempArr = [];
        
            for (let i = 0; i < 6; i++) {
              const newPets =  petsList;
        
              for (let j =  petsList.length; j > 0; j--) {
                let randInd = Math.floor(Math.random() * j);
                const randElem = newPets.splice(randInd, 1)[0];
                newPets.push(randElem);
              }
        
              tempArr = [...tempArr, ...newPets];
            }
            return tempArr;
          })();
        
          fullPetsList = sort863(fullPetsList);

         

          for (let i = 0; i < (fullPetsList.length / 6); i++) {
            const stepList = fullPetsList.slice(i * 6, (i * 6) + 6);
        
          }

          createElements = (petsList) => {
            let str = '';
            for (let i = 0; i < petsList.length; i++) {
              str += `<div class="carousel_item">
              <img src="${ petsList[i].img }" alt="" />
              <div class="carousel-item__name">${ petsList[i].name }</div>
          <button type="button" class="carousel-item__button">Learn more</button>
      </div>`;
            }
            return str;
          }

          const createPets = (petsList) => {
            const elem = document.querySelector(".container");
            elem.innerHTML += createElements(petsList);
          }

          createPets(fullPetsList);
          carouselItem = document.querySelectorAll('.carousel_item');
          document.querySelector(".number").innerText = (currentPage + 1).toString();
          for(let value of carouselItem) {
            value.addEventListener('click', openPopup);
        }
        
    } else {
        alert("Ошибка загрузки данных из json: " + jsonObj.status);
      }
}


const sort863 = (list) => {
    let unique8List = [];
    let length = list.length;
    for (let i = 0; i < length / 8; i++) {
      const uniqueStepList = [];
      for (j = 0; j < list.length; j++) {
        if (uniqueStepList.length >= 8) {
          break;
        }
        const isUnique = !uniqueStepList.some((item) => {
          return item.name === list[j].name;
        });
        if (isUnique) {
          uniqueStepList.push(list[j]);
          list.splice(j, 1);
          j--;
        }
      }
      unique8List = [...unique8List, ...uniqueStepList];
    }
    list = unique8List;
  
  
    list = sort6recursively(list);
  
    return list;
  }
  
  const sort6recursively = (list) => {
    const length = list.length;
  
    for (let i = 0; i < (length / 6); i++) {
      const stepList = list.slice(i * 6, (i * 6) + 6);
  
      for (let j = 0; j < 6; j++) {
        const duplicatedItem = stepList.find((item, ind) => {
          return item.name === stepList[j].name && (ind !== j);
        });
  
        if (duplicatedItem !== undefined) {
          const ind = (i * 6) + j;
          const which8OfList = Math.trunc(ind / 8);
  
          list.splice(which8OfList * 8, 0, list.splice(ind, 1)[0]);
  
          sort6recursively(list);
        }
      }
    }
    
    return list;
  }

  generateSlides();


  let currentPage = 0;
  paginationPrev.addEventListener('click', (e) => {
    if (currentPage > 0) {
      currentPage--;
    }
    document.querySelector(".container").style.top = `calc(-${document.querySelector(".outer-block").offsetHeight * currentPage}px)`;
    document.querySelector(".number").innerText = (currentPage+1).toString();
    checkIsActive();
  });
  
 paginationNext.addEventListener('click', (e) => {
    if (currentPage < (document.querySelector(".container").offsetHeight / document.querySelector(".outer-block").offsetHeight) - 1) {
      currentPage++;
    }
    
    document.querySelector(".container").style.top = `calc(-${document.querySelector(".outer-block").offsetHeight * currentPage}px)`;
    document.querySelector(".number").innerText = (currentPage+1).toString();
    checkIsActive();
  });
  
  paginationStart.addEventListener('click', (e) => {
    if (currentPage > 0) {
      currentPage = 0;
      document.querySelector(".container").style.top = "0px";
    document.querySelector(".number").innerText = (currentPage+1).toString();
    checkIsActive();
    }
  })

  paginationEnd.addEventListener('click', (e) => {
    if (currentPage < fullPetsList.length / itemsPerPage - 1) {
      currentPage = fullPetsList.length / itemsPerPage - 1;
      document.querySelector(".container").style.top = `calc(-${document.querySelector(".outer-block").offsetHeight * currentPage}px)`;
    document.querySelector(".number").innerText = (currentPage+1).toString();
    checkIsActive();
    }
  })
  
function checkIsActive() {
  if (currentPage == 0) {
    paginationStart.classList.add('disabled');
    paginationPrev.classList.add('disabled');
    paginationEnd.classList.remove('disabled');
    paginationNext.classList.remove('disabled');
  } 
  if (currentPage == fullPetsList.length / itemsPerPage - 1) {  
    paginationEnd.classList.add('disabled');
    paginationNext.classList.add('disabled');
    paginationStart.classList.remove('disabled');
    paginationPrev.classList.remove('disabled');
  } 
  else if (currentPage !== 0 && currentPage !== fullPetsList.length / itemsPerPage - 1) {
    paginationStart.classList.remove('disabled');
    paginationPrev.classList.remove('disabled');
    paginationEnd.classList.remove('disabled');
    paginationNext.classList.remove('disabled');
  }
}

 let itemsPerPage = 8;
 let maxPages = fullPetsList / itemsPerPage;
const checkItemsPerPage = () => {
if (document.querySelector("body").offsetWidth >= 768 && document.querySelector("body").offsetWidth < 1280) {
itemsPerPage = 6;  
}
if (document.querySelector("body").offsetWidth >= 320 && document.querySelector("body").offsetWidth < 768) {
  itemsPerPage = 3;  
  }
}
checkItemsPerPage();

window.addEventListener('resize', checkItemsPerPage);




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