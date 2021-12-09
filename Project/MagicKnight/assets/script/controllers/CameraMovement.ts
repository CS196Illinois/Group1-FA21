import * as cc from 'cc';
import * as utils from 'db://assets/script/others/Utils';
import { MapController } from 'db://assets/script/controllers/MapController';
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
    private map: cc.Node;
    private target: cc.Node;
    private size: cc.Size;
    public speed: number;

    onLoad() {
        let canvas = cc.find("Canvas");
        this.map = canvas.getChildByName("Map");
        this.target = this.map.getChildByName("Player");
        this.size = canvas.getComponent(cc.UITransform).contentSize;
        this.speed = 5;
    }

    start() {
        // Instantly teleport to player's position (doesn't work)
        let playerPosition = this.mapToCameraCoords(this.map.getComponent(MapController).clamp(
            this.getTargetPosition(),
            utils.Padding.splitSize(this.size)
        ));
        playerPosition.z = this.node.getPosition().z;
        this.node.setPosition(playerPosition);
    }

    // Transformation between the map and camera coordinate systems
    public mapToCameraCoords(position: cc.Vec3): cc.Vec3 {
        return new cc.Vec3(position.x - this.size.width / 2, position.y - this.size.height / 2, position.z);
    }

    public cameraToMapCoords(position: cc.Vec3): cc.Vec3 {
        return new cc.Vec3(position.x + this.size.width / 2, position.y + this.size.height / 2, position.z);
    }

    // Get the position of the player in map coordinates
    private getTargetPosition() {
        let targetPosition = this.target.getPosition().clone();
        // find the center of the player
        let targetSize = this.target.getComponent(cc.UITransform).contentSize;
        targetPosition.x += targetSize.width / 2;
        targetPosition.y += targetSize.height / 2;
        return targetPosition;
    }

    update(deltaTime: number) {
        // make clones because we do not want to make change to the original value
        // Both are in map coordinates
        let targetPosition = this.getTargetPosition();
        let currentPosition = this.cameraToMapCoords(this.node.getPosition().clone());

        // make the camera move towards player's position at a ratio determined by dt
        // clamp AFTER the lerp to get better effect
        let nextPosition = this.map.getComponent(MapController).clamp(
            utils.lerp2D(currentPosition, targetPosition, deltaTime * this.speed),
            utils.Padding.splitSize(this.size)
        );

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
