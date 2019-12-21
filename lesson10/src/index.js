import Service from "./game/Service";
import App from "./game/App";

let app = null;
init();

// аргументом передаем экземпляр класса Service
function init() {
   app = new App(new Service());
   app.on("ready", function () {
      const taskData = app.task.getContent();
      if (taskData.data.question !== undefined && taskData.data.question.length > 0) {
         drawButtons(taskData.data.question);
         drawQuestionNumbers();
      }
   });

   app.on('task:changed', function () {
      clearAnswer();
      if (app.taskNumber > app.totalTasks) {
         showStats();
      } else {
         const taskData = this.task.getContent();
         if (taskData.data.question !== undefined && taskData.data.question.length > 0) {
            drawButtons(taskData.data.question);
            drawQuestionNumbers();
         }
      }
   });
}

function showStats() {
   const el = document.querySelector('#letters');
   el.innerHTML = '';

   const stats = app.getStats();
   if (stats.length > 0) {
      let fullTime = 0;
      let errors = 0;

      stats.forEach((item) => {
         const startTime = new Date(item.start).getTime();
         const endTime = new Date(item.end).getTime();
         fullTime += (endTime - startTime) / 1000;
         errors += item.errors;
      });

      const statEl = document.createElement('div');
      statEl.innerHTML = `Всего ошибок: ${errors} Секунд затрачено: ${fullTime}`;
      el.appendChild(statEl);
   }

   const btnEl = document.createElement('button');
   btnEl.classList.add('btn', 'btn-primary', 'repeat-button');
   btnEl.innerText = 'Начать заново';
   btnEl.addEventListener('click', init);
   el.appendChild(btnEl);
}

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
      addAnswer();
   } else {
      app.errors++;
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

function addAnswer() {
   if (app.task) {
      const answer = [...app.task.answer];
      document.querySelector('#answer').innerHTML = '';
      for (const letter of answer) {
         const btn = document.createElement('div');
         btn.classList.add('btn', 'btn-success', 'letter');
         btn.innerHTML = letter;
         document.querySelector('#answer').appendChild(btn);
      }
   }
}

function drawQuestionNumbers() {
   document.querySelector('#current_question').innerHTML = app.taskNumber;
   document.querySelector('#total_questions').innerHTML = app.totalTasks;
}

function clearAnswer() {
   document.querySelector('#answer').innerHTML = '';
}