/**
 *
 */
export function BYTE(value = 0) {
    value = typeof value !== 'undefined' ? value : 0;
    this.value = value;
}
BYTE.prototype.size = 1;

export function WORD(value = 0) {
    value = typeof value !== 'undefined' ? value : 0;
    this.value = value;
}
WORD.prototype.size = 2;

export function DWORD(value = 0) {
    value = typeof value !== 'undefined' ? value : 0;
    this.value = value;
}
DWORD.prototype.size = 4;

export function LONGLONG(value = 0) {
    value = typeof value !== 'undefined' ? value : 0;
    if(!this){
        console.log("sssss");
    }
    this.value = value;
}
LONGLONG.prototype.size = 8;

export let STRING = function (maxSize) {
    this.value = "";
    this.maxSize = maxSize;
}

export function str_utf8_string(maxSize) {
    this.value = "";
    this.maxSize = maxSize;
}

export function str_dync_utf8_string(fn) {
    this.value = "";
    this.getMaxSize = fn;
}

//only use read.
export function str_varchar_string() {
    this.value = "";
}
str_varchar_string.prototype.size = 0;  //string byte leng + 2...

// 捕鱼里面用到

// 等同于LONGLONG
export function SCORE(value) {
    value = typeof value !== 'undefined' ? value : 0;
    this.value = value;
}
SCORE.prototype.size = 8;

export function FLOAT(value) {
    value = typeof value !== 'undefined' ? value : 0;
    this.value = value;
}
FLOAT.prototype.size = 4;

export function DOUBLE(value) {
    value = typeof value !== 'undefined' ? value : 0;
    this.value = value;
}
DOUBLE.prototype.size = 8;

export function INT(value = 0) {
    value = typeof value !== 'undefined' ? value : 0;
    this.value = value;
}
INT.prototype.size = 4;
//新加
export function UINI64(value = 0) {
    value = typeof value !== 'undefined' ? value : 0;
    this.value = value;
}
UINI64.prototype.size = 8;
//新加
export function SHORT(value) {
    value = typeof value !== 'undefined' ? value : 0;
    this.value = value;
}
SHORT.prototype.size = 2;

export function createTypeArray(size, ctorFuc) {
    var res = [];
    for (var i = 0; i < size; ++i) {
        if (ctorFuc === Number) {
            res[i] = 0;
        }
        else if (ctorFuc === Boolean) {
            res[i] = false;
        }
        else if (ctorFuc == undefined) {
            res[i] = null;
        }
        else {
            res[i] = new ctorFuc();
        }
    }
    return res;
}

export function createTypeArrayStrIng(size, ctorFuc, strIngNum) {
    var res = [];
    for (var i = 0; i < size; ++i) {
        res[i] = new ctorFuc(strIngNum);
    }
    return res;
}

/**
 * 创建二维数组
 * @param rows 行数
 * @param cols 列数
 * @param ctorFuc 构造方法
 */
export function create2DTypeArray(rows, cols, ctorFuc) {
    var res = [];
    for (var i = 0; i < rows; ++i) {
        res[i] = [];
        for (var j = 0; j < cols; ++j) {
            if (ctorFuc === Number) {
                res[i][j] = 0;
            }
            else if (ctorFuc === Boolean) {
                res[i][j] = false;
            }
            else if (ctorFuc == undefined) {
                res[i][j] = null;
            }
            else {
                res[i][j] = new ctorFuc();
            }
        }
    }
    return res;
}


