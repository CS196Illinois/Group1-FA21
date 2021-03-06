
import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = PlayerController
 * DateTime = Sat Sep 18 2021 22:22:41 GMT-0500 (Central Daylight Time)
 * Author = cty012
 * FileBasename = PlayerController.ts
 * FileBasenameNoExtension = PlayerController
 * URL = db://assets/PlayerController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('PlayerController')
export class PlayerController extends cc.Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    // useful components
    rigidBody: cc.RigidBody2D;
    collider: cc.Collider2D;
    uiTransform: cc.UITransform;

    // detect movement command
    moveLeft: boolean;
    moveRight: boolean;
    jump: boolean;

    // number of consecutive jumps (while in air)
    curJumpNum: number;
    maxJumpNum: number;

    // drop
    isDropping: boolean;

    // sprint
    allowSprint: boolean;
    sprintStep: number;
    curSprintTime: number;
    maxSprintTime: number;

    // speed of movement
    horizontalStep: number;
    verticalStep: number;
    verticalMaxStep: number;

    // keyboard configurations
    keyUp: cc.KeyCode;
    keyDown: cc.KeyCode;
    keyLeft: cc.KeyCode;
    keyRight: cc.KeyCode;
    keySprint: cc.KeyCode;

    onLoad () {
        // initializations
        this.rigidBody = this.getComponent(cc.RigidBody2D);
        this.collider = this.getComponent(cc.Collider2D);
        this.uiTransform = this.getComponent(cc.UITransform);

        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;

        this.curJumpNum = 0;
        this.maxJumpNum = 1;

        this.isDropping = false;

        this.allowSprint = true;
        this.sprintStep = 60;
        this.curSprintTime = 0;
        this.maxSprintTime = 0.15;

        this.horizontalStep = 10;
        this.verticalStep = 30;
        this.verticalMaxStep = 100;

        this.keyUp = cc.KeyCode.KEY_W;
        this.keyDown = cc.KeyCode.KEY_S;
        this.keyLeft = cc.KeyCode.KEY_A;
        this.keyRight = cc.KeyCode.KEY_D;
        this.keySprint = cc.KeyCode.SHIFT_LEFT;
    }

    start () {
        // add a key down listener (when a key is pressed the function this.onKeyDown will be called)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // add a key up listener
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        // add a collision listener (invoke callback after collision is solved)
        cc.PhysicsSystem2D.instance.on(cc.Contact2DType.POST_SOLVE, this.onPostSolve, this);
    }

    onKeyDown (event: cc.EventKeyboard) {
        switch (event.keyCode) {
            case this.keyUp:
                this.jump = true;
                break;
            case this.keyDown:
                this.isDropping = true;
                break;
            case this.keyLeft:
                this.moveLeft = true;
                break;
            case this.keyRight:
                this.moveRight = true;
                break;
            case this.keySprint:
                if (!this.allowSprint) {
                    break;
                }
                // only sprint if not currently sprinting and has x-direction speed
                if (this.curSprintTime == 0 && this.rigidBody.linearVelocity.x != 0) {
                    this.curSprintTime = this.maxSprintTime;
                }
                break;
        }
    }

    onKeyUp (event: cc.EventKeyboard) {
        switch (event.keyCode) {
            case this.keyLeft:
                this.moveLeft = false;
                break;
            case this.keyRight:
                this.moveRight = false;
                break;
        }
    }

    // this function is a previous version of onPostSolve that only works with box colliders
    onPostSolve (otherCollider: cc.Collider2D, selfCollider: cc.Collider2D, contact: cc.IPhysics2DContact) {
        this.isDropping = false;
        // get the bottom coordinate of the player and the top coordinate of the collider
        var selfBottom = this.node.position.y - this.uiTransform.contentSize.y * this.uiTransform.anchorY;
        var otherUITransform = otherCollider.getComponent(cc.UITransform);
        var otherTop = otherCollider.node.position.y + otherUITransform.contentSize.y * (1 - otherUITransform.anchorY);

        // if the bottom of the player is larger than the collider, that means the player is on top of the collider
        // therefore the number of air jumps should be reset to maximum
        if (selfBottom > otherTop) {
            this.curJumpNum = this.maxJumpNum;
        }
    }

    update (deltaTime: number) {
        var velocity: cc.Vec2 = null;
        if (this.curSprintTime > 0) {
            // if is currently sprinting then set velocity to sprint velocity with the same direction as current movement
            velocity = new cc.Vec2(this.rigidBody.linearVelocity.x > 0 ? this.sprintStep : -this.sprintStep, 0);
            this.curSprintTime = Math.max(this.curSprintTime - deltaTime, 0);
        } else {
            // x direction velocity is reset to 0 and then calculated
            velocity = new cc.Vec2(0, this.rigidBody.linearVelocity.y);
            if (this.moveLeft) velocity.x -= this.horizontalStep;
            if (this.moveRight) velocity.x += this.horizontalStep;

            // if jumps (and is able to jump) then set y direction velocity to jump speed
            if (this.jump && this.curJumpNum > 0) {
                velocity.y = this.verticalStep;
                this.curJumpNum--;
            }

            // if is dropping set velocity to maximum pointing downward
            if (this.isDropping) {
                velocity.y = -this.verticalMaxStep;
            }

            // make sure y direction has speed less than this.verticalMaxStep
            velocity.y = Math.min(Math.max(velocity.y, -this.verticalMaxStep), this.verticalMaxStep);
        }
        // update the velocity of the player
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
