
import { _decorator, Component, Node, PhysicsSystem2D, EPhysics2DDrawFlags, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameManager
 * DateTime = Sat Sep 25 2021 23:09:53 GMT-0500 (北美中部夏令时间)
 * Author = Kaicheng
 * FileBasename = gameManager.ts
 * FileBasenameNoExtension = gameManager
 * URL = db://assets/script/gameManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('GameManager')
export class GameManager extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    onLoad() {

        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None;
    }
    start () {
        // [3]
    }

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
