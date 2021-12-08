import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = DataCenter
 * DateTime = Mon Oct 18 2021 18:15:32 GMT-0500 (Central Daylight Time)
 * Author = RaymondWHZ
 * FileBasename = DataCenter.ts
 * FileBasenameNoExtension = DataCenter
 * URL = db://assets/Scripts/DataCenter.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

interface SlotInfo {
    number: number
    used: boolean
}

const SLOT_STORAGE_PREFIX = "game_data_slot_"

const MIN_SLOT_NUMBER = 1
const MAX_SLOT_NUMBER = 3

let currentSlotNumber = 1
let currentSlotData: { [key: string]: any } = {}

function getSlot(slotNumber: number): null | string {
    return cc.sys.localStorage.getItem(SLOT_STORAGE_PREFIX + slotNumber)
}

function setSlot(slotNumber: number, data: string) {
    cc.sys.localStorage.setItem(SLOT_STORAGE_PREFIX + slotNumber, data)
}

function clearSlot(slotNumber: number) {
    cc.sys.localStorage.removeItem(SLOT_STORAGE_PREFIX + slotNumber)
}

export const DataCenter = {

    getSlotsInfo (): SlotInfo[] {
        const infoList: SlotInfo[] = []
        for (let i = MIN_SLOT_NUMBER; i <= MAX_SLOT_NUMBER; i++) {
            const slot = getSlot(i)
            if (slot == null) {
                infoList.push({
                    number: i,
                    used: false
                })
            } else {
                infoList.push({
                    number: i,
                    used: true
                })
            }
        }
        return infoList
    },

    deleteSlot (slotNumber: number) {
        clearSlot(slotNumber)
    },

    setUseSlot (slotNumber: number) {
        currentSlotNumber = slotNumber

        const slot = getSlot(slotNumber)
        if (slot == null) {
            currentSlotData = {}
        } else {
            currentSlotData = JSON.parse(slot)
        }
        this.saveToDisk()
    },

    getGameData (key: string): any {
        return currentSlotData[key]
    },

    setGameData (key: string, data: any) {
        currentSlotData[key] = data
    },

    saveToDisk () {
        setSlot(currentSlotNumber, JSON.stringify(currentSlotData))
    },
}
