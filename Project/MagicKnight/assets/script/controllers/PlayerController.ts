import * as cc from 'cc';
import * as utils from 'db://assets/script/others/Utils';
import { LoadSceneEvent, LoadSceneEventType } from 'db://assets/script/events/LoadSceneEvent';
import { EventManager } from 'db://assets/script/events/EventManager';
import { Backpack } from 'db://assets/script/controllers/BackpackController';
import { Weapon } from 'db://assets/script/others/Item';
import { AttackPlayerEvent, AttackPlayerEventType } from 'db://assets/script/events/AttackPlayerEvent';
import { HPChangeEvent, HPChangeEventType } from 'db://assets/script/events/HPChangeEvent';
import { GameManager } from 'db://assets/script/managers/GameManager';
import { SpriteController } from 'db://assets/script/controllers/SpriteController';
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
    // useful components
    private rigidBody: cc.RigidBody2D;
    private collider: cc.Collider2D;
    private uiTransform: cc.UITransform;

    // detect movement command
    public moveLeft: boolean;
    public moveRight: boolean;
    public jump: boolean;
    private _facingRight: boolean;
    public get facingRight(): boolean { return this._facingRight; }
    public set facingRight(value: boolean) {
        if (this._facingRight == value) return;
        this._facingRight = value;
        if (this.spriteController == null) return;
        this.spriteController.padding.flipX();
        this.spriteController.flipX = !this._facingRight;
        this.spriteController.apply();
    }

    // number of consecutive jumps (while in air)
    public curJumpNum: number;
    public maxJumpNum: number;

    // drop
    public isDropping: boolean;

    // sprint
    public allowSprint: boolean;
    public sprintStep: number;
    public curSprintTime: number;
    public sprintTime: number;
    public curSprintCD: number;
    public sprintCD: number;
    public sprintDirection: number;

    // speed of movement
    public horizontalStep: number;
    public verticalStep: number;
    public verticalMaxStep: number;

    // push away by weapons
    public force: number;
    public forceDecay: number;

    // keyboard configurations
    public keyUp: cc.KeyCode;
    public keyDown: cc.KeyCode;
    public keyLeft: cc.KeyCode;
    public keyRight: cc.KeyCode;
    public keySprint: cc.KeyCode;

    // backpack
    private _backpack: Backpack;
    public get backpack(): Backpack { return this._backpack; }
    private set backpack(value: Backpack) { this._backpack = value; }

    // sprite
    private image: cc.SpriteFrame;
    public imageSize: cc.Size;
    private spriteNode: cc.Node;
    private spriteController: SpriteController;

    // weapon
    private _weapon: cc.Node;
    public get weapon(): cc.Node { return this._weapon; }
    private set weapon(value: cc.Node) { this._weapon = value; }

    // hp
    public hp: number;
    public maxHp: number;

    onLoad () {
        this.rigidBody = this.getComponent(cc.RigidBody2D);
        this.collider = this.getComponent(cc.Collider2D);
        this.uiTransform = this.getComponent(cc.UITransform);

        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;
        this.facingRight = true;

        this.curJumpNum = 0;
        this.maxJumpNum = 1;

        this.isDropping = false;

        this.allowSprint = true;
        this.sprintStep = 60;
        this.curSprintTime = 0;
        this.sprintTime = 0.15;
        this.curSprintCD = 0;
        this.sprintCD = 2;
        this.sprintDirection = 0;

        this.horizontalStep = 10;
        this.verticalStep = 30;
        this.verticalMaxStep = 100;

        this.force = 0;
        this.forceDecay = 100;

        this.keyUp = cc.KeyCode.KEY_W;
        this.keyDown = cc.KeyCode.KEY_S;
        this.keyLeft = cc.KeyCode.KEY_A;
        this.keyRight = cc.KeyCode.KEY_D;
        this.keySprint = cc.KeyCode.SHIFT_LEFT;

        // backpack
        this.backpack = new Backpack();
        this.backpack.loadItems();

        // sprite
        let gameManager = cc.find("GameManager").getComponent(GameManager);
        this.image = gameManager.playerSpriteFrame;
        this.imageSize = new cc.Size(60, 60);
        cc.resources.load("prefabs/Sprite", cc.Prefab, (err, spriteNode) => {
            // destroy own sprite
            this.node.getComponent(cc.Sprite)?.destroy();
            // add sprite child
            this.spriteNode = cc.instantiate(spriteNode);
            this.node.addChild(this.spriteNode);
            // update image
            let sprite = this.spriteNode.getComponent(cc.Sprite);
            sprite.type = cc.Sprite.Type.SIMPLE;
            sprite.spriteFrame = this.image;
            // get sprite controller
            this.spriteController = this.spriteNode.getComponent(SpriteController);
            this.spriteController.padding = new utils.Padding(
                this.uiTransform.width - this.imageSize.width,
                this.uiTransform.height - this.imageSize.height,
                0,
                0
            );
            this.spriteController.apply();
        });

        // weapon
        let weaponItem = new Weapon("weapon", "Weapon");  // TODO: use weapon info from the data center
        cc.resources.load("prefabs/" + weaponItem.prefab, cc.Prefab, (err, weapon) => {
            weapon.name = weaponItem.name;
            this.weapon = cc.instantiate(weapon);
            this.node.addChild(this.weapon);
        });

        //hp
        this.maxHp = 100;
        this.hp = this.maxHp;
    }

    eventId = 0

    start () {
        // add a key down listener (when a key is pressed the function this.onKeyDown will be called)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // add a key up listener
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        // add a collision listener (invoke callback after collision is solved)
        this.eventId = EventManager.instance.on("AttackPlayer", (event: AttackPlayerEvent) => this.onAttack(event));
        if (this.collider) {
            this.collider.on(cc.Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }

    onDestroy () {
        EventManager.instance.off("AttackPlayer", this.eventId);
    }

    onAttack (event: AttackPlayerEvent) {
        if (event.type == AttackPlayerEventType.PHYSICAL_ATTACK) {
            this.hp = Math.max(this.hp - event.attack, 0);
            EventManager.instance.emit("hp-change", new HPChangeEvent(
                HPChangeEventType.HP_CHANGE, this.hp
            ));
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
                EventManager.instance.emit("LoadScene", new LoadSceneEvent(
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
                this.facingRight = false;
                break;
            case this.keyRight:
                this.moveRight = true;
                this.facingRight = true;
                break;
            case this.keySprint:
                if (!this.allowSprint) {
                    break;
                }
                // only sprint if sprint finish cooldown and has x-direction speed
                if (this.curSprintCD == 0 && this.rigidBody.linearVelocity.x != 0) {
                    this.curSprintTime = this.sprintTime;
                    this.curSprintCD = this.sprintCD;
                    this.sprintDirection = this.facingRight ? 1 : -1;
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
            // if currently sprinting then sprint
            velocity = new cc.Vec2( this.sprintStep * this.sprintDirection, 0);
        } else {
            // reset sprint direction

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
        // apply effects from weapon pushing
        velocity.x += this.force;
        if (this.force > 0) {
            this.force = Math.max(this.force - deltaTime * this.forceDecay, 0);
        } else if (this.force < 0) {
            this.force = Math.min(this.force + deltaTime * this.forceDecay, 0);
        }
        // update the velocity of the player
        this.rigidBody.linearVelocity = velocity;
        this.jump = false;
        // subtract passed time from cooldowns
        this.curSprintTime = Math.max(this.curSprintTime - deltaTime, 0);
        this.curSprintCD = Math.max(this.curSprintCD - deltaTime, 0);
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
