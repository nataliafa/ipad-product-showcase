
// Слайдер
export default function slider(element) {
  let sliderWrapper = element.querySelector('.slider__wrapper'); 
  let sliderItems = element.querySelectorAll('.slider__item'); 
  let sliderToolsWrap = element.querySelector('.slider__tools-wrap');
  let sliderLine = element.querySelector('.slider__line');
  let sliderSwitch = element.querySelector('.slider__switch');
  let sliderToolsLength = parseFloat(getComputedStyle(element.querySelector('.slider__tools')).width);
  let wrapperWidth = parseFloat(getComputedStyle(sliderWrapper).width); 
  let itemWidth = parseFloat(getComputedStyle(sliderItems[0]).width);   
  let positionLeftItem = 0; 
  let transform = 0; 
  let step = itemWidth / wrapperWidth * 100; 
  let position = {
    getMin: 0,
    getMax: sliderItems.length - 1,
  }
  let posXFirst = 0;

  dragElement(sliderSwitch);

  // перемещение бегунка
  function dragElement(elmnt) {
    const wrap = document.querySelector('.slider__tools');
    let minX, maxX;
    let shiftX = 0;
  
    elmnt.addEventListener('mousedown', startDrag);
    elmnt.addEventListener('touchstart', startDrag);

    // начальные позиции
    function startDrag(event) {
      // if (!event.target.classList.contains('slider__path')) {return};
      let e;
      minX = wrap.offsetLeft;
      maxX = wrap.offsetLeft + wrap.offsetWidth - elmnt.offsetWidth;
      if (event.type === 'touchstart') {
        e = { type: event.changedTouches[0], drag: 'touchmove', drop: 'touchend'};
      } else if (event.type === 'mousedown') {
        e = { type: event, drag: 'mousemove', drop: 'mouseup'};
      }
      let left = Number(getComputedStyle(sliderToolsWrap).left.split('px')[0]);
      shiftX = e.type.pageX - elmnt.getBoundingClientRect().left  - window.pageXOffset + left;
      document.addEventListener(e.drag, drag);
      document.addEventListener(e.drop, drop);
    }
    
    // новые позиции
    function drag(event) {
      if (!event.target.classList.contains('slider__path')) {return};
      let e, x;
      if (event.type === 'touchmove') {
        e = { type: event.changedTouches[0]};
      } else if (event.type === 'mousemove') {
        e = { type: event};
      }
      x = e.type.pageX - shiftX;
      x = Math.min(x, maxX);
      x = Math.max(x, minX);
      elmnt.style.left = x + 'px';
      elmnt.style.top = 0 + 'px';
      let pos = Number(elmnt.style.left.split('px')[0]);
      checkPosx(pos);
      changeLine(pos);
    }
  
    function drop() {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', drop);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', drop);
    }
  }

  // расположение бегунка
  function checkPosx(x) { 
    let points = {
      toolsLength: sliderToolsLength,
      onelength: sliderToolsLength / (sliderItems.length + 1)
    }

    let first = 0,
      second = points.onelength, 
      third = points.onelength * 3,
      last = points.toolsLength;

    if (first <= posXFirst && posXFirst <= second && second < x && x < third)  {
      transformItem('right');
    } else if (second <= posXFirst && posXFirst <= third && first <= x && x <= second) {
      transformItem('left');
    } else if (second <= posXFirst && posXFirst <= third && third <= x && x <= last) {
      transformItem('right');
    } else if (third <= posXFirst && posXFirst <= last && second <= x && x <= third) {
      transformItem('left');
    } else if (first <= posXFirst && posXFirst <= second && third <= x && x <= last) {
      transformItem('right');
      transformItem('right');
    } else if (third <= posXFirst && posXFirst <= last && first <= x && x <= second) {
      transformItem('left');
      transformItem('left');
    }
    posXFirst = x;
  }

  // меняет слайд
  function transformItem(direction) {
    if (direction === 'right') {
      if ((positionLeftItem + wrapperWidth / itemWidth - 1) >= position.getMax) {
        return;
      }
      positionLeftItem++;
      transform -= step;
    }
  
    if (direction === 'left') {
      if (positionLeftItem <= position.getMin) {
        return;
      }
      positionLeftItem--;
      transform += step;
    }
    sliderWrapper.style.transform = 'translateX(' + transform + '%)';
  }

  // меняет градиент линии в зависимости от положения бегунка
  function changeLine(position) {
    let sliderSwitchWidth = Number(getComputedStyle(sliderSwitch.querySelector('svg')).width.split('px')[0]);
    let posPercent = Math.ceil(100 * (position + sliderSwitchWidth / 2)/ sliderToolsLength) ;
    sliderLine.style.backgroundImage =`linear-gradient(to right, #d1eaff ${0}%, #d1eaff ${posPercent}%, #435063 ${posPercent}%, #435063 ${100}%)`;
  }
}






