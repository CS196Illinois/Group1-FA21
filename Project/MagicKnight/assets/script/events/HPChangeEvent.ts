
import { _decorator, Component, Node } from 'cc';
import { BaseEvent } from './EventManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = HPChangeEvent
 * DateTime = Sat Dec 04 2021 19:32:33 GMT-0600 (北美中部标准时间)
 * Author = Kaicheng
 * FileBasename = HPChangeEvent.ts
 * FileBasenameNoExtension = HPChangeEvent
 * URL = db://assets/script/events/HPChangeEvent.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('HPChangeEvent')
export class HPChangeEvent extends BaseEvent {
    // self defined properties
    public hp: number;

    constructor(type: HPChangeEventType, hp: number) {
        // name is a property of BaseEvent
        super(type);
        this.hp = hp;
    }
}

export enum HPChangeEventType {
    HP_CHANGE= "hp-change",
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
