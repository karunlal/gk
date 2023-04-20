const url = 'https://script.google.com/macros/s/AKfycbwZLhD4cpgiNo3S0Zyek-GhJ2EOvo0CWVtAra8evgnCh9bShJLX9vUbD4eYXT9XPmZl/exec';
const output = document.querySelector('.output');
const game = { question: 0, total: 0, data: [], score: 0 };

document.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('ready');
  output.innerHTML = '';
  const btn = document.createElement('button');
  btn.disabled = true;
  start(btn);
  game.question = 0;
  game.total = 0;
  game.score = 0;
  game.data = [];

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      game.total = data.data.length;
      game.data = data.data;
      btn.disabled = false;
    });
}

function start(btn) {
  const html = 'Welcome to the quiz. Press the button below to start the QUIZ.';
  const div = maker('div', html, 'message', output);
  btn.textContent = 'Start Game';
  btn.classList.add('btn');
  div.append(btn);
  btn.addEventListener('click', loaderQuestion);
}

function loaderQuestion() {
  output.innerHTML = '';
  if (game.question >= game.total) {
    const html = `<h1>Game Over</h1><div>You got ${game.score} out of ${game.total} correct.</div>`;
    const div = maker('div', html, 'message', output);
    const btn3 = maker('button', 'Play Again', 'btn', div);
    btn3.addEventListener('click', init);
  } else {
    const div = maker('div', '', 'message', output);
    const val = game.data[game.question];
    const question = maker('div', `<strong>Question ${game.question+1}:</strong> ${val.question}?`, 'question', div);
    const optList = maker('div', '', 'opts', div);

    val.arr.forEach(opt => {
      const temp = maker('div', opt, 'box', optList);
      temp.classList.add('box1');
      temp.myObj = {
        opt: opt,
        answer: val.answer
      };
      temp.addEventListener('click', checker);
    });
  }
}



function checker(e) {
  const val = e.target.myObj;
  removerClicks();
  e.target.style.color = 'white';
  let html = '';
  if (val.opt === val.answer) {
    game.score++;
    e.target.style.backgroundColor = 'green';
    html = 'Correct!';
  } else {
    e.target.style.backgroundColor = 'red';
    // Find the element with the correct answer and mark it green
    const correctOption = Array.from(e.target.parentElement.children).find(child => child.myObj.opt === val.answer);
    correctOption.style.backgroundColor = 'green';
    html = 'Wrong!';
  }
  const parent = e.target.parentElement;
  game.question++;
  const rep = game.question == game.total ? 'End Game' : 'Next Question';
  const feedback = maker('div', html, 'message', parent);
  const btn2 = maker('button', rep, 'btn', parent);
  btn2.addEventListener('click', loaderQuestion);
}


function removerClicks() {
  const boxes = document.querySelectorAll('.box');
  boxes.forEach(ele => {
    ele.removeEventListener('click', checker);
    ele.style.color = '#add';
    ele.classList.remove('box1');
  });
}

function maker(eleType, html, cla, parent) {
  const ele = document.createElement(eleType);
  ele.innerHTML = html;
  ele.classList.add(cla);
  return parent.appendChild(ele);
}
