
import * as cc from 'cc';
import { AttackPlayerEvent, AttackPlayerEventType } from './events/AttackPlayerEvent';
import { EventManager } from './events/EventManager';
import { PlayerController } from './PlayerController';
import { SlimeScript } from './SlimeScript';
import { SoldierScript } from './SoldierScript';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = NewComponent
 * DateTime = Sat Dec 04 2021 19:07:14 GMT-0600 (北美中部标准时间)
 * Author = Kaicheng
 * FileBasename = NewComponent.ts
 * FileBasenameNoExtension = NewComponent
 * URL = db://assets/script/NewComponent.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('EnemyWeaponScript')
export class EnemyWeaponScript extends cc.Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    rigidBody: cc.RigidBody2D;
    collider: cc.Collider2D;
    uiTransform: cc.UITransform;
    soldier: cc.Node;
    SoldierScript: SoldierScript;
    maxRotateTime: number;
    curRotateTime: number;

    isCollide: boolean;

    //attack
    private rotateStep: number;
    private initialRotation: number;
    private curAttackTime: number;
    private maxAttackTime: number;
    private canDamage: boolean;

    attackRadius: number;

    // Apply force to enemy
    maxForceTime: number;
    curForceTime: number;
    objectForced: cc.Node;

    // weapom position
    private weaponRightX: number;
    private weaponY: number;

    attackCd: number;
    curCdtime: number;


    onLoad () {
        this.rigidBody = this.getComponent(cc.RigidBody2D);
        this.collider = this.getComponent(cc.Collider2D);
        this.uiTransform = this.getComponent(cc.UITransform);
        this.soldier = this.node.getParent();

        this.maxRotateTime = 0.2;
        this.curRotateTime = 0;
        this.isCollide = false;

        this.rotateStep = -30;
        this.initialRotation = -25;
        this.curAttackTime = 0;
        this.maxAttackTime = 0.15;
        this.canDamage = true;

        this.attackRadius = 70;

        this.curForceTime = 0;
        this.maxForceTime = 0.3;
        this.objectForced = null;

        this.weaponRightX = 40;
        this.weaponY = 30;

        this.attackCd = 0.5;
        this.curCdtime = 0;
    }

    start () {
        this.SoldierScript = this.soldier.getComponent(SoldierScript);
        if (this.collider) {
            this.collider.on(cc.Contact2DType.BEGIN_CONTACT, this.preSolve, this);
            this.collider.on(cc.Contact2DType.END_CONTACT, this.preSolve, this);
        }
    }


    preSolve (selfCollider: cc.Collider2D, otherCollider: cc.Collider2D, contact: cc.IPhysics2DContact) {
        if (otherCollider.node.name == "Player" && this.curAttackTime > 0 && this.canDamage) {
            this.canDamage = false;
            this.objectForced = otherCollider.node;
            this.curForceTime = this.maxForceTime;
            EventManager.instance.emit("AttackPlayer", new AttackPlayerEvent(
                AttackPlayerEventType.PHYSICAL_ATTACK, 20
            ));
        }
    }

    update (deltaTime: number) {
        // if finish attacking then allow giving damage to player
        if (this.curAttackTime == 0) this.canDamage = true;

        // enable collider when attacking
        if (this.curAttackTime > 0) {
            this.collider.enabled = true;
        } else {
            this.collider.enabled = false;
        }
        this.collider.apply();

        // follow player
        if (this.SoldierScript.facingright) {
            this.node.setPosition(this.weaponRightX, this.weaponY);
        } else {
            this.node.setPosition(this.SoldierScript.uiTransform.contentSize.width - this.weaponRightX, this.weaponY);
        }

        // attack
        if (this.curAttackTime > 0) {
            if (this.SoldierScript.facingright) this.rigidBody.angularVelocity = this.rotateStep;
            if (!this.SoldierScript.facingright) this.rigidBody.angularVelocity = -this.rotateStep;
            this.curAttackTime = Math.max(this.curAttackTime - deltaTime, 0);
        } else {
            this.rigidBody.angularVelocity = 0;
            if (this.SoldierScript.facingright) this.node.setRotationFromEuler(0, 0, this.initialRotation);
            if (!this.SoldierScript.facingright) this.node.setRotationFromEuler(0, 0, -this.initialRotation);
        }

        // apply force
        if (this.curForceTime > 0) {
            let direction = this.objectForced.position.x > this.node.parent.position.x ? 1 : -1;
            this.objectForced.getComponent(cc.RigidBody2D).applyForceToCenter(new cc.Vec2(2000 * direction, 0), true);
            this.curForceTime -= deltaTime;
        } else {
            this.curForceTime = 0;
        }

        // decide if attack
        this.curCdtime = Math.max(this.curCdtime - deltaTime, 0);
        if (this.curAttackTime == 0 && Math.abs(this.SoldierScript.distanceBetween) < this.attackRadius && this.curCdtime == 0 && !this.SoldierScript.isOutOfBound) {
            this.curAttackTime = this.maxAttackTime;
            this.curCdtime = this.attackCd;
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
