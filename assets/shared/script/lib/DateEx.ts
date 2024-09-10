export class DateEx{
    // 获取当月几天, month=[1~12]
    static getMonthDay(year: number, month: number):number{
        return new Date(year, month, 0).getDate()
    }

    static getMonthsAgo(beginYear: number, beginMonth: number, monthsAgo: number){
        let month = beginMonth + 1 - monthsAgo;
        let year = beginYear;
        if (month <= 0){
            year -= 1;
            month += 12;
        }
        month -= 1
        return {year, month}
    }

    // 获取零点时间戳，毫秒
    static getZeroTimestamp(year: number, month:number, day: number): number{
        let data = new Date(year, month, day);
        return data.getTime()
    }

    // 获取零点时间戳，秒
    static getZeroTimestampSecond(year: number, month:number, day: number): number{
        return this.getZeroTimestamp(year, month, day) / 1000
    }

    // 获取当日零点
    static getTodayZero(){
        let date = new Date();
        return this.getZeroTimestamp(date.getFullYear(), date.getMonth(), date.getDate());
    }
    
}


