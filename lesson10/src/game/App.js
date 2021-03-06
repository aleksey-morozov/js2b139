import Task from "./Task";
const eventTypes = ["ready", "task:changed", "completed", "await-restore"];

export default class App {
    constructor(service) {
        this._service = service;
        this._tasks = [];
        this._currentTaskNumber = 0;
        this._listeners = new Map();
        this._stats = [];
        this._timerStart = '';
        this.errors = 0;

        if (this._service.hasRestoreData()) {
            // сообщить о возможности восстановления
            // ничего не делать, пока не сообщат ответ
            this._notify("await-restore");
        } else {
            // получить данные для начала игры
            this._service.getTasksData({}, (data) => {
                this._tasks = data.map(item => new Task({ content: item }));
                this._notify("ready");
            });
        }
    }

    get task() {
        return this._tasks[this._currentTaskNumber];
    }

    get taskNumber() {
        return this._currentTaskNumber + 1;
    }

    get totalTasks() {
        return this._tasks.length;
    }

    on(event, handler) {
        if (eventTypes.includes(event)) {
            if (typeof handler === "function") {
                this._listeners.set(event, handler);
            } else {
                throw new TypeError("Обработчик события должен быть функцией");
            }
        } else {
            throw new Error(`Тип событий ${event} не допустим`);
        }
    }

    _startStat() {
        this._timerStart = new Date();
    }

    _saveStats() {
        this._stats.push({
            errors: this.errors,
            start: this._timerStart,
            end: new Date(),
        });
        this._timerStart = '';
        this.errors = 0;
    }

    checkAnswer(answer) {
        if (!this._timerStart) {
            this._startStat();
        }
        const result = this.task.check(answer);
        if (result === "success") {
            this._notify("task:success");
            return true;
        }
        if (result === "completed") {
            this._currentTaskNumber++;
            this._saveStats();
            this._notify("task:changed");
            return true;
        }
        return false;
    }

    getStats() {
        return this._stats;
    }

    save() {
        let state = "...."; // как-то формируем данные для сохранения
        this._service.saveRestoreData(state);
    }

    restore() {
        let data = this._service.getRestoreData();
        if (data) {
            // ....  восстанавливаем состояние приложения
        } else {
            throw new Error("Невозможно продолжить процесс");
        }
    }

    restart() {

    }

    _notify(event) {
        if (this._listeners.has(event)) {
            const handler = this._listeners.get(event);
            // вызов обработчика событий в контексте этого объекта
            handler.call(this);
        }
    }
}
