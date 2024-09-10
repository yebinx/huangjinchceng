import { _decorator, Component, Label, Node } from 'cc';
import { DateEx } from '../lib/DateEx';
import { SelectDateType, SharedRecordEvent } from './shared_record';
import { SharedConfig } from '../config/shared_config';
const { ccclass, property } = _decorator;

@ccclass('SharedRecordDateType')
export class SharedRecordDateType extends Component {
    @property({type:[Label]})
    szDate:Label[] = [];

    private record: Node = null;

    setDate(record: Node, currentSelectData: number){
        this.record = record;
        this.szDate[currentSelectData].color = SharedConfig.THEME_COLOR.clone();
    }

    onBtnBack(){
        this.node.destroy()
    }

    // 今天
    onBtnToday(){
        let startTimestamp = DateEx.getTodayZero();
        let endTimestamp = startTimestamp + (3600 * 24 - 1) * 1000;
        this.node.destroy();
        this.record.emit(SharedRecordEvent.REQUEST_CUSTOM_DATE_RECORD, startTimestamp, endTimestamp, SelectDateType.TODAY)
    }

    // 最近7天
    onBtnLastWeek(){
        let todayZero = DateEx.getTodayZero();
        let endTimestamp = todayZero + (3600 * 24 - 1) * 1000;
        let startTimestamp = todayZero - (6 * 3600 * 24) * 1000;
        this.node.destroy();
        this.record.emit(SharedRecordEvent.REQUEST_CUSTOM_DATE_RECORD, startTimestamp, endTimestamp, SelectDateType.LAST_WEEK)
    }

    // 自定义日期
    onBtnCustom(){
        this.node.destroy()
        this.record.emit(SharedRecordEvent.OPEN_RECORD_CUSTOM_DATE);
    }
}


