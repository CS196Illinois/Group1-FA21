
import * as cc from 'cc';
const { ccclass, property } = cc._decorator;
import { Weapon } from './Item';
import { WeaponScript } from './WeaponScript';
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

    player = null;

    horizontalStep: number;
    maxDistance: number;
    maxVerticalDistance: number;
    maxHorizontalDistance: number;

    rigidBody: cc.RigidBody2D;
    collider: cc.Collider2D;
    uiTransform: cc.UITransform;

    facingright: boolean;

    // weapon
    weapon: cc.Node;

    distanceBetween: number;

    isOutOfBound: boolean;

    onLoad() {
        this.player = cc.find("Canvas/Map/Player");

        this.horizontalStep = 4;
        this.maxDistance = 60;
        this.maxVerticalDistance = 180;
        this.maxHorizontalDistance = 700;

        this.rigidBody = this.getComponent(cc.RigidBody2D);
        this.collider = this.getComponent(cc.Collider2D);
        this.uiTransform = this.getComponent(cc.UITransform);

        this.facingright = true;

        let weaponItem = new Weapon("weapon", "SoldierWeapon");  // TODO: use weapon info from the data center
        cc.resources.load("prefabs/" + weaponItem.prefab, cc.Prefab, (err, weapon) => {
            weapon.name = weaponItem.name;
            this.weapon = cc.instantiate(weapon);
            this.node.addChild(this.weapon);
        });

        let playerwidth: number = this.player.getComponent(cc.UITransform).contentSize.width;
        let enemywidth: number = this.uiTransform.contentSize.width;
        this.distanceBetween = (this.player.position.x + playerwidth / 2) - (this.node.position.x + enemywidth / 2);

        this.isOutOfBound = true;

    }

    start () {
        // [3]
    }

    update (deltaTime: number) {
        let velocity: cc.Vec2 = this.rigidBody.linearVelocity;
        let verticalDistance: number = Math.abs(this.player.position.y - this.node.position.y);
        let horizontalDistance: number = Math.abs(this.player.position.x - this.node.position.x)

        let playerwidth: number = this.player.getComponent(cc.UITransform).contentSize.width;
        let enemywidth: number = this.uiTransform.contentSize.width;
        this.distanceBetween = (this.player.position.x + playerwidth / 2) - (this.node.position.x + enemywidth / 2);

        if (this.distanceBetween > 0) this.facingright = true;
        if (this.distanceBetween < 0) this.facingright = false;

        if (verticalDistance > this.maxVerticalDistance || horizontalDistance > this.maxHorizontalDistance) {
            velocity.x = 0;
            this.isOutOfBound = true;
        } else if (this.distanceBetween > this.maxDistance) {
            velocity.x = this.horizontalStep;
            this.isOutOfBound = false;
        } else if (this.distanceBetween < -this.maxDistance) {
            velocity.x = -this.horizontalStep;
            this.isOutOfBound = false;
        } else {
            velocity.x = 0;
            this.isOutOfBound = false;
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
