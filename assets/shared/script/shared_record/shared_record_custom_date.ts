import { _decorator, Button, Component, instantiate, isValid, Label, Node, Prefab, UITransform, Vec3 } from 'cc';
import { DateEx } from '../lib/DateEx';
import { SharedRecordCustomSelectList } from './shared_record_custom_select_list';
import { SelectDateType, SharedRecordEvent } from './shared_record';
const { ccclass, property } = _decorator;

// 自定义日期

interface CustomDate {
    year: number,
    month: number,
    day: number
}

const LAST_THREE_MONTHS = 3;
const SEARCH_WEEK = 6;

@ccclass('SharedRecordCustomDate')
export class SharedRecordCustomDate extends Component {

    @property({type:Button})
    btnStartYear:Button; // 开始年

    @property({type:Button})
    btnStartMonth:Button; // 开始月

    @property({type:Button})
    btnStartDay:Button; // 开始日

    @property({type:Button})
    btnEndYear:Button; // 结束年

    @property({type:Button})
    btnEndMonth:Button; // 结束月

    @property({type:Button})
    btnEndDay:Button; // 结束日

    @property({type:Label})
    lbStartYear:Label; // 开始年

    @property({type:Label})
    lbStartMonth:Label; // 开始月

    @property({type:Label})
    lbStartDay:Label; // 开始日

    @property({type:Label})
    lbEndYear:Label; // 结束年

    @property({type:Label})
    lbEndMonth:Label; // 结束月

    @property({type:Label})
    lbEndDay:Label; // 结束日

    @property({type:Node})
    ndSelectList:Node;

    @property({type:Prefab})
    recordCustomSelectList:Prefab;// 选择列表

    private selectList:SharedRecordCustomSelectList = null;
    private nowDate: CustomDate = null; // 当前时间
    private record:Node = null;

