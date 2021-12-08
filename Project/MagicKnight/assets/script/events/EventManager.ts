import * as cc from 'cc';
import { IdGenerator } from 'db://assets/script/others/Utils';
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
    // singleton instance
    private static _instance = new EventManager();
    public static get instance(): EventManager { return EventManager._instance; }

    // event listeners are saved here
    private listeners: Map<string, Map<number, (event: BaseEvent) => void>> = new Map();

    private constructor() {}

    // add an event listener and return assigned id
    public on(tag: string, listener: (event: BaseEvent) => void): number {
        if (this.listeners[tag] == null) {
            this.listeners[tag] = new Map();
        }
        const id = IdGenerator.generate();
        this.listeners[tag].set(id, listener);
        return id
    }

    // use id to remove an event listener
    public off(tag: string, id: number) {
        if (this.listeners[tag] == null) return;
        this.listeners[tag].delete(id);
    }

    // notify all listeners under the tag and pass the event as the argument
    public emit(tag: string, event: BaseEvent) {
        if (this.listeners[tag] == null) return;
        for (let listener of this.listeners[tag].values()) {
            listener(event);
        }
    }
}

// All custom events should extend the BaseEvent class
export class BaseEvent {
    private _type: string;
    public get type(): string { return this._type; }

    constructor(type: string) {
        this._type = type;
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
