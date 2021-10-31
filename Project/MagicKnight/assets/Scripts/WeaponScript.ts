
import * as cc from 'cc';
import { PlayerController } from './PlayerController';
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
    rigidBody: cc.RigidBody2D;
    collider: cc.Collider2D;
    uiTransform: cc.UITransform;
    player: cc.Node;
    playerController: PlayerController;
    maxRotateTime: number;
    curRotateTime: number;

    isCollide: boolean;

    //attack
    private allowAttack: boolean;
    private rotateStep: number;
    private initialRotation: number;
    private curAttackTime: number;
    private maxAttackTime: number;

    // weapom position
    private weaponRightX: number;
    private weaponY: number;

    private keyAttack: cc.KeyCode;

    onLoad () {
        this.rigidBody = this.getComponent(cc.RigidBody2D);
        this.collider = this.getComponent(cc.Collider2D);
        this.uiTransform = this.getComponent(cc.UITransform);
        this.player = this.node.getParent();
        this.playerController = this.player.getComponent(PlayerController);

        this.maxRotateTime = 0.2;
        this.curRotateTime = 0;
        this.isCollide = false;

        this.allowAttack = true;
        this.rotateStep = -30;
        this.initialRotation = -25;
        this.curAttackTime = 0;
        this.maxAttackTime = 0.15;

        this.weaponRightX = 40;
        this.weaponY = 30;

        this.keyAttack = cc.KeyCode.KEY_J;
    }

    start () {
        if (this.collider) {
            this.collider.on(cc.Contact2DType.BEGIN_CONTACT, this.begineContact, this);
        }
        // add a key down listener (when a key is pressed the function this.onKeyDown will be called)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown (event: cc.EventKeyboard) {
        switch (event.keyCode) {
            case this.keyAttack:
                if(!this.allowAttack) {
                    break;
                }
                if (this.curAttackTime == 0)  {
                    this.curAttackTime = this.maxAttackTime;
                }
                break;
        }
    }

    begineContact (selfCollider: cc.Collider2D, otherCollider: cc.Collider2D, contact: cc.IPhysics2DContact) {
        console.log(selfCollider.node, otherCollider.node);
        this.isCollide = true;
    }

    update (deltaTime: number) {
        // follow player
        if (this.playerController.facingright) {
            this.node.setPosition(this.weaponRightX, this.weaponY);
        } else {
            this.node.setPosition(this.playerController.uiTransform.contentSize.width - this.weaponRightX, this.weaponY);
        }

        // attack
        if (this.curAttackTime > 0) {
            if (this.playerController.facingright) this.rigidBody.angularVelocity = this.rotateStep;
            if (!this.playerController.facingright) this.rigidBody.angularVelocity = -this.rotateStep;
            this.curAttackTime = Math.max(this.curAttackTime - deltaTime, 0);
        } else {
            this.rigidBody.angularVelocity = 0;
            if (this.playerController.facingright) this.node.setRotationFromEuler(0, 0, this.initialRotation);
            if (!this.playerController.facingright) this.node.setRotationFromEuler(0, 0, -this.initialRotation);
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
