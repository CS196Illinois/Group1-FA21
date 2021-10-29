
import { _decorator, Component, Node, PhysicsSystem2D, Contact2DType, Collider2D, IPhysics2DContact, UITransform, RigidBody2D } from 'cc';
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
    maxRotateTime: number;
    curRotateTime: number;

    isCollide: boolean;

    onLoad () {
        this.rigidBody = this.getComponent(RigidBody2D);
        this.collider = this.getComponent(Collider2D);
        this.uiTransform = this.getComponent(UITransform);
        this.player = this.node.getParent();

        this.maxRotateTime = 0.2;
        this.curRotateTime = 0;
        this.isCollide = false;
    }

    start () {
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.begineContact, this);
        }
    }

    begineContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        console.log(selfCollider.node, otherCollider.node);
        this.isCollide = true;
    }

    update (deltaTime: number) {
        
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
