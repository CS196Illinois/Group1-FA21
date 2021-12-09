import * as cc from 'cc';
import * as utils from 'db://assets/script/others/Utils';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = MapController
 * DateTime = Tue Dec 07 2021 18:58:02 GMT-0600 (Central Standard Time)
 * Author = cty012
 * FileBasename = MapController.ts
 * FileBasenameNoExtension = MapController
 * URL = db://assets/script/controllers/MapController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('MapController')
export class MapController extends cc.Component {
    public getSize(): cc.Size {
        return this.getComponent(cc.UITransform).contentSize.clone();
    }

    public inRange(position: cc.Vec3, padding: utils.Padding = utils.Padding.ZERO): boolean {
        return position.equals(this.clamp(position, padding));
    }

    public clamp(position: cc.Vec3, padding: utils.Padding = utils.Padding.ZERO): cc.Vec3 {
        let mapSize = this.getSize();
        let result = new cc.Vec3(0, 0, position.z);
        result.x = cc.misc.clampf(position.x, padding.left, mapSize.width - padding.right);
        result.y = cc.misc.clampf(position.y, padding.top, mapSize.height - padding.bottom);
        return result;
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
