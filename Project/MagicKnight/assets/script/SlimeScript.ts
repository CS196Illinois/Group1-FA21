
import * as cc from 'cc';
import { AttackPlayerEvent, AttackPlayerEventType } from './events/AttackPlayerEvent';
import { EventManager } from './events/EventManager';
import { PlayerController } from './PlayerController';
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
    sprintToRight: boolean;
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

        this.sprintToRight = true;
        this.sprintStep = 25;
        this.curSprintTime = 0;
        this.maxSprintTime = 0.7;
        this.attackDistance = 300;
        this.damageCD = 1;
        this.curDamageCD = 0;

        this.sprintCD = 2;
        this.curSprintCD = 0;

        this.push = 30;

        this.force = 0;
        this.forceResist = 0.8;
        this.forceDecay = 120;
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
                this.curDamageCD = this.damageCD
            }
            // push player if is currently sprinting
            if (this.curSprintTime > 0) {
                let direction = otherCollider.node.position.x > this.node.position.x ? 1 : -1;
                console.log(direction);
                otherCollider.getComponent(PlayerController).force = this.push * direction;
            }
            // reset sprint time
            this.curSprintTime = 0;
        }
    }

    resetCurSprintCD () {
        this.curSprintCD = Math.min(this.curSprintCD + 0.5, this.sprintCD);
    }

    update (deltaTime: number) {
        let velocity: cc.Vec2 = this.rigidBody.linearVelocity;
        let playerwidth: number = this.player.getComponent(cc.UITransform).contentSize.width;
        let enemywidth: number = this.uiTransform.contentSize.width;
        let distanceBetween: number = (this.player.position.x + playerwidth / 2) - (this.node.position.x + enemywidth / 2);
        let verticalDistance: number = Math.abs(this.player.position.y - this.node.position.y);
        let horizontalDistance: number = Math.abs(this.player.position.x - this.node.position.x);

        // update cooldowns
        this.curSprintCD = Math.max(this.curSprintCD - deltaTime, 0);
        this.curDamageCD = Math.max(this.curDamageCD - deltaTime, 0);

        // check if sprint
        if (Math.abs(distanceBetween) < this.attackDistance && this.curSprintTime == 0 && this.curSprintCD == 0 && verticalDistance < this.maxVerticalDistance) {
            if (distanceBetween > 0) {
                this.sprintToRight = true;
            } else {
                this.sprintToRight = false;
            }
            this.curSprintTime = this.maxSprintTime;
            this.curSprintCD = this.sprintCD;
            // Jump
            velocity.y += 15;
        }

        if (this.curSprintTime > 0) {
            // Sprinting
            if (this.sprintToRight) {
                velocity.x = this.sprintStep
            } else {
                velocity.x = - this.sprintStep;
            }
            // Calculate remaining sprint time
            this.curSprintTime = Math.max(this.curSprintTime - deltaTime, 0);
        } else if (verticalDistance > this.maxVerticalDistance || horizontalDistance > this.maxHorizontalDistance) {
            // Don't move if does not detect player
            velocity.x = 0;
        } else {
            // Normal movement
            if (distanceBetween > this.maxDistance) {
                velocity.x = this.horizontalStep;
            } else if (distanceBetween < -this.maxDistance) {
                velocity.x = -this.horizontalStep;
            } else if (distanceBetween > 0 && distanceBetween + this.horizontalStepSlow <= this.maxDistance) {
                velocity.x = -this.horizontalStepSlow;
            } else if (distanceBetween < 0 && distanceBetween - this.horizontalStepSlow >= -this.maxDistance) {
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
