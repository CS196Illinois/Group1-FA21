
import { _decorator, Component, Node, game, Prefab, director, Director, KeyCode, find, instantiate, systemEvent, SystemEvent, EventKeyboard, Button } from 'cc';
import { EventManager } from './events/EventManager';
import { LoadSceneEvent, LoadSceneEventType } from './events/LoadSceneEvent';
const { ccclass, property } = _decorator;

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
export class GameMenuManager extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    sceneBlackList = ["StartMenu"]

    hotkeys = [KeyCode.ESCAPE, KeyCode.KEY_E]

    @property({ type: Prefab })
    public gameMenu: Node | null = null
    
    @property({ type: Prefab })
    public indicators: Node | null = null

    @property({ type: Prefab })
    public itemButton: Node | null = null

    currentGameMenu: Node | null = null

    start () {
        // [3]
        game.addPersistRootNode(this.node)
        director.on(Director.EVENT_AFTER_SCENE_LAUNCH, e => this.onSceneLoad(e))
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, e => this.onKeyDown(e))
    }

    onLoad () {
    }

    onSceneLoad (event) {
        if (this.sceneBlackList.indexOf(director.getScene().name) == -1) {
            const cameraNode = find("Canvas/Camera")
            
            const indicator = instantiate(this.indicators)
            cameraNode.addChild(indicator)

            const menu = instantiate(this.gameMenu);

            menu.active = false

            const backpackArea = menu.getChildByName("BackpackArea")
            const list = [1, 2, 3, 4]
            let currentOffset = 0
            for (let item in list) {
                const ib = instantiate(this.itemButton)
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

    onKeyDown (event: EventKeyboard) {
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
