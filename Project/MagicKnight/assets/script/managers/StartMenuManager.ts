
import * as cc from 'cc';
import { DataCenter } from 'db://assets/script/managers/DataCenter';
import { EventManager } from 'db://assets/script/events/EventManager';
import { LoadSceneEvent, LoadSceneEventType } from 'db://assets/script/events/LoadSceneEvent';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = StartMenuManager
 * DateTime = Mon Oct 18 2021 17:27:39 GMT-0500 (Central Daylight Time)
 * Author = RaymondWHZ
 * FileBasename = StartMenuManager.ts
 * FileBasenameNoExtension = StartMenuManager
 * URL = db://assets/Scripts/StartMenuManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

interface MenuItem {
    label: string
    type?: "button" | "used-slot" | "new-slot"
    callback?: () => void
}

function createNewGameMenu(): MenuItem[] {
    const newGameMenu: MenuItem[] = DataCenter.getSlotsInfo().map(info => ({
        label: (info.used ? "Used Slot " : "New Slot ") + info.number,
        type: info.used ? "used-slot" : "new-slot",
        callback: () => {
            DataCenter.setUseSlot(info.number)
            EventManager.instance.emit("LoadScene", new LoadSceneEvent(LoadSceneEventType.LOAD_GAME_SCENE, "Scene1"))
        }
    }))
    return newGameMenu
}
 
@ccclass('StartMenuManager')
export class StartMenuManager extends cc.Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({type: cc.Node})
    public buttonArea: cc.Node | null = null

    @property({ type: cc.Prefab })
    public buttonPrefab: cc.Node | null = null

    @property({ type: cc.Prefab })
    public newSlotPrefab: cc.Node | null = null

    @property({ type: cc.Prefab })
    public usedSlotPrefab: cc.Node | null = null

    buttonSpace: number = 70

    mainMenu: MenuItem[] = [
        {
            label: "New Game",
            callback: () => {
                const menu = createNewGameMenu()
                menu.push({
                    label: "Back",
                    callback: () => {
                        this.switchMenu(this.mainMenu)
                    }
                })
                this.switchMenu(menu)
            }
        },
        {
            label: "Continue",
            callback: () => {
                const menu = createNewGameMenu()
                menu.push({
                    label: "Back",
                    callback: () => {
                        this.switchMenu(this.mainMenu)
                    }
                })
                this.switchMenu(menu)
            }
        },
        {
            label: "Settings",
        },
        {
            label: "Exit"
        },
    ]

    start () {
        this.switchMenu(this.mainMenu)
    }

    switchMenu (menu: MenuItem[]) {
        // remove previous rendered nodes
        this.buttonArea?.removeAllChildren()

        let currentOffset = 0
        for (let i = 0; i < menu.length; i++) {
            // get list item data
            const item = menu[i];

            if (item.type == "new-slot") {
                // add button from prefab and adjust position
                const button = cc.instantiate(this.newSlotPrefab);
                this.buttonArea?.addChild(button);
                button.setPosition(0, currentOffset, 0)
                currentOffset -= 120
                
                // set button label
                const label = button.getComponentInChildren(cc.Label);
                label.string = item.label

                button.on("click", item.callback)
            } else if (item.type == "used-slot") {
                // add button from prefab and adjust position
                const button = cc.instantiate(this.usedSlotPrefab);
                this.buttonArea?.addChild(button);
                button.setPosition(0, currentOffset, 0)
                currentOffset -= 120
                
                // set button label
                const label = button.getComponentInChildren(cc.Label);
                label.string = item.label

                button.on("click", item.callback)
            } else {
                // add button from prefab and adjust position
                const button = cc.instantiate(this.buttonPrefab);
                this.buttonArea?.addChild(button);
                button.setPosition(0, currentOffset, 0)
                currentOffset -= 70

                // set button label
                const label = button.getComponentInChildren(cc.Label);
                label.string = item.label

                // set button callback
                button.on("click", item.callback)
            }
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
