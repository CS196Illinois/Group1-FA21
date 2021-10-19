
import { _decorator, Component, Node, systemEvent, SystemEvent, EventKeyboard, KeyCode, Vec2, Vec3, RigidBody2D, Collider2D, Contact2DType, PhysicsSystem2D, IPhysics2DContact, UITransform, Animation } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Playerscript
 * DateTime = Thu Sep 23 2021 20:02:13 GMT-0500 (北美中部夏令时间)
 * Author = Kaicheng
 * FileBasename = playerscript.ts
 * FileBasenameNoExtension = playerscript
 * URL = db://assets/script/playerscript.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('Playerscript')
export class Playerscript extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    keyUp: KeyCode;
    keyDown: KeyCode;
    keyLeft: KeyCode;
    keyRight: KeyCode;
    keySprint: KeyCode;
    keyAttack: KeyCode;

    moveRight: boolean;
    moveLeft: boolean;
    jump: boolean;
    quickDrop: boolean;
    sprint: boolean;
    attack: boolean;
    faceRight: boolean;


    curJumpNum: number;
    maxJumpNum: number;


    // speed of movement
    horizontalStep: number;
    verticalStep: number;
    verticalMaxStep: number;
    quickDropStep: number;


    sprintStep: number;
    curSprintTime: number;
    maxSprintTime: number;

    rigidBody: RigidBody2D;
    collider: Collider2D;
    uiTransform: UITransform;
    animation: Animation;

    onLoad () {
        this.keyUp = KeyCode.KEY_W;
        this.keyDown = KeyCode.KEY_S;
        this.keyLeft = KeyCode.KEY_A;
        this.keyRight = KeyCode.KEY_D;
        this.keySprint = KeyCode.SHIFT_LEFT;
        this.keyAttack = KeyCode.KEY_J;

        this.moveRight = false;
        this.moveLeft = false;
        this.jump = false;
        this.sprint = false;
        this.quickDrop = false;
        this.attack = false;
        this.faceRight = true;

        this.curJumpNum = 0;
        this.maxJumpNum = 1;

        this.horizontalStep = 10;
        this.verticalStep = 35;
        this.quickDropStep = -70;
        this.verticalMaxStep = 70;

        

        this.sprintStep = 50;
        this.curSprintTime = 0;
        this.maxSprintTime = 0.15;
        
        this.rigidBody = this.getComponent(RigidBody2D);
        this.collider = this.getComponent(Collider2D);
        this.uiTransform = this.getComponent(UITransform);
        this.animation = this.getComponent(Animation);


    }
    
    
    
    start () {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        PhysicsSystem2D.instance.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        // [3]
    }

    onKeyDown (event: EventKeyboard) {
        switch (event.keyCode) {
            case this.keyUp:
                this.jump = true;
                break;
            case this.keyDown:
                this.quickDrop = true;
                break;
            case this.keyRight:
                this.moveRight = true;
                break;
            case this.keyLeft:
                this.moveLeft = true;
                break;
            case this.keyAttack:
                this.attack = true;
                break;
            case this.keySprint:
                if (this.curSprintTime == 0 && this.rigidBody.linearVelocity.x != 0) {
                    this.curSprintTime = this.maxSprintTime;
                }
                break;
        }

    }

    onKeyUp (event: EventKeyboard) {
        switch (event.keyCode) {
            case this.keyRight:
                this.moveRight = false;
                break;
            case this.keyLeft:
                this.moveLeft = false;
                break;
        }

    }

    onPostSolve (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        this.quickDrop = false;
        var selfBottom = selfCollider.node.position.y;
        var otherTop = otherCollider.node.position.y + otherCollider.getComponent(UITransform).contentSize.y;


        if (selfBottom > otherTop) {
            this.curJumpNum = this.maxJumpNum;
        }
        
    }



    update (deltaTime: number) {
        let velocity: Vec2 = this.rigidBody.linearVelocity
        if (this.attack) {
            this.animation.play("attack to the right");
            this.attack = false;
            console.log("yep");
        }


        if (this.curSprintTime > 0) {
            velocity.y = 0;
            if (velocity.x > 0) {
                velocity.x = this.sprintStep;
                this.curSprintTime -= deltaTime;
            } else {
                velocity.x = -this.sprintStep;
                this.curSprintTime -= deltaTime;
            }
            this.curSprintTime = Math.max(0, this.curSprintTime);
        } else{
            velocity.x = 0;
            if (this.moveRight) velocity.x += this.horizontalStep;
            if (this.moveLeft) velocity.x -= this.horizontalStep;

            if (this.jump && this.curJumpNum > 0) {
                velocity.y = this.verticalStep;
                this.curJumpNum--;
            }

            if (this.quickDrop) {
                velocity.y = this.quickDropStep;
            }
        }

        velocity.y = Math.min(Math.max(velocity.y, -this.verticalMaxStep), this.verticalMaxStep);
        this.rigidBody.linearVelocity = velocity;

        this.jump = false;
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
