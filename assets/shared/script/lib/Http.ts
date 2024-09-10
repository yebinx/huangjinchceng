enum ReadStatusType  {
    UNSENT = 0, // 代理被创建，但尚未调用 open() 方法。
    OPENED = 1, //open() 方法已经被调用。
    HEADERS_RECEIVED = 2,   //send() 方法已经被调用，并且头部和状态已经可获得。
    LOADING = 3,    // 下载中； responseText 属性已经包含部分数据。
    DONE = 4,   // 下载操作已完成。
}

export default class Http {
    static isRequestSuccess(xhr: XMLHttpRequest){ return (Http.isRequestDone(xhr) && (xhr.status >= 200 && xhr.status < 400)); }
    static isRequestDone(xhr: XMLHttpRequest){ return (xhr.readyState == ReadStatusType.DONE); }
    static isRequestNetFail(xhr: XMLHttpRequest){ return xhr.status == 0; }
    static isRequestError(xhr: XMLHttpRequest){ return !!xhr["__error"]; }
    static isRequestTimeOut(xhr: XMLHttpRequest){ return !!xhr["__timeout"]; }

    static Post(url:string, data:string, callback: (xhr: XMLHttpRequest, responseData:any)=> void, timeout ?:number){
        // console.log("http post request: " + url)

        let reqDate = new Date()
        let isCallbackFinish = false;
        let cb = (xhr: XMLHttpRequest, responseData:any)=>{
            if (isCallbackFinish){
                console.warn(`more callback ${url}`)
                return 
            }

            isCallbackFinish = true;
            console.log(`http post request: ${url}`, responseData, reqDate.getTime(), new Date().getTime())

            if (callback){
                callback(xhr, responseData);
            }
        }

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = ()=>{ // 当 readyState 属性发生变化时
            if (Http.isRequestSuccess(xhr)) {
                let response = xhr.response;
                cb(xhr, response)
            } else {
                if (Http.isRequestDone(xhr)){
                    console.warn(`http post request: ${url}   onDone. but not success. status=${xhr.status} readyState=${xhr.readyState}`)//logflg
                    cb(xhr, null);
                }
            }
        }

        xhr.onerror = function () {
            console.warn(`http post request: ${url}  onerror`)//logflg
            xhr["__error"] = true;
        };

        xhr.ontimeout = function() {
            console.warn(`http post request: ${url}  ontimeout`)//logflg
            xhr["__timeout"] = true;
        }

        if (!timeout)
            timeout = 10 * 1000

        xhr.timeout = timeout
        xhr.responseType = "json"
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Content-Type", "application/json");
        // xhr.setRequestHeader("Content-Type", "raw");
        xhr.send(data);
    }

    // static Get(url:string, data:string, callback: (bOk: boolean, response:any)=> void, timeout ?:number){
    //     let xhr = new XMLHttpRequest();
    //     xhr.onreadystatechange = ()=>{ // 当 readyState 属性发生变化时
    //         if (Http.isRequestSuccess(xhr)) {
    //             var response = xhr.response;
    //             console.log("http get request: " + url, response)
    //             if (callback)
    //                 callback(true, response)
    //         } else {
    //             if (callback && xhr.readyState > ReadStatusType.HEADERS_RECEIVED)
    //                 callback(false, xhr.status);
    //         }
    //     }

    //     xhr.onerror = function () {
    //         if (callback)
    //             callback(false, null);
    //     };

    //     xhr.ontimeout = function() {
    //         callback(false, xhr.status);
    //     }

    //     if (timeout)
    //         xhr.timeout = timeout

    //     xhr.responseType = "json"
    //     let urlGet = url
    //     if (data && data.length > 0)
    //         urlGet = url + "?" + data

    //     xhr.open("GET", urlGet, true);
    //     xhr.send();
    // }

  
}

window["Http"] = Http;