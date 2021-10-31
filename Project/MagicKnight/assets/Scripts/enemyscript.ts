
import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = EnemyScript
 * DateTime = Sat Oct 16 2021 18:26:35 GMT-0500 (北美中部夏令时间)
 * Author = Kaicheng
 * FileBasename = EnemyScript.ts
 * FileBasenameNoExtension = EnemyScript
 * URL = db://assets/script/EnemyScript.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('EnemyScript')
export class EnemyScript extends cc.Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    player = null;

    horizontalStep: number;
    maxDistance: number;

    rigidBody: cc.RigidBody2D;
    collider: cc.Collider2D;
    uiTransform: cc.UITransform;

    onLoad() {
        this.player = cc.find("Canvas/Map/Player");

        this.horizontalStep = 4;
        this.maxDistance = 60;

        this.rigidBody = this.getComponent(cc.RigidBody2D);
        this.collider = this.getComponent(cc.Collider2D);
        this.uiTransform = this.getComponent(cc.UITransform);
    }

    start () {
        // [3]
    }

    update (deltaTime: number) {
        let velocity: cc.Vec2 = this.rigidBody.linearVelocity;
        let playerwidth: number = this.player.getComponent(cc.UITransform).contentSize.width;
        let enemywidth: number = this.uiTransform.contentSize.width;
        let distancebetween: number = (this.player.position.x + playerwidth / 2) - (this.node.position.x + enemywidth / 2);
        if (distancebetween > this.maxDistance) {
            velocity.x = this.horizontalStep;
        } else if (distancebetween < -this.maxDistance) {
            velocity.x = -this.horizontalStep;
        } else {
            velocity.x = 0;
        }
        this.rigidBody.linearVelocity = velocity;
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
