export default class Service {
    constructor(options = {}) {
        this._RESTORE_KEY = options.storageKey || "GAME_APP_STATE";
        this._cache = new Map();
    }

    hasRestoreData() {
        return this._getItemFromStorage(this._RESTORE_KEY) !== null;
    }

    saveRestoreData(data) {
        return this._saveItemToStorage(this._RESTORE_KEY, data);
    }

    getRestoreData() {
        return this._getItemFromStorage(this._RESTORE_KEY);
    }

    getTasksData(options, cb) {
        setTimeout(() => {
            cb(["apple", "function", "timeout", "task", "application", "data"]);
        }, 0);
    }

    _getItemFromStorage(key) {
        if (this._cache.has(key)) {
            return this._cache.get(key);
        }

        let item = localStorage.getItem(key);
        if (item !== null) {
            let data = JSON.parse(item);
            this._cache.set(key, data);
            return data;
        }
        return null;
    }

    _saveItemToStorage(key, value) {
        return localStorage.setItem(key, JSON.stringify(value));
    }
}
