
import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = EventManager
 * DateTime = Mon Oct 25 2021 17:14:51 GMT-0500 (Central Daylight Time)
 * Author = cty012
 * FileBasename = EventManager.ts
 * FileBasenameNoExtension = EventManager
 * URL = db://assets/Scripts/Events/EventManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

export class EventManager {
    private static _instance = new EventManager();  // singleton
    public static get instance() { return EventManager._instance; }

    private listeners: { [key: string]: Array<(event: BaseEvent) => void> } = {};

    private constructor() {}

    public on(tag: string, listener: (event: BaseEvent) => void) {
        if (this.listeners[tag] == null) {
            this.listeners[tag] = [];
        }
        this.listeners[tag].push(listener);
    }

    public off(tag: string, listener: (event: BaseEvent) => void) {
        if (this.listeners[tag] == null) return;
        this.listeners[tag].forEach((element, index) => {
            if (element == listener) this.listeners[tag].splice(index, 1);
        });
    }

    public emit(tag: string, event: BaseEvent) {
        if (this.listeners[tag] == null) return;
        this.listeners[tag].forEach(listener => {
            listener(event);
        });
    }
}

export class BaseEvent {
    private _name: string;
    public get name(): string { return this._name; }

    constructor(name: string) {
        this._name = name;
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
