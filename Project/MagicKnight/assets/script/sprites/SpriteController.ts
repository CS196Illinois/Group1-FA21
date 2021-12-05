
import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = SpriteController
 * DateTime = Sun Dec 05 2021 16:01:41 GMT-0600 (Central Standard Time)
 * Author = cty012
 * FileBasename = SpriteController.ts
 * FileBasenameNoExtension = SpriteController
 * URL = db://assets/script/sprites/SpriteController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('SpriteController')
export class SpriteController extends cc.Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    public image: cc.ImageAsset

    // update (deltaTime: number) {
    //     // [4]
    // }
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