    protected onLoad(): void {
        let date = new Date();
        this.nowDate = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()}
    }

    start() {
        this.lbStartYear.string = `${this.nowDate.year}`;
        this.lbStartMonth.string = `${this.nowDate.month}`;
        this.lbStartDay.string = `${this.nowDate.day}`;

        this.lbEndYear.string = `${this.nowDate.year}`;
        this.lbEndMonth.string = `${this.nowDate.month}`;
        this.lbEndDay.string = `${this.nowDate.day}`;
    }

    setDate(record: Node){
        this.record = record;
    }

    private onBtnSuccess(){
        let startDate = this.getStartDate();
        let endDate = this.getEndDate();
        let startTimestamp = DateEx.getZeroTimestamp(startDate.year, startDate.month - 1, startDate.day);
        let endTimestamp = DateEx.getZeroTimestamp(endDate.year, endDate.month - 1, endDate.day);
        endTimestamp = endTimestamp + (3600 * 24 - 1) * 1000;
        this.node.destroy();
        this.record.emit(SharedRecordEvent.REQUEST_CUSTOM_DATE_RECORD, startTimestamp, endTimestamp, SelectDateType.CUSTOM)
    }

    private onBtnBack(){
        this.node.destroy();
    }

    private onBtnStartYear(){
        let startDate = this.getMonthsAgo();
        let szDate = [];
        for (let i=startDate.year; i<=this.nowDate.year; i++){
            szDate.push(i);
        }

        let {year} = this.getStartDate()
        this.getSelectList(this.btnStartYear.node, szDate, year, (selectData: number)=>{
            if (year == selectData){
                return 
            }

            this.lbStartYear.string = `${selectData}`

            if (this.nowDate.year > selectData) { // 选中去年，把月份更新成最近的
                this.lbStartMonth.string = `${12}`
            }

            this.updateEndTime(this.getStartDate());
        });
    }

    private onBtnStartMonth(){
        let startDate = this.getMonthsAgo();
        let szDate = []
        for (let i=0; i<=LAST_THREE_MONTHS; i++){
            szDate.push((startDate.month+i) % 12);
        }
        let {year, month} = this.getStartDate()
        this.getSelectList(this.btnStartMonth.node, szDate, month, (selectData: number)=>{
            if (month == selectData){
                return
            }

            this.lbStartMonth.string = `${selectData}`

            if (this.nowDate.month > selectData) {// 往直前的日期调整
                this.lbStartDay.string = `${DateEx.getMonthDay(year, selectData)}`;
            }else{
                // 调到本月，显示当天
                this.lbStartDay.string = `${this.nowDate.day}`;
            }
            
            this.updateEndTime(this.getStartDate());
        });
    }

    private onBtnStartDay(){
        let {year, month, day} = this.getStartDate()

        let monthDay:number
        let startDay = 1;
        if (year == this.nowDate.year && month == this.nowDate.month){
            monthDay = this.nowDate.day;
        }else{
            monthDay = DateEx.getMonthDay(year, month);
            let minCustomDate = this.getMonthsAgo();
            if (minCustomDate.year == year && minCustomDate.month == month){
                startDay = Math.max(startDay, minCustomDate.day);
            }
        }

        let szDate = []
        for (let i=startDay; i<=monthDay; i++){
            szDate.push(i);
        }

        this.getSelectList(this.btnStartDay.node, szDate, day, (selectData: number)=>{
            if (day == selectData){
                return 
            }

            this.lbStartDay.string = `${selectData}`
            this.updateEndTime(this.getStartDate());
        });
    }

    private onBtnEndYear(){
        let endDate = this.getMonthsAgo();
        let szDate = []
        for (let i=endDate.year; i<=this.nowDate.year; i++){
            szDate.push(i);
        }

        let {year} = this.getEndDate();
        this.getSelectList(this.btnEndYear.node, szDate, year, (selectData: number)=>{
            if (year == selectData){
                return 
            }

            this.lbEndYear.string = `${selectData}`

            if (this.nowDate.year > selectData) { // 选中去年，把月份更新成最近的
                this.lbEndMonth.string = `${12}`
            }

            this.updateStartTime(this.getEndDate());
        });
    }

    private onBtnEndMonth(){
        let endDate = this.getMonthsAgo();
        let szDate = []
        for (let i=0; i<=LAST_THREE_MONTHS; i++){
            szDate.push((endDate.month+i) % 12);
        }
        let {year, month} = this.getEndDate();
        this.getSelectList(this.btnEndMonth.node, szDate, month, (selectData: number)=>{
            if (month == selectData){
                return
            }

            this.lbEndMonth.string = `${selectData}`

            if (this.nowDate.month > selectData) {// 往直前的日期调整
                this.lbEndDay.string = `${DateEx.getMonthDay(year, selectData)}`;
            }else{
                // 调到本月，显示当天
                this.lbEndDay.string = `${this.nowDate.day}`;
            }
            
            this.updateStartTime(this.getEndDate());
        });
    }

    private onBtnEndDay(){
        let {year, month, day} = this.getEndDate()

        let monthDay:number
        let startDay = 1;
        if (year == this.nowDate.year && month == this.nowDate.month){
            monthDay = this.nowDate.day;
        }else{
            monthDay = DateEx.getMonthDay(year, month);
            let minCustomDate = this.getMonthsAgo();
            if (minCustomDate.year == year && minCustomDate.month == month){
                startDay = Math.max(startDay, minCustomDate.day);
            }
        }

        let szDate = []
        for (let i=startDay; i<=monthDay; i++){
            szDate.push(i);
        }
        this.getSelectList(this.btnEndDay.node, szDate, day, (selectData: number)=>{
            if (day == selectData){
                return 
            }

            this.lbEndDay.string = `${selectData}`
            this.updateStartTime(this.getEndDate());
        });
    }

    private getStartDate(){
        let year = Number(this.lbStartYear.getComponent(Label).string)
        let month = Number(this.lbStartMonth.getComponent(Label).string)
        let day = Number(this.lbStartDay.getComponent(Label).string)
        return {year, month, day};
    }

    private getEndDate(){
        let year = Number(this.lbEndYear.getComponent(Label).string)
        let month = Number(this.lbEndMonth.getComponent(Label).string)
        let day = Number(this.lbEndDay.getComponent(Label).string)
        return {year, month, day};
    }

    // 更新开始时间
    private updateStartTime(endTime:CustomDate){
        let endDateTimestamp = new Date(endTime.year, endTime.month - 1, endTime.day).getTime();
        let beginTimestamp = endDateTimestamp - (24*3600*SEARCH_WEEK*1000); // 一周前时间

        let minCustomDate = this.getMonthsAgo()
        let minDate = new Date(minCustomDate.year, minCustomDate.month-1, minCustomDate.day) // 允许搜索最早时间
        if (beginTimestamp < minDate.getTime()){
            beginTimestamp = minDate.getTime()
        }

        let {year, month, day} = this.getStartDate();
        let startTimestamp = new Date(year, month-1, day).getTime();
        if (startTimestamp >= beginTimestamp && startTimestamp <= endDateTimestamp){ // 允许搜索范围内
            return 
        }

        let beginDate = new Date(beginTimestamp);
        
        if (beginDate.getFullYear() != year){
            this.lbStartYear.string = `${beginDate.getFullYear()}`
        }

        if (beginDate.getMonth() + 1 != month){
            this.lbStartMonth.string = `${beginDate.getMonth() + 1}`
        }

        if (beginDate.getDate() != day){
            this.lbStartDay.string = `${beginDate.getDate()}`
        }
    }

    // 更新结束时间
    private updateEndTime(startTime:CustomDate){
        let startDateTimestamp = new Date(startTime.year, startTime.month-1, startTime.day).getTime();
        let endTimestamp = startDateTimestamp + (24*3600*(SEARCH_WEEK)*1000); // 一周后时间

        let maxDate = new Date(this.nowDate.year, this.nowDate.month - 1, this.nowDate.day) // 允许搜索不能超过当天
        if (endTimestamp > maxDate.getTime()){
            endTimestamp = maxDate.getTime()
        }

        let {year, month, day} = this.getEndDate();
        let currendTimestamp = new Date(year, month-1, day).getTime();
        if (currendTimestamp >= startDateTimestamp && currendTimestamp <= endTimestamp){ // 允许搜索范围内
            return 
        }

        let endDate = new Date(endTimestamp);
        
        if (endDate.getFullYear() != year){
            this.lbEndYear.string = `${endDate.getFullYear()}`
        }

        if (endDate.getMonth() + 1 != month){
            this.lbEndMonth.string = `${endDate.getMonth() + 1}`
        }

        if (endDate.getDate() != day){
            this.lbEndDay.string = `${endDate.getDate()}`
        }
    }

    // 获取前n个月
    private getMonthsAgo(){
        let beginDate = Object.assign({}, this.nowDate);
        
        let {year, month} = DateEx.getMonthsAgo(this.nowDate.year, this.nowDate.month - 1, LAST_THREE_MONTHS)
        beginDate.year = year;
        beginDate.month = month + 1;

        let day = DateEx.getMonthDay(year, month); // 获取本月几天
        beginDate.day = Math.min(beginDate.day, day);
        return beginDate;
    }

    private getSelectList(target:Node, szData:number[], currentDate: number, callback:(selectDate: number)=>void){
        if (!isValid(this.selectList)) {
            let nd = instantiate(this.recordCustomSelectList);
            nd.parent = this.ndSelectList;
            this.selectList = nd.getComponent(SharedRecordCustomSelectList);
        }

        if (this.selectList.getTarget() == target){
            this.selectList.destroySelf();
            return 
        }

        let uiTransform = target.getComponent(UITransform);
        let worldPos = uiTransform.convertToWorldSpaceAR(new Vec3(-0.5 * uiTransform.width, -0.5 * uiTransform.height));
        this.selectList.setPosition(worldPos);
        this.selectList.setTarget(target);
        this.selectList.setData(szData, currentDate);
        this.selectList.setCallback(callback);
    }

    // 点击空白关闭
    private onBtnCheckSelectList(){
        if (isValid(this.selectList)){
            this.selectList.destroySelf();
            this.selectList = null;
        }
    }
}


