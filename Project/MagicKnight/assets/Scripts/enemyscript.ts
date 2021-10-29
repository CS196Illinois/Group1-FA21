
import { _decorator, Component, Node, RigidBody2D, Collider2D, UITransform, PhysicsSystem2D, Contact2DType, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Enemyscript
 * DateTime = Sat Oct 16 2021 18:26:35 GMT-0500 (北美中部夏令时间)
 * Author = Kaicheng
 * FileBasename = enemyscript.ts
 * FileBasenameNoExtension = enemyscript
 * URL = db://assets/script/enemyscript.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('Enemyscript')
export class Enemyscript extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({ type: Node })
    player = null;

    horizontalStep: number;
    maxDistance: number;


    rigidBody: RigidBody2D;
    collider: Collider2D;
    uiTransform: UITransform;

    onLoad() {
        this.horizontalStep = 4;
        this.maxDistance = 60;

        this.rigidBody = this.getComponent(RigidBody2D);
        this.collider = this.getComponent(Collider2D);
        this.uiTransform = this.getComponent(UITransform);


    }



    start () {
        // [3]

    }



    update (deltaTime: number) {
    //     // [4]
        let velocity: Vec2 = this.rigidBody.linearVelocity;
        let playerwidth: number = this.player.getComponent(UITransform).contentSize.width;
        let enemywidth: number = this.uiTransform.contentSize.width;
        let distancebetween: number = (this.player.position.x + playerwidth / 2) - (this.node.position.x + enemywidth / 2);
        if (distancebetween > this.maxDistance) {
            velocity.x = this.horizontalStep;
        } else if (distancebetween < -this.maxDistance) {
            velocity.x = - this.horizontalStep;
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
