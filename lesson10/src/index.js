import Service from "./game/Service";
import App from "./game/App";

// аргументом передаем экземпляр класса Service
const app = new App(new Service());

app.on("ready", function() {
   const taskData = this.task.getContent();
   if (taskData.question !== undefined && taskData.question.length > 0) {
      drawButtons(taskData.question);
   }
});

function drawButtons(buttons) {
   const el = document.querySelector('#letters');
   el.innerHTML = '';
   buttons.forEach((letter) => {
      const btnEl = document.createElement('button').classList.add('btn btn-primary');
      btnEl.innerHTML = letter;
      el.appendChild(btnEl);
   });
}
