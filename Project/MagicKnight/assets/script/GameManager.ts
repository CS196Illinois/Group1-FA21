
import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

import { LoadSceneEvent, LoadSceneEventType } from './events/LoadSceneEvent';
import * as e from './events/EventManager';
import { DataCenter } from './DataCenter';
import { PlayerController } from './PlayerController';
import { SlimeScript } from './SlimeScript';
import { SoldierScript } from './SoldierScript';

/**
 * Predefined variables
 * Name = GameManager
 * DateTime = Wed Sep 22 2021 20:52:48 GMT-0500 (Central Daylight Time)
 * Author = cty012
 * FileBasename = GameManager.ts
 * FileBasenameNoExtension = GameManager
 * URL = db://assets/Scripts/GameManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('GameManager')
export class GameManager extends cc.Component {
    @property({ type: cc.SpriteFrame })
    public terrainSpriteFrame: cc.SpriteFrame;
    @property({ type: cc.SpriteFrame })
    public mapSpriteFrame: cc.SpriteFrame;

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        e.EventManager.instance.on("LoadScene", (event: LoadSceneEvent) => { this.loadScene(event) });
    }

    loadScene(event: LoadSceneEvent) {
        // event type can be either load scene or preload scene
        switch (event.type) {
            case LoadSceneEventType.LOAD_SCENE:
                console.log("Loading Scene: " + event.scene);
                cc.director.loadScene(event.scene);
                break;
            case LoadSceneEventType.LOAD_GAME_SCENE:
                console.log("Loading Game Scene: " + event.scene);
                cc.director.loadScene(event.scene, () => this.setupGameScene());
                DataCenter.setGameData("scene", event.scene);
                break;
            case LoadSceneEventType.PRELOAD_SCENE:
                console.log("Preloading Scene: " + event.scene);
                cc.director.preloadScene(event.scene);
                break;
        }
    }

    // This function will be called if the scene is a game scene
    // It adds necessary components to existing nodes based on their names and positions
    setupGameScene() {
        let map = cc.find("Canvas/Map");
        let player = map.getChildByName("Player");
        let terrain = map.getChildByName("Terrain");
        let enemy = map.getChildByName("Enemy");
        let npc = map.getChildByName("NPC");
        let slime = enemy.getChildByName("Slime");
        let soldier = enemy.getChildByName("Soldier");

        // common configurations
        [player].concat(terrain.children, soldier.children, slime.children, npc.children).forEach(node => {
            // RigidBody2D
            let rigidBody = node.addComponent(cc.RigidBody2D);
            rigidBody.enabledContactListener = true;
            rigidBody.type = cc.ERigidBody2DType.Dynamic;
            rigidBody.gravityScale = 10;
            rigidBody.fixedRotation = true;
            // BoxCollider2D
            let boxCollider = node.addComponent(cc.BoxCollider2D);
            let size = node.getComponent(cc.UITransform).contentSize;
            boxCollider.friction = 0;
            boxCollider.size = size.clone();
            boxCollider.offset = new cc.Vec2(size.width / 2, size.height / 2);
            // apply all changes (cocos does not say this in the documentation, wasting me 2 hours debugging)
            boxCollider.apply();
        });

        // specific configurations for player
        player.addComponent(PlayerController);
        // let playerSprite = player.getComponent(cc.Sprite);
        // playerSprite.type = cc.Sprite.Type.TILED;
        // playerSprite.spriteFrame = this.playerSpriteFrame;

        // specific configurations for terrain
        terrain.children.forEach(node => {
            // customize rigidBody
            let rigidBody = node.getComponent(cc.RigidBody2D);
            rigidBody.type = cc.ERigidBody2DType.Static;
            rigidBody.gravityScale = 0;
            // image
            let terrainSprite = node.getComponent(cc.Sprite);
            terrainSprite.type = cc.Sprite.Type.TILED;
            terrainSprite.spriteFrame = this.terrainSpriteFrame;
        });

        // specific configurations for characters
        slime.children.forEach(node => {
            node.addComponent(SlimeScript);
        });

        soldier.children.forEach(node => {
            node.addComponent(SoldierScript);
        });

        // specific configurations for npc
        npc.children.forEach(node => {});

        // map configurations
        // let mapSprite = map.getComponent(cc.Sprite);
        // mapSprite.type = cc.Sprite.Type.TILED;
        // mapSprite.spriteFrame = this.mapSpriteFrame;
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
