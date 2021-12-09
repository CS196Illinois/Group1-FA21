import * as cc from 'cc';
import * as utils from 'db://assets/script/others/Utils';
import { PlayerController } from 'db://assets/script/controllers/PlayerController';
import { SlimeScript } from 'db://assets/script/controllers/SlimeScript';
import { SoldierScript } from 'db://assets/script/controllers/SoldierScript';
const { ccclass, property } = cc._decorator;

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
export class WeaponScript extends cc.Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    // rigidBody: cc.RigidBody2D;
    collider: cc.Collider2D;
    uiTransform: cc.UITransform;
    player: cc.Node;
    playerController: PlayerController;
    maxRotateTime: number;
    curRotateTime: number;

    isCollide: boolean;

    //attack
    private initialRotation: number;
    private finalRotation: number;
    private curAttackTime: number;
    private maxAttackTime: number;

    // Force of weapon
    public push: number;

    // weapom position
    private weaponRightX: number;
    private weaponY: number;

    private keyAttack: cc.KeyCode;

    onLoad () {
        // this.rigidBody = this.getComponent(cc.RigidBody2D);
        this.collider = this.getComponent(cc.Collider2D);
        this.uiTransform = this.getComponent(cc.UITransform);
        this.player = this.node.getParent();

        this.maxRotateTime = 0.2;
        this.curRotateTime = 0;
        this.isCollide = false;

        this.initialRotation = 20;
        this.finalRotation = 170;
        this.curAttackTime = 0;
        this.maxAttackTime = 0.12;

        this.push = 40;

        this.weaponRightX = 40;
        this.weaponY = 30;

        this.keyAttack = cc.KeyCode.KEY_J;
    }

    start () {
        this.playerController = this.player.getComponent(PlayerController);
        if (this.collider) {
            this.collider.on(cc.Contact2DType.BEGIN_CONTACT, this.preSolve, this);
        }
        // add a key down listener (when a key is pressed the function this.onKeyDown will be called)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown (event: cc.EventKeyboard) {
        switch (event.keyCode) {
            case this.keyAttack:
                if (this.curAttackTime == 0)  {
                    this.curAttackTime = this.maxAttackTime;
                }
                break;
        }
    }

    preSolve (selfCollider: cc.Collider2D, otherCollider: cc.Collider2D, contact: cc.IPhysics2DContact) {
        if (this.curAttackTime == 0) {
            return;
        } else if (otherCollider.node.parent.name == "Slime") {
            let slimeScript = otherCollider.getComponent(SlimeScript);
            let direction = utils.getDirection(utils.getCenter(this.node.parent), utils.getCenter(otherCollider.node)).x;
            slimeScript.force = this.push / slimeScript.forceResist * direction;
            slimeScript.resetCurSprintCD();
        } else if (otherCollider.node.parent.name == "Soldier") {
            let soldierScript = otherCollider.getComponent(SoldierScript);
            let direction = utils.getDirection(utils.getCenter(this.node.parent), utils.getCenter(otherCollider.node)).x;
            soldierScript.force = this.push / soldierScript.forceResist * direction;
        }
    }

    update (deltaTime: number) {
        // enable collider when attacking
        this.collider.enabled = this.curAttackTime > 0;
        this.collider.apply();

        // set direction
        if (this.playerController.facingRight) {
            this.node.setPosition(this.weaponRightX, this.weaponY);
        } else {
            this.node.setPosition(this.playerController.uiTransform.width - this.weaponRightX, this.weaponY);
        }

        // set rotation
        let direction = this.playerController.facingRight? 1 : -1;
        let progress = (this.curAttackTime == 0) ? 0 : 1 - this.curAttackTime / this.maxAttackTime;
        this.node.setRotationFromEuler(0, 0, -direction * (this.initialRotation * (1 - progress) + this.finalRotation * progress));

        // update cd
        this.curAttackTime = Math.max(this.curAttackTime - deltaTime, 0);
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
