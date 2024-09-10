
export class RandomEx  {
    // [startInteger，endInteger)
    // 包含 startInteger， 不包含 endInteger
    static getRandomValue(startInteger: number, endInteger: number, maxInteger: number){
        let v = Math.floor(Math.random() * maxInteger);
        return  (v % (endInteger - startInteger)) + startInteger;
    }
}


