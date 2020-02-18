import './css/index.less';
import MindMap from 'image/mindmap.png';
// import { cloneDeep } from 'lodash';
import { minues } from './math';

const img = document.createElement('img');
img.src = MindMap;
img.onload = function onload() {
  document.body.append(img);
};

const element = document.createElement('div');
element.innerHTML = 'img icon';
element.classList.add('hello');
document.body.append(element);

const image = new Image();
image.src = MindMap;
document.body.append(image);

console.log(minues());
console.log('env', window.env);
const obj = {
  a: { b: 1 },
};
// eslint-disable-next-line no-undef
console.log(_.cloneDeep(obj));
