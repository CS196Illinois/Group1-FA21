
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Item
 * DateTime = Sat Dec 04 2021 12:49:09 GMT-0600 (Central Standard Time)
 * Author = cty012
 * FileBasename = Item.ts
 * FileBasenameNoExtension = Item
 * URL = db://assets/script/Item.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('Item')
export class Item {
    public name: string;
    private _type: ItemType;
    public get type(): ItemType { return this._type; }
    private set type(value: ItemType) { this._type = value; }
    public description: string;

    constructor (type: ItemType, name: string, description: string = "") {
        this.type = type;
        this.name = name;
        this.description = description;
    }

    equals(other: Item): boolean {
        return this.type == other.type && this.name == other.name
    }

    public clone(): Item {
        return new Item(this.type, this.name, this.description);
    }
}

export class Weapon extends Item {
    public prefab: string;

    constructor (name: string, prefab: string, description: string = "") {
        super(ItemType.WEAPON, name, description);
        this.prefab = prefab;
    }
}

export enum ItemType {
    CONSUMABLE = "consumable",
    NONCONSUMABLE = "nonconsumable",
    WEAPON = "weapon"
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
