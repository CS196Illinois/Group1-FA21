import * as cc from 'cc';
import * as utils from 'db://assets/script/others/Utils';
import { Weapon } from 'db://assets/script/others/Item';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = SoldierScript
 * DateTime = Sun Nov 28 2021 18:49:45 GMT-0600 (北美中部标准时间)
 * Author = Kaicheng
 * FileBasename = SoldierScript.ts
 * FileBasenameNoExtension = SoldierScript
 * URL = db://assets/script/SoldierScript.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('SoldierScript')
export class SoldierScript extends cc.Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    player: cc.Node;

    horizontalStep: number;
    maxDistance: number;
    maxVerticalDistance: number;
    maxHorizontalDistance: number;

    rigidBody: cc.RigidBody2D;
    collider: cc.Collider2D;
    uiTransform: cc.UITransform;

    facingRight: boolean;

    // weapon
    weapon: cc.Node;

    isOutOfBound: boolean;

    // push away by weapon
    force: number;
    forceResist: number;
    forceDecay: number;

    onLoad() {
        this.player = cc.find("Canvas/Map/Player");

        this.horizontalStep = 4;
        this.maxDistance = 60;
        this.maxVerticalDistance = 180;
        this.maxHorizontalDistance = 700;

        this.rigidBody = this.getComponent(cc.RigidBody2D);
        this.collider = this.getComponent(cc.Collider2D);
        this.uiTransform = this.getComponent(cc.UITransform);

        this.facingRight = true;

        let weaponItem = new Weapon("weapon", "SoldierWeapon");  // TODO: use weapon info from the data center
        cc.resources.load("prefabs/" + weaponItem.prefab, cc.Prefab, (err, weapon) => {
            weapon.name = weaponItem.name;
            this.weapon = cc.instantiate(weapon);
            this.node.addChild(this.weapon);
        });

        this.isOutOfBound = true;

        this.force = 0;
        this.forceResist = 1.5;
        this.forceDecay = 80;
    }

    start () {
        // [3]
    }

    update (deltaTime: number) {
        let velocity: cc.Vec2 = this.rigidBody.linearVelocity;
        let distanceCenterX: number = utils.getCenterDistance(this.node, this.player).x;
        let distance: cc.Vec3 = utils.getDistance(this.node, this.player);

        this.facingRight = distanceCenterX > 0;

        if (Math.abs(distance.y) > this.maxVerticalDistance || Math.abs(distance.x) > this.maxHorizontalDistance) {
            velocity.x = 0;
            this.isOutOfBound = true;
        } else if (distanceCenterX > this.maxDistance) {
            velocity.x = this.horizontalStep;
            this.isOutOfBound = false;
        } else if (distanceCenterX < -this.maxDistance) {
            velocity.x = -this.horizontalStep;
            this.isOutOfBound = false;
        } else {
            velocity.x = 0;
            this.isOutOfBound = false;
        }

        // Add forced effect
        velocity.x += this.force;
        if (this.force > 0) {
            this.force = Math.max(this.force - deltaTime * this.forceDecay, 0);
        } else if (this.force < 0) {
            this.force = Math.min(this.force + deltaTime * this.forceDecay, 0);
        }

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
