
import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

import * as e from './EventManager';

/**
 * Predefined variables
 * Name = LoadSceneEvent
 * DateTime = Sun Oct 24 2021 20:09:35 GMT-0500 (Central Daylight Time)
 * Author = cty012
 * FileBasename = LoadSceneEvent.ts
 * FileBasenameNoExtension = LoadSceneEvent
 * URL = db://assets/Scripts/Events/LoadSceneEvent.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

// LoadSceneEvent is for loading or preloading a scene
export class LoadSceneEvent extends e.BaseEvent {
    // self defined properties
    private _scene: string;
    public get scene(): string { return this._scene; }

    constructor(type: LoadSceneEventType, scene: string) {
        // name is a property of BaseEvent
        super(type);
        this._scene = scene;
    }
}

export enum LoadSceneEventType {
    LOAD_SCENE = "load-scene",
    PRELOAD_SCENE = "preload-scene",
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
