import slider from './slider.js';
import fullpage from 'fullpage.js/dist/fullpage.extensions.min.js';
import './css/fonts.css';
import './css/style.css';

new fullpage('#fullpage', {
  navigation: true,
	autoScrolling:true,
	scrollHorizontally: true
});

slider(document.querySelector('.slider'));








