
import { _decorator, Component, Node, PhysicsSystem2D, Contact2DType, Collider2D, IPhysics2DContact, UITransform, RigidBody2D, Vec2 } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = WeaponScript
 * DateTime = Fri Oct 29 2021 12:35:10 GMT-0500 (北美中部夏令时间)
 * Author = Kaicheng
 * FileBasename = WeaponScript.ts
 * FileBasenameNoExtension = WeaponScript
 * URL = db://assets/Scripts/WeaponScript.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('WeaponScript')
export class WeaponScript extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    rigidBody: RigidBody2D;
    collider: Collider2D;
    uiTransform: UITransform;
    player: Node;
    maxForceTime: number;
    curForceTime: number;
    objectForced: Node;

    onLoad () {
        this.rigidBody = this.getComponent(RigidBody2D);
        this.collider = this.getComponent(Collider2D);
        this.uiTransform = this.getComponent(UITransform);
        this.player = this.node.getParent();
        this.curForceTime = 0;
        this.maxForceTime = 0.3;
        this.objectForced = null;


    }

    start () {
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.preSolve, this);
        }
    }

    preSolve (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        console.log(selfCollider.node, otherCollider.node);
        if (otherCollider.node.name == "Enemy" && this.player.getComponent(PlayerController).getCurAttackTime() > 0) {
            this.objectForced = otherCollider.node;
            this.curForceTime = this.maxForceTime;
        }
    }

    update (deltaTime: number) {
        if (this.curForceTime > 0) {
            if (this.objectForced.position.x > this.node.parent.position.x) this.objectForced.getComponent(RigidBody2D).applyForceToCenter(new Vec2(2000, 0), true);
            if (this.objectForced.position.x < this.node.parent.position.x) this.objectForced.getComponent(RigidBody2D).applyForceToCenter(new Vec2(-2000, 0), true);
            this.curForceTime -= deltaTime;
        } else {
            this.curForceTime = 0;
        }
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
