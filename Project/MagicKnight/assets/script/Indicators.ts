
import { _decorator, Component, Node, Prefab, UITransform, math, UITransformComponent } from 'cc';
import { EventManager } from './events/EventManager';
import { HPChangeEvent } from './events/HPChangeEvent';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Indicators
 * DateTime = Sat Dec 04 2021 20:13:08 GMT-0600 (Central Standard Time)
 * Author = RaymondWHZ
 * FileBasename = Indicators.ts
 * FileBasenameNoExtension = Indicators
 * URL = db://assets/script/Indicators.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

// class indicatorControl {
//     uiComponent: UITransformComponent
//     size: math.Size
//     constructor(indicatorNode: Node) {
//         this.size = indicatorNode.getComponent
//     }
// }

class IndicatorController {

    indicator: Node
    uiComponent: UITransformComponent
    originalSize: math.Size

    constructor(indicator: Node) {
        this.indicator = indicator
        this.uiComponent = this.indicator.getComponent(UITransformComponent)
        this.originalSize = this.uiComponent.contentSize.clone()
    }

    updateValue(value: number) {
        const newX = this.originalSize.x * value / 100
        const oldY = this.originalSize.y
        this.uiComponent.setContentSize(new math.Size(newX, oldY))
    }
}

@ccclass('Indicators')
export class Indicators extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    private hpIndicator: IndicatorController
    private mpIndicator: IndicatorController

    private count = 0
    
    private onHpChangeEventId = 0

    start () {
        this.hpIndicator = new IndicatorController(this.node.getChildByName("HPIndicator"))
        this.mpIndicator = new IndicatorController(this.node.getChildByName("MPIndicator"))

        this.onHpChangeEventId = EventManager.instance.on("hp-change", (event: HPChangeEvent) => this.hpIndicator.updateValue(event.hp))
    }

    onDestroy () {
        EventManager.instance.off("hp-change", this.onHpChangeEventId)
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
