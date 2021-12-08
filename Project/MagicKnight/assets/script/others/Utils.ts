import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = Utils
 * DateTime = Tue Dec 07 2021 18:07:29 GMT-0600 (Central Standard Time)
 * Author = cty012
 * FileBasename = Utils.ts
 * FileBasenameNoExtension = Utils
 * URL = db://assets/script/others/Utils.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

export class IdGenerator {
    private static nextId: number = 0;
    static generate(): number {
        return IdGenerator.nextId++;
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
