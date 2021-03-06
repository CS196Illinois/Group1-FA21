import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = Utils
 * DateTime = Tue Dec 07 2021 18:07:29 GMT-0600 (Central Standard Time)
 * Author = cty012
 * FileBasename = Utils.ts
 * FileBasenameNoExtension = Utils
 * URL = db://assets/script/others/Utils.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

export class IdGenerator {
    private static nextId: number = 0;
    static generate(): number {
        return IdGenerator.nextId++;
    }
}

export class Padding extends cc.ValueType {
    public static ZERO: Readonly<Padding> = new Padding(0, 0, 0, 0);
    public left: number = 0;
    public right: number = 0;
    public top: number = 0;
    public bottom: number = 0;

    constructor(left: number, right: number, top: number, bottom: number) {
        super();
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }

    toString(): string { return `[left=${this.left}, right=${this.right}, top=${this.top}, bottom=${this.bottom}]`; }

    equals(other: Padding): boolean { return this.left == other.left && this.right == other.right && this.top == other.top && this.bottom == other.bottom; }

    clone(): Padding { return new Padding(this.left, this.right, this.top, this.bottom); }

    static splitSize(size: cc.Size): Padding {
        return new Padding(size.width / 2, size.width / 2, size.height / 2, size.height / 2);
    }

    combineSize(): cc.Size {
        return new cc.Size(this.left + this.right, this.top + this.bottom);
    }

    flipX() {
        let temp = this.left;
        this.left = this.right;
        this.right = temp;
    }

    flipY() {
        let temp = this.top;
        this.top = this.bottom;
        this.bottom = temp;
    }

    static flipX(padding: Padding) {
        return new Padding(padding.right, padding.left, padding.top, padding.bottom);
    }

    static flipY(padding: Padding) {
        return new Padding(padding.left, padding.right, padding.bottom, padding.top);
    }
}

// Only x and y directions are lerped
export function lerp2D(from: cc.Vec3, to: cc.Vec3, ratio: number): cc.Vec3 {
    let target = from.clone();
    target.x += ratio * (to.x - from.x);
    target.y += ratio * (to.y - from.y);
    return target;
}

export function getDirection(from: cc.Vec3, to: cc.Vec3): cc.Vec3{
    return new cc.Vec3(
        (from.x == to.x) ? 0 : ((from.x < to.x) ? 1 : -1),
        (from.y == to.y) ? 0 : ((from.y < to.y) ? 1 : -1),
        (from.z == to.z) ? 0 : ((from.z < to.z) ? 1 : -1)
    );
}

export function getUnitDirection(from: cc.Vec3, to: cc.Vec3): cc.Vec3 {
    let result: cc.Vec3 = cc.Vec3.subtract(new cc.Vec3(), from, to);
    result.z = 0;
    if (result.equals(cc.Vec3.ZERO)) return result;
    else return result.multiplyScalar(1 / result.length());
}

// Obtain the certain anchor point (default lowerleft corner) on an rectangular object
export function getPoint(obj: cc.Node, anchor: cc.Vec2 = cc.Vec2.ZERO): cc.Vec3 {
    let uiTransform = obj.getComponent(cc.UITransform);
    return new cc.Vec3(
        obj.position.x - uiTransform.width * (uiTransform.anchorX - anchor.x),
        obj.position.y - uiTransform.height * (uiTransform.anchorX - anchor.x),
        obj.position.z
    );
}

export function getCenter(obj: cc.Node): cc.Vec3 {
    return getPoint(obj, new cc.Vec2(0.5, 0.5));
}

export function getDistance(from: cc.Node, to: cc.Node): cc.Vec3 {
    return cc.Vec3.subtract(new cc.Vec3(), getPoint(to), getPoint(from));
}

export function getCenterDistance(from: cc.Node, to: cc.Node): cc.Vec3 {
    return cc.Vec3.subtract(new cc.Vec3(), getCenter(to), getCenter(from));
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
