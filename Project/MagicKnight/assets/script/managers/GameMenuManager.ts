
import * as cc from 'cc';
import { EventManager } from 'db://assets/script/events/EventManager';
import { LoadSceneEvent, LoadSceneEventType } from 'db://assets/script/events/LoadSceneEvent';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = GameMenuManager
 * DateTime = Fri Dec 03 2021 23:23:48 GMT-0600 (Central Standard Time)
 * Author = RaymondWHZ
 * FileBasename = GameMenuManager.ts
 * FileBasenameNoExtension = GameMenuManager
 * URL = db://assets/script/GameMenuManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('GameMenuManager')
export class GameMenuManager extends cc.Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    sceneBlackList = ["StartMenu"]

    hotkeys = [cc.KeyCode.ESCAPE, cc.KeyCode.KEY_E]

    @property({ type: cc.Prefab })
    public gameMenu: cc.Node | null = null
    
    @property({ type: cc.Prefab })
    public indicators: cc.Node | null = null

    @property({ type: cc.Prefab })
    public itemButton: cc.Node | null = null

    currentGameMenu: cc.Node | null = null

    start () {
        // [3]
        cc.game.addPersistRootNode(this.node)
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, e => this.onSceneLoad(e))
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, e => this.onKeyDown(e))
    }

    onLoad () {
    }

    onSceneLoad (event) {
        if (this.sceneBlackList.indexOf(cc.director.getScene().name) == -1) {
            const cameraNode = cc.find("Canvas/Camera")
            
            const indicator = cc.instantiate(this.indicators)
            cameraNode.addChild(indicator)

            const menu = cc.instantiate(this.gameMenu);

            menu.active = false

            const backpackArea = menu.getChildByName("BackpackArea")
            const list = [1, 2, 3, 4]
            let currentOffset = 0
            for (let item in list) {
                const ib = cc.instantiate(this.itemButton)
                ib.setPosition(0, currentOffset, 0)
                currentOffset -= 100
                backpackArea.addChild(ib)
            }

            const exitButton = menu.getChildByName("ExitButton")
            exitButton.on("click", () => {
                EventManager.instance.emit("LoadScene", new LoadSceneEvent(LoadSceneEventType.LOAD_SCENE, "StartMenu"))
            })

            cameraNode.addChild(menu)
            this.currentGameMenu = menu
        }
    }

    onKeyDown (event: cc.EventKeyboard) {
        if (this.hotkeys.indexOf(event.keyCode) != -1) {
            this.currentGameMenu.active = !this.currentGameMenu.active
        }
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
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
