import slider from './slider.js';

export default function fullPageSlider(el) {
  createButtons(el);
  fullPage(el);
  slider(el);
}

// создает кнопки
function createButtons(el) {
  let items = el.querySelectorAll('.fullpage__item');
  let btns = document.createElement('div');
  btns.classList.add('fullpage__btns');

  items.forEach((item,i) => {
    let span = document.createElement('span');
    span.classList.add('fullpage__btn');
    span.dataset.index = i;
    btns.appendChild(span);
  });
 
  btns.firstChild.classList.add('fullpage__btn_active');
  el.appendChild(btns);
  correctBtnsTop(btns);
}

//корректирует положение кнопок в зависимости от кол-ва
function correctBtnsTop(el) {
  let elHeight = window.getComputedStyle(el).height;
  el.style.top = `calc(50% - ${elHeight}/2)`;
}

// слайдер fullPage
function fullPage(el) {
  let wrapper = el.querySelector('.fullpage__wrapper');
  let items = el.querySelectorAll('.fullpage__item');
  let buttons = el.querySelectorAll('.fullpage__btn');
  let wrapperHeight = parseFloat(getComputedStyle(wrapper).height);
  let itemHeight = parseFloat(getComputedStyle(items[0]).height);
  let current = 0;
  let transform = 0;
  let step = itemHeight / wrapperHeight * 100;

  document.addEventListener('touchstart', touchStartScroll);
  buttons.forEach(button => button.addEventListener('click', changeSlide));

  // меняет слайд
  function changeSlide() {
    const currentBtnIndex = Number(event.currentTarget.dataset.index);
    changeActiveBtn(currentBtnIndex);
    scrollTo(currentBtnIndex);
  }

  // делает кнопку активной
  function changeActiveBtn(index) {
    buttons.forEach(button => button.classList.remove('fullpage__btn_active'));
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].dataset.index === String(index)) {
        buttons[i].classList.add('fullpage__btn_active');
      }
    }
  }
  // изменят translateY у слайдера
  function wrapperTransform(number) {
    wrapper.style.transform = `translateY(${number}%)`;
  }

  // скролл к слайду по индексу
  function scrollTo(index) {
    if (index === current) {
      return;
    }
    if (index > current) {
      transform = -(step * index);
    } else {
      transform = -(step * (index+1)) + step;
    }
    current = index;
    wrapperTransform(transform);
  }

  // скролл по направлению
  function scrollDirection(direction) {
    if (direction === 'up') {
      if (current >= items.length - 1) {
        return;
      }
      current++;
      transform -= step;
    } else if (direction === 'down') {
      if (current <= 0) {
        return;
      }
      current--;
      transform += step;
    }
    changeActiveBtn(current);
    wrapperTransform(transform);
  }

  // начало прокрутки слайдера
  function touchStartScroll() {
    let start = event.changedTouches[0].pageY;

    const touchMove = throttle(() => {
      if (event.target.classList.contains('slider__path')) {return};
      let end = event.changedTouches[0].pageY;
      let direction = end - start > 0 ? 'down' : 'up';
      scrollDirection(direction);
        
    }, 4000);
    
    document.addEventListener('touchmove', touchMove);
  }
  // не позволять исполнятся чаще раз в 4000
  function throttle(callback, delay) {
    let isWaiting = false;
      return function () {
        if (!isWaiting) {
          callback.apply(this, arguments);
          isWaiting = true;
          setTimeout(() => {
          isWaiting = false;
        }, delay);
      }
    }
  }
}

