
import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

import { LoadSceneEvent, LoadSceneEventType } from './events/LoadSceneEvent';
import * as e from './events/EventManager';

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
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        e.EventManager.instance.on("LoadScene", this.loadScene);
    }

    loadScene(event: LoadSceneEvent) {
        // event type can be either load scene or preload scene
        switch (event.type) {
            case LoadSceneEventType.LOAD_SCENE:
                console.log("Loading Scene: " + event.scene);
                cc.director.loadScene(event.scene);
                break;
            case LoadSceneEventType.PRELOAD_SCENE:
                console.log("Preloading Scene: " + event.scene);
                cc.director.preloadScene(event.scene);
                break;
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
