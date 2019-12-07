import Service from "./game/Service";
import App from "./game/App";

// аргументом передаем экземпляр класса Service
const app = new App(new Service());

app.on("ready", function () {
   const taskData = this.task.getContent();
   if (taskData.data.question !== undefined && taskData.data.question.length > 0) {
      drawButtons(taskData.data.question);
      drawQuestionNumbers();
   }
});

app.on('task:changed', function () {
   const taskData = this.task.getContent();
   if (taskData.data.question !== undefined && taskData.data.question.length > 0) {
      drawButtons(taskData.data.question);
      drawQuestionNumbers();
   }
   clearAnswer();
});

function drawButtons(buttons) {
   const el = document.querySelector('#letters');
   el.innerHTML = '';
   buttons.forEach((letter) => {
      const btnEl = document.createElement('button');
      btnEl.classList.add('btn', 'btn-primary', 'letter');
      btnEl.innerHTML = letter;
      btnEl.addEventListener('click', buttonClick);
      el.appendChild(btnEl);
   });
}

function buttonClick(event) {
   const letter = event.target.textContent;
   const result = app.checkAnswer(letter);
   if (result) {
      event.target.remove();
      addAnswer(letter);
   } else {
      errorClick(event.target);
   }
}

function errorClick(el) {
   el.classList.remove('btn-primary');
   el.classList.add('btn-danger');
   setTimeout(function() {
      el.classList.remove('btn-danger');
      el.classList.add('btn-primary');
   }, 300);
}

function addAnswer(letter) {
   const btn = document.createElement('div');
   btn.classList.add('btn', 'btn-success', 'letter');
   btn.innerHTML = letter;
   document.querySelector('#answer').appendChild(btn);
}

function drawQuestionNumbers() {
   document.querySelector('#current_question').innerHTML = app.taskNumber;
   document.querySelector('#total_questions').innerHTML = app.totalTasks;
}

function clearAnswer() {
   document.querySelector('#answer').innerHTML = '';
}