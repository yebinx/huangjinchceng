import { _decorator, Component, Label, Node } from 'cc';
import { SharedConfig } from '../config/shared_config';
import { IRocordLineInfo } from './shared_record_interface';
const { ccclass, property } = _decorator;

@ccclass('SharedRecordWinLineInfo')
export class SharedRecordWinLineInfo extends Component {
    @property({type:Label})
    lbMath:Label;

    setData(data: IRocordLineInfo){
        // 投注大小 x 投注倍数 x 符号赔付值 x 中奖路 x 奖金倍数
        this.lbMath.string = `${SharedConfig.ScoreFormat(data.betSize)} x ${data.betMultiple} x ${data.rate} x ${data.rewardLine} x ${data.rewardMultiple}`
    }
}


