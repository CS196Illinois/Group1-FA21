
import { _decorator, Component, Node, KeyCode, RigidBody2D, BoxCollider2D, UITransform, systemEvent, SystemEvent, Contact2DType, PhysicsSystem2D, EventKeyboard, Collider2D, IPhysics2DContact, Vec2, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Playerscript2
 * DateTime = Sun Sep 26 2021 20:00:40 GMT-0500 (北美中部夏令时间)
 * Author = Kaicheng
 * FileBasename = playerscript2.ts
 * FileBasenameNoExtension = playerscript2
 * URL = db://assets/script/playerscript2.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('Playerscript2')
export class Playerscript2 extends Component {
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

    moveRight: boolean;
    moveLeft: boolean;
    jump: boolean;
    quickDrop: boolean;
    sprint: boolean;
    onGround: boolean;
    inAir: boolean;
    squat: boolean;


    curJumpNum: number;
    maxJumpNum: number;


    // speed of movement
    horizontalStep: number;
    verticalStep: number;
    verticalMaxStep: number;
    quickDropStep: number;

    oriHeight: number;
    oriWidth: number;


    sprintStep: number;
    curSprintTime: number;
    maxSprintTime: number;

    rigidBody: RigidBody2D;
    collider: BoxCollider2D;
    uiTransform: UITransform;
    sprite: Sprite;

    onLoad () {
        this.keyUp = KeyCode.KEY_W;
        this.keyDown = KeyCode.KEY_S;
        this.keyLeft = KeyCode.KEY_A;
        this.keyRight = KeyCode.KEY_D;
        this.keySprint = KeyCode.SHIFT_LEFT;

        this.moveRight = false;
        this.moveLeft = false;
        this.jump = false;
        this.sprint = false;
        this.quickDrop = false;
        this.inAir = true;
        this.squat = false;

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
        this.collider = this.getComponent(BoxCollider2D);
        this.uiTransform = this.getComponent(UITransform);
        this.sprite = this.getComponent(Sprite);

        this.oriHeight = this.uiTransform.contentSize.height;
        this.oriWidth = this.uiTransform.contentSize.width;



    }
    
    
    
    start () {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        PhysicsSystem2D.instance.on(Contact2DType.PRE_SOLVE, this.beginContact, this);
    }

    onKeyDown (event: EventKeyboard) {
        switch (event.keyCode) {
            case this.keyUp:
                this.jump = true;
                break;
            case this.keyDown:
                if (this.inAir) {
                    this.quickDrop = true;
                } else {
                    this.squat = true;
                }

                break;
            case this.keyRight:
                this.moveRight = true;
                break;
            case this.keyLeft:
                this.moveLeft = true;
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
            case this.keyDown:
                
                this.squat = false;
                break;
                
        }

    }

    beginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        
        var selfBottom = selfCollider.node.position.y - this.uiTransform.contentSize.y / 2;;
        var otherTop = otherCollider.node.position.y + otherCollider.getComponent(UITransform).contentSize.y / 2;


        if (selfBottom > otherTop) {
            this.curJumpNum = this.maxJumpNum;
            this.inAir = false;
            this.quickDrop = false;
;
        }
        
    }



    update (deltaTime: number) {
        let velocity: Vec2 = this.rigidBody.linearVelocity
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
            if (this.squat) {
                this.uiTransform.contentSize.set(this.oriWidth ,this.oriHeight / 2);
                this.collider.size.set(this.oriWidth, this.oriHeight / 2);
                this.collider.apply();
            } else {
                this.uiTransform.contentSize.set(this.oriWidth ,this.oriHeight);
                this.collider.size.set(this.oriWidth, this.oriHeight);
                this.collider.apply();
            }

            velocity.x = 0;
            if (this.moveRight) velocity.x += this.horizontalStep;
            if (this.moveLeft) velocity.x -= this.horizontalStep;

            if (this.jump && this.curJumpNum > 0) {
                velocity.y = this.verticalStep;
                this.curJumpNum--;
            }

            if (velocity.y != 0) {
                this.inAir = true;
            }

            if (this.quickDrop) {
                velocity.y = this.quickDropStep;
            } 
        }

        velocity.y = Math.min(Math.max(velocity.y, -this.verticalMaxStep), this.verticalMaxStep);
        this.rigidBody.linearVelocity = velocity;

        this.jump = false;
        console.log(this.squat);
        console.log(this.uiTransform.contentSize.y);
        console.log(this.collider.size);


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
