
import * as cc from 'cc';
import * as utils from 'db://assets/script/others/Utils';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = SpriteController
 * DateTime = Thu Dec 09 2021 00:54:54 GMT-0600 (Central Standard Time)
 * Author = cty012
 * FileBasename = SpriteController.ts
 * FileBasenameNoExtension = SpriteController
 * URL = db://assets/script/controllers/SpriteController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('SpriteController')
export class SpriteController extends cc.Component {
    public uiTransform: cc.UITransform;
    public parentUITransform: cc.UITransform;

    private _size: cc.Size;
    public get size(): cc.Size { return this._size; }
    public set size(value: cc.Size) {
        this._size = value.clone();
        // keep bottom left corner the same while expand toward top right
        this._padding.right = this.parentUITransform.width - this._padding.left - this._size.width;
        this._padding.top = this.parentUITransform.height - this._padding.bottom - this._size.height;
    }

    private _padding: utils.Padding;
    public get padding(): Readonly<utils.Padding> { return this._padding; }
    public set padding(value: utils.Padding) {
        this._padding = value.clone();
        // calculate new size from given padding and parent size
        this._size.width = this.parentUITransform.width - this._padding.left - this._padding.right;
        this._size.height = this.parentUITransform.height - this._padding.top - this._padding.bottom;
    }

    private _flipX: boolean = false;
    public get flipX(): boolean { return this._flipX; }
    public set flipX(value: boolean) { this._flipX = value; }

    private _flipY: boolean = false;
    public get flipY(): boolean { return this._flipY; }
    public set flipY(value: boolean) { this._flipY = value; }

    onLoad() {
        this.uiTransform = this.getComponent(cc.UITransform);
        this.parentUITransform = this.node.parent.getComponent(cc.UITransform);
        this._padding = utils.Padding.ZERO.clone();
        this._size = this.parentUITransform.contentSize.clone();
        this.flipX = false;
        this.flipY = false;
        this.apply();
    }

    // Apply changes
    public apply() {
        // calculate new position and size
        let position: cc.Vec3 = new cc.Vec3(this.padding.left, this.padding.bottom, this.node.parent.position.z);
        let size: cc.Size = this.size.clone();
        // check if flipped
        if (this.flipX) {
            position.x += size.width;
            size.width *= -1;
        }
        if (this.flipY) {
            position.y += size.height;
            size.height *= -1;
        }
        // apply new values
        this.node.position = position;
        this.uiTransform.contentSize = size;
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
