
import * as cc from 'cc';
import { Vec3 } from 'cc';
//import { _decorator, Component, Node, CCObject } from 'cc';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = CameraMovement
 * DateTime = Mon Oct 18 2021 00:37:32 GMT-0500 (Central Daylight Time)
 * Author = 97173348
 * FileBasename = CameraMovement.ts
 * FileBasenameNoExtension = CameraMovement
 * URL = db://assets/Scripts/CameraMovement.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('CameraMovement')
export class CameraMovement extends cc.Component {
    @property ({
        type: cc.Node,
        displayName: "PlayerNode",
    })
    player: cc.Node;
    private playerUITransform: cc.UITransform

    @property ({
        type: cc.CCFloat,
        displayName: "FollowSpeed"
    })
    speed: number = 5;

    private size: cc.Size;
    private map: cc.Node;

    onLoad() {
        this.playerUITransform = this.player.getComponent(cc.UITransform);
        let canvas = cc.find("Canvas");
        this.map = canvas.getChildByName("Map");
        this.size = canvas.getComponent(cc.UITransform).contentSize;
        // Instantly teleport to player's position (doesn't work)
        // let playerPosition = this.mapToCameraCoords(this.clamp(this.getTargetPosition()));
        // console.log(playerPosition);
        // this.node.setPosition(playerPosition);
    }


    // Transformation between the map and camera coordinate systems
    public mapToCameraCoords(position: Vec3): Vec3 {
        return new Vec3(position.x - this.size.width / 2, position.y - this.size.height / 2, position.z);
    }

    public cameraToMapCoords(position: Vec3): Vec3 {
        return new Vec3(position.x + this.size.width / 2, position.y + this.size.height / 2, position.z);
    }

    // Custom lerp function
    private static lerp(to: cc.Vec3, from: cc.Vec3, ratio: number) {
        let target = from.clone();
        target.x += ratio * (to.x - from.x);
        target.y += ratio * (to.y - from.y);
        return target;
    }

    // Make sure the position is within the bounds of the map
    // Uses map coordinates
    private clamp(position: Vec3): Vec3 {
        let mapSize = this.map.getComponent(cc.UITransform).contentSize
        let result = new Vec3(0, 0, position.z);
        result.x = cc.misc.clampf(position.x, this.size.width / 2, mapSize.width - this.size.width / 2);
        result.y = cc.misc.clampf(position.y, this.size.height / 2, mapSize.height - this.size.height / 2);
        return result;
    }

    // Get the position of the player in map coordinates
    private getTargetPosition() {
        let targetPosition = this.player.getPosition().clone();
        // find the center of the player
        targetPosition.x += this.playerUITransform.contentSize.width / 2;
        targetPosition.y += this.playerUITransform.contentSize.height / 2;
        return targetPosition;
    }

    update(deltaTime: number) {
        // make clones because we do not want to make change to the original value
        // Both are in map coordinates
        let targetPosition = this.getTargetPosition();
        let currentPosition = this.cameraToMapCoords(this.node.getPosition().clone());

        // make the camera move towards player's position at a ratio determined by dt
        // clamp AFTER the lerp to get better effect
        let nextPosition = this.clamp(CameraMovement.lerp(targetPosition, currentPosition, deltaTime * this.speed));

        // update the position
        this.node.setPosition(this.mapToCameraCoords(nextPosition));
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
