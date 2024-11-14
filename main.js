const startBtnEl = document.getElementById('start');
const contentMain = document.querySelector('.wrapper');
let scoreEl = document.getElementById('score');
const wave = document.querySelector('.water')
const dropContent = document.querySelector('.wrapper__drop');





let isPlayGame = false;
let score = 0;
let worseAnswer = 0;
let idTimeout = null
let idRenderDropTimeout = null



function renderModal() {
  const modal = `<section class='modal-card'>
        <h1 class='title__modal-card'>${isPlayGame ? 'GAME OVER' : 'START GAME'}</h1>
        <p>${isPlayGame ? `Ваш счет: ${score}` : ''}</p>
        <a href='#' class='start' id='start'>${isPlayGame ? 'Начать заного' : 'Начать игру'}</a>
    </section>`;

  document.body.insertAdjacentHTML('afterbegin', modal);

  const startBtnEl = document.getElementById('start');
  startBtnEl.addEventListener('click', handlerStartBtn);

}


function handlerStartBtn(event) {
  event.preventDefault();
  const modal = document.querySelector('.modal-card');
  modal.remove()
  contentMain.style.display = 'block';
  isPlayGame = true;
  idTimeout = setInterval( checkIntersectionWithWave, 500)
  idRenderDropTimeout = setInterval( renderDrop, 1500)
}


startBtnEl.addEventListener('click', handlerStartBtn)



// function resetData() {
//   let isPlayGame = false;
//   let score = 0;
//   let worseAnswer = 0;
//   let idTimeout = null
//   let idRenderDropTimeout = null
// }

///// ДИНАМИЧЕСКИ ПОЛУЧАЕМ КАПЕЛЬКИ И ТО, ЧТО ВНУТРИ
function createDrop() {
  const drop = document.createElement('div');
  const firstNum = document.createElement('div');
  const operation = document.createElement('div');
  const secondNum = document.createElement('div');

  drop.classList.add('drop');


  const { firstNums, secondNums, operations } = randomExpression(1, 10);

  firstNum.innerText = firstNums;
  secondNum.innerText = secondNums;
  operation.innerText = operations;




  const result = mathematicalCalculations();

  function mathematicalCalculations() {

    switch (operations) {
      case '+':
        return firstNums + secondNums;
      case '-':
        return firstNums - secondNums;
      case '*':
        return firstNums * secondNums;
      case '/':
        return firstNums / secondNums;
    }
  }


  drop.dataset.result = result;

  drop.appendChild(firstNum);
  drop.appendChild(operation);
  drop.appendChild(secondNum);

  return drop;
}

//// ПОЛУЧАЕМ РАНДОМНЫЕ  ЧИСЛА
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}


////////////// ЗАДАЕМ ОБЛАСТЬ ВИДИМОСТИ КАПЛЯМ И ИНТЕРВАЛ ЧЕРЕЗ АНИМАЦИЮ 
setInterval(() => {
  const dropContent = document.querySelector('.wrapper__drop')
  const drop = createDrop()
  dropContent.prepend(drop)
  const dropWidth = drop.offsetWidth
  const areaWidth = dropContent.offsetWidth
  const maxLeftPos = parseInt(100 - dropWidth / areaWidth * 100)
  drop.style.left = getRandomIntInclusive(1 , maxLeftPos) + '%'
  drop.classList.add('animateFall')
}, 8000)







/////////////////////////// Получаем кнопки и дисплей калькулятора////////////////////!

const input = document.getElementById('input')
const enter = document.getElementById('enter')  
const clear = document.getElementById('clear')



////////// задаем кнопке Clear  функцию на клик, стерать число которое ввели в калькулятор!
function resetCalculate() {
  input.value = ''
}
clear.addEventListener('click', resetCalculate);



/////////////////////// Получаем все кнопки с классом btn  через массив и задаем  функцию, которая  отображает наши циферки введеные  в калькуляторе
let buttons = Array.from(document.querySelectorAll('.btn'));

buttons.map((button) => {
  button.addEventListener('click', (e) => {
    input.value += e.target.innerText
  })
})



///////////////////////      На КНОПКУ ENTER  ЗАДАЕМ ФУНКЦИЮ КОТОРАЯ СРАВНИВАЕТ НАШ ОТВЕТ С ОТВЕТАМ КАПЕЛЬ И ЕСЛИ ОТВЕТЫ СОВПАДАЮТ, ТО КАПЛИ УДАЛЯЮТСЯ И ДИСПЛЕЙ КАЛЬКУЛЯТОРА СТАНОВИТСЯ НА 0
enter.addEventListener('click', checkAnswer);

function checkAnswer () {
  const drops = document.querySelectorAll('.drop')
  const correctAnswerDrop = Array.from(drops).find(el => el.dataset.result === input.value);
  if (correctAnswerDrop) {
    acceptCorrectAnswer(correctAnswerDrop);
  } else {
    acceptWrongAnswer();
  }
}

function checkIntersectionWithWave() {
  const drops = document.querySelectorAll('.drop');
  drops.forEach((drop) => {
    if (drop.getBoundingClientRect().top >= wave.getBoundingClientRect().top + 50) {
      drop.remove()
      acceptWrongAnswer();
    }
  })
}

function acceptCorrectAnswer(correctAnswerDrop) {
  correctAnswerDrop.remove();
  input.value = '';
  score = score + 10;
  scoreEl.innerText = score;
}

function acceptWrongAnswer() {
  worseAnswer++;
  input.value = '';
  score = score - 10;
  scoreEl.innerText = score;
  if (worseAnswer === 3) {
    scoreEl.innerText = ''
    renderModal();
    clearTimeout(idTimeout)
    clearTimeout(idRenderDropTimeout)
    isPlayGame = false;
    dropContent.innerHTML =''
  }

}



 //// ПОЛУЧАЕМ РАНДОМНЫЕ ОПЕРАТОРЫ
 const operator = ['/', '+', '-', '*']
 let sings = ''

 function getRandomOperationIndex() {
   return Math.floor(Math.random() * ((operator.length - 1) - 0 + 1) + 0)
 }

 function getRandomOperation() {
   const randomIndex = getRandomOperationIndex()
   const randomOperation = operator[randomIndex]

   if (randomOperation === sings) {
     getRandomOperation()
   } else {
     sings = randomOperation
   }
   return randomOperation
 }




/////////////  ЗАДАЕМ ОПЕРАТОРОМ УСЛОВИЯ 
function randomExpression(min, max) {
  let firstNums = getRandomIntInclusive(min, max)
  let secondNums = getRandomIntInclusive(min, max)
  const operations = getRandomOperation()
  if (firstNums < secondNums && (operations === '-' || operations === '/')) {
    [firstNums, secondNums] = [secondNums, firstNums]
  }

  if (operations === '/' && firstNums % secondNums != 0) {
    firstNums -= firstNums % secondNums
  }

  return {firstNums, secondNums, operations}
}

function openGame() {
  renderModal();
}

