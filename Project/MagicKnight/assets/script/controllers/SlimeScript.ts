import * as cc from 'cc';
import { AttackPlayerEvent, AttackPlayerEventType } from 'db://assets/script/events/AttackPlayerEvent';
import { EventManager } from 'db://assets/script/events/EventManager';
import { PlayerController } from 'db://assets/script/controllers/PlayerController';
import * as utils from 'db://assets/script/others/Utils';
import { GameManager } from 'db://assets/script/managers/GameManager';
import { SpriteController } from 'db://assets/script/controllers/SpriteController';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = SlimeScript
 * DateTime = Sun Nov 28 2021 18:45:51 GMT-0600 (北美中部标准时间)
 * Author = Kaicheng
 * FileBasename = SlimeScript.ts
 * FileBasenameNoExtension = SlimeScript
 * URL = db://assets/script/SlimeScript.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('SlimeScript')
export class SlimeScript extends cc.Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    player = null;

    horizontalStep: number;
    horizontalStepSlow: number;
    maxDistance: number;
    maxVerticalDistance: number;
    maxHorizontalDistance: number;

    rigidBody: cc.RigidBody2D;
    collider: cc.Collider2D;
    uiTransform: cc.UITransform;

    // sprint
    private _facingRight: boolean;
    public get facingRight(): boolean { return this._facingRight; }
    public set facingRight(value: boolean) {
        if (this._facingRight == value) return;
        this._facingRight = value;
        // update image
        if (this.spriteController == null) return;
        this.spriteController.flipX = !this._facingRight;
        this.spriteController.apply();
    }

    sprintStep: number;
    curSprintTime: number;
    maxSprintTime: number;
    attackDistance: number;
    damageCD: number;
    curDamageCD: number;

    sprintCD: number;
    curSprintCD: number;

    // push back ability
    push: number;

    // push away by weapon
    force: number;
    forceResist: number;
    forceDecay: number;

    // Image of the slime
    spriteNode: cc.Node;
    spriteController: SpriteController;


    onLoad() {
        this.player = cc.find("Canvas/Map/Player");

        this.horizontalStep = 4;
        this.horizontalStepSlow = 3.6;
        this.maxDistance = 230;
        this.maxVerticalDistance = 180;
        this.maxHorizontalDistance = 900;

        this.rigidBody = this.getComponent(cc.RigidBody2D);
        this.collider = this.getComponent(cc.Collider2D);
        this.uiTransform = this.getComponent(cc.UITransform);

        this.facingRight = true;

        this.sprintStep = 25;
        this.curSprintTime = 0;
        this.maxSprintTime = 0.4;
        this.attackDistance = 300;
        this.damageCD = 1;
        this.curDamageCD = 0;

        this.sprintCD = 2;
        this.curSprintCD = 0;

        this.push = 30;

        this.force = 0;
        this.forceResist = 0.8;
        this.forceDecay = 120;

        cc.resources.preload("images/slime/spriteFrame");
        cc.resources.load("prefabs/Sprite", cc.Prefab, (err, spriteNode) => {
            // destroy own sprite
            this.node.getComponent(cc.Sprite)?.destroy();
            // add sprite child
            this.facingRight = true;
            this.spriteNode = cc.instantiate(spriteNode);
            this.node.addChild(this.spriteNode);
            // update image
            cc.resources.load("images/slime/spriteFrame", cc.SpriteFrame, (err, spriteFrame) => {
                this.facingRight = true;
                let sprite = this.spriteNode.getComponent(cc.Sprite);
                sprite.type = cc.Sprite.Type.SIMPLE;
                sprite.spriteFrame = spriteFrame;
            });
            // get sprite controller
            this.spriteController = this.spriteNode.getComponent(SpriteController);
        });
    }

    start () {
        if (this.collider) {
            this.collider.on(cc.Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }

    onPostSolve (selfCollider: cc.Collider2D, otherCollider: cc.Collider2D, contact: cc.IPhysics2DContact) {
        if (otherCollider.node.name == "Player") {
            // attack player if damageCD > 0
            if (this.curDamageCD == 0) {
                EventManager.instance.emit("AttackPlayer", new AttackPlayerEvent(
                    AttackPlayerEventType.PHYSICAL_ATTACK, 10
                ));
                // set attack cooldown
                this.curDamageCD = this.damageCD;
            }
            // push player if is currently sprinting
            if (this.curSprintTime > 0) {
                otherCollider.getComponent(PlayerController).force = this.push * (this.facingRight? 1 : -1);
            }
            // reset sprint time
            this.curSprintTime = 0;
        }
    }

    updateDirection() {
        // always face the player
        this.facingRight = utils.getCenterDistance(this.node, this.player).x > 0;
    }

    resetCurSprintCD() {
        this.curSprintCD = Math.min(this.curSprintCD + 0.5, this.sprintCD);
    }

    update (deltaTime: number) {
        let velocity: cc.Vec2 = this.rigidBody.linearVelocity;
        let distanceCenterX: number = utils.getCenterDistance(this.node, this.player).x;
        let distance: cc.Vec3 = utils.getDistance(this.node, this.player);

        // update cooldowns
        this.curSprintCD = Math.max(this.curSprintCD - deltaTime, 0);
        this.curDamageCD = Math.max(this.curDamageCD - deltaTime, 0);

        // update directions if not sprinting
        if (this.curSprintTime == 0) {
            this.updateDirection();
        }

        // check if should sprint
        if (Math.abs(distanceCenterX) < this.attackDistance && this.curSprintTime == 0 && this.curSprintCD == 0 && Math.abs(distance.y) < this.maxVerticalDistance) {
            this.curSprintTime = this.maxSprintTime;
            this.curSprintCD = this.sprintCD;
            // Jump
            velocity.y += 15;
        }

        if (this.curSprintTime > 0) {
            // Sprinting
            velocity.x = this.sprintStep * (this.facingRight ? 1 : -1);
            // Calculate remaining sprint time
            this.curSprintTime = Math.max(this.curSprintTime - deltaTime, 0);
        } else if (Math.abs(distance.y) > this.maxVerticalDistance || Math.abs(distance.x) > this.maxHorizontalDistance) {
            // Don't move if does not detect player
            velocity.x = 0;
        } else {
            // Normal movement
            if (distanceCenterX > this.maxDistance) {
                velocity.x = this.horizontalStep;
            } else if (distanceCenterX < -this.maxDistance) {
                velocity.x = -this.horizontalStep;
            } else if (distanceCenterX > 0 && distanceCenterX + this.horizontalStepSlow <= this.maxDistance) {
                velocity.x = -this.horizontalStepSlow;
            } else if (distanceCenterX < 0 && distanceCenterX - this.horizontalStepSlow >= -this.maxDistance) {
                velocity.x = this.horizontalStepSlow;
            } else {
                velocity.x = 0;
            }
        }

        // Add forced effect
        velocity.x += this.force;
        if (this.force > 0) {
            this.force = Math.max(this.force - deltaTime * this.forceDecay, 0);
        } else if (this.force < 0) {
            this.force = Math.min(this.force + deltaTime * this.forceDecay, 0);
        }

        // Apply the calculated velocity
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
