export default class Task {
    constructor(data) {
        this._word = data.content;
        this._randomizedWord = this._shuffle(this._word);
        this._answer = "";
        this._current = 0;
    }

    get _currentLetter() {
        return this._word[this._current];
    }

    get answer() {
        return this._answer;
    }

    check(answer) {
        if (answer === this._currentLetter) {
            this._answer += this._currentLetter;
            this._current++;
            if (this._current >= this._word.length) {
                return "completed";
            }
            return "success";
        }
        return "fail";
    }

    getContent() {
        return {
            type: this.constructor.name.toLowerCase(),
            data: {
                question: this._randomizedWord,
                answer: this._answer
            },
        };
    }

    _shuffle(str) {
        let arr = [...str];
        for (const [key, val] of arr.entries()) {
            const rand = Math.floor(Math.random() * arr.length);
            arr[key] = arr[rand];
            arr[rand] = val;
        }
        return arr;
    }
}
