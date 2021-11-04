
import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

import { LoadSceneEvent, LoadSceneEventType } from './events/LoadSceneEvent';
import * as e from './events/EventManager';

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

    // child node 
    private weapon: cc.Node;

    // useful components
    private rigidBody: cc.RigidBody2D;
    private collider: cc.Collider2D;
    private _uiTransform: cc.UITransform;
    public get uiTransform(): cc.UITransform { return this._uiTransform; }
    private set uiTransform(value: cc.UITransform) { this._uiTransform = value; }

    // detect movement command
    private moveLeft: boolean;
    private moveRight: boolean;
    private jump: boolean;
    private _facingright: boolean;
    public get facingright(): boolean { return this._facingright }
    private set facingright(value: boolean) { this._facingright = value; }

    // number of consecutive jumps (while in air)
    private curJumpNum: number;
    private maxJumpNum: number;

    // drop
    private isDropping: boolean;

    // sprint
    private allowSprint: boolean;
    private sprintStep: number;
    private curSprintTime: number;
    private maxSprintTime: number;

    // speed of movement
    private horizontalStep: number;
    private verticalStep: number;
    private verticalMaxStep: number;

    // keyboard configurations
    private keyUp: cc.KeyCode;
    private keyDown: cc.KeyCode;
    private keyLeft: cc.KeyCode;
    private keyRight: cc.KeyCode;
    private keySprint: cc.KeyCode;

    onLoad () {
        // initializations
        this.weapon = this.node.getChildByName("weapon");
        this.rigidBody = this.getComponent(cc.RigidBody2D);
        this.collider = this.getComponent(cc.Collider2D);
        this._uiTransform = this.getComponent(cc.UITransform);

        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;
        this.facingright = true;

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

        console.log(this.node.getComponent(cc.Collider2D));
        console.log(this.node.getComponent(cc.RigidBody2D));
        console.log(cc.find("Canvas/Map/Terrain/Ground").getComponent(cc.Collider2D));
        console.log(cc.find("Canvas/Map/Terrain/Ground").getComponent(cc.RigidBody2D));
    }

    start () {
        // add a key down listener (when a key is pressed the function this.onKeyDown will be called)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // add a key up listener
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        // add a collision listener (invoke callback after collision is solved)
        if (this.collider) {
            this.collider.on(cc.Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }

    onKeyDown (event: cc.EventKeyboard) {
        switch (event.keyCode) {
            // if a number is pressed, emit a LoadSceneEvent to switch to the corresponding scene
            case cc.KeyCode.DIGIT_1:
            case cc.KeyCode.DIGIT_2:
                // find the number pressed
                var number = event.keyCode + 1 - cc.KeyCode.DIGIT_1;
                // example of how to emit a LoadSceneEvent
                e.EventManager.instance.emit("LoadScene", new LoadSceneEvent(
                    LoadSceneEventType.LOAD_GAME_SCENE, "Scene" + number
                ));
                break;
            case this.keyUp:
                this.jump = true;
                break;
            case this.keyDown:
                this.isDropping = true;
                break;
            case this.keyLeft:
                this.moveLeft = true;
                this.facingright = false;
                break;
            case this.keyRight:
                this.moveRight = true;
                this.facingright = true;
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
    onPostSolve (selfCollider: cc.Collider2D, otherCollider: cc.Collider2D, contact: cc.IPhysics2DContact) {
        this.isDropping = false;
        // get the bottom coordinate of the player and the top coordinate of the collider
        var selfBottom = this.node.position.y - this.uiTransform.contentSize.y * this.uiTransform.anchorY + 1;
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
