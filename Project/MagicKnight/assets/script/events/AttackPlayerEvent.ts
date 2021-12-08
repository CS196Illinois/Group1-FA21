import * as cc from 'cc';
import { BaseEvent } from 'db://assets/script/events/EventManager';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = AttackPlayerEvent
 * DateTime = Sat Dec 04 2021 19:18:00 GMT-0600 (北美中部标准时间)
 * Author = Kaicheng
 * FileBasename = AttackPlayerEvent.ts
 * FileBasenameNoExtension = AttackPlayerEvent
 * URL = db://assets/script/events/AttackPlayerEvent.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('AttackPlayerEvent')
export class AttackPlayerEvent extends BaseEvent {
    // self defined properties
    public attack: number;

    constructor(type: AttackPlayerEventType, attack: number) {
        // name is a property of BaseEvent
        super(type);
        this.attack = attack;
    }
}

export enum AttackPlayerEventType {
    PHYSICAL_ATTACK = "physical-attack",
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
