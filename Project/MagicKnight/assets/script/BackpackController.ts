
import * as cc from 'cc';
import { Item, ItemType } from './Item';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = Backpack
 * DateTime = Sat Dec 04 2021 12:47:34 GMT-0600 (Central Standard Time)
 * Author = cty012
 * FileBasename = Backpack.ts
 * FileBasenameNoExtension = Backpack
 * URL = db://assets/script/Backpack.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('Backpack')
export class Backpack {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    private consumables: Map<string, { item: Item, count: number }>;
    private nonconsumables: Map<string, { item: Item, count: number }>;
    private weapons: Array<Item>;

    onLoad() {
        this.consumables = new Map<string, { item: Item, count: number }>();
    }

    // Load and save items from data center
    loadItems() {
        // TODO
    }

    saveItems() {
        // TODO
    }

    // Check if has the item
    // For weapons, the exact object must be used. Consumables and nonconsumables just need a copy of the target item.
    hasItem(item: Item) {
        switch (item.type) {
            case ItemType.CONSUMABLE:
                return this.consumables.has(item.name);
            case ItemType.NONCONSUMABLE:
                return this.nonconsumables.has(item.name);
            case ItemType.WEAPON:
                return this.weapons.indexOf(item) > -1;
        }
    }

    // Add an item to the backpack
    addItem(item: Item) {
        switch (item.type) {
            case ItemType.CONSUMABLE:
                if (this.consumables.has(item.name)) {
                    this.consumables[item.name].count++;
                } else {
                    this.consumables[item.name] = { item: item.clone(), count: 1 };
                }
                break;
            case ItemType.NONCONSUMABLE:
                if (this.nonconsumables.has(item.name)) {
                    this.nonconsumables[item.name].count++;
                } else {
                    this.nonconsumables[item.name] = { item: item.clone(), count: 1 };
                }
                break;
            case ItemType.WEAPON:
                this.weapons.push(item);
                break;
        }
        this.saveItems();
    }

    // Remove item from backpack. Weapons need to be the exact object while other things can be a copy.
    removeItem(item: Item): void {
        switch (item.type) {
            case ItemType.CONSUMABLE:
                if (this.consumables.has(item.name) && --this.consumables[item.name].count == 0) {
                    this.consumables.delete(item.name);
                }
                break;
            case ItemType.NONCONSUMABLE:
                if (this.nonconsumables.has(item.name) && --this.nonconsumables[item.name].count == 0) {
                    this.nonconsumables.delete(item.name);
                }
                break;
            case ItemType.WEAPON:
                let index = this.weapons.indexOf(item)
                if (index > -1) {
                    this.weapons.splice(index, 1);
                }
                break;
        }
        this.saveItems();
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
