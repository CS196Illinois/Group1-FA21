
import * as cc from 'cc';
//import { _decorator, Component, Node, CCObject } from 'cc';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = CameraMovement
 * DateTime = Mon Oct 18 2021 00:37:32 GMT-0500 (Central Daylight Time)
 * Author = 97173348
 * FileBasename = Camera Movement.ts
 * FileBasenameNoExtension = Camera Movement
 * URL = db://assets/Scripts/Camera Movement.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('CameraMovement')
export class CameraMovement extends cc.Component {
    @property (cc.Node)
    Player_Node: cc.Node;
    
    // static lerp<Out extends cc.IVec3Like> (out: Out, a: Out, b: Out, t: number) {
    //     out.x = a.x + t * (b.x - a.x);
    //     out.y = a.y + t * (b.y - a.y);
    //     out.z = a.z + t * (b.z - a.z);
    //     return out;
    // } 
    
    static lerp (to: cc.Vec3, ratio: number, here: cc.Vec3) {
        here.x += ratio * (to.x - here.x);
        here.y += ratio * (to.y - here.y);
        //here.z += ratio * (to.z - here.z);
        return here;
    }

    update (dt) {
        
        let target_position = this.Player_Node.getPosition();
        //set the vertical range of camera
        target_position.y = cc.misc.clampf(target_position.y,0,100);
        //set the horizontal range of camera
        target_position.x = cc.misc.clampf(target_position.x, -1000 , 1000);
        let current_position = this.node.getPosition();
        let target = target_position;
        let current = current_position;
        
        cc.log(current);
        
        //make the camera move towards player's position at a ratio 0.03
        if (target != current) {
            this.node.setPosition(CameraMovement.lerp( target , 0.1 , current ));
        }
        
        //current_position.y = cc.misc.clampf(target_position.y,0,100);
        
        // let w_pos = this.Player_Node.convertToWorldSpaceAR(cc.v2(0, 0));
        // let c_pos = this.node.parent.convertToNodeSpaceAR(w_pos);
        // this.node.position = c_pos;// c_pos;
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
