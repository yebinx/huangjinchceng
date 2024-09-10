/************************************************************************
 * Copyright (c) 2019 App
 * Author   : eason
 * Date     : 2019-12-10
 * Use      :
 * 			1，字节流基本类型封装
 * 			2，long,int64类型实现
 * 		    3，utf8编码实现
 ************************************************************************/

import { gbkStrToUtf16Str } from "./util.charset";
import { utf16StrToGbkStr } from "./util.charset";

// Assuming Util and related dependencies are defined elsewhere as they were used but not defined in the original code
declare const Util: any;

export class ByteBuffer {
    buffer: ArrayBuffer;
    dataView: DataView;
    offset: number;

    constructor(length: number = 4096) {
        this.buffer = new ArrayBuffer(length);
        this.dataView = new DataView(this.buffer);
        this.offset = 0;
    }

    setBufferData(buffer: ArrayBuffer, isInitHeader: boolean = false): DataView {
        this.buffer = buffer;
        this.dataView = new DataView(this.buffer);
        this.offset = 0;

        if (isInitHeader) {
            this.initHeader();
        }
        return this.dataView;
    }

    appendArrayBuffer(toPos: number, fromBuffer: ArrayBuffer, fromPos: number, length: number): void {
        let uarr = new Uint8Array(fromBuffer);
        for (let i = fromPos; i < length; i++) {
            this.dataView.setInt8(toPos++, uarr[i]);
        }
    }

    appendUint8Array(toPos: number, uarr: Uint8Array): void {
        uarr.forEach((byte) => {
            this.dataView.setInt8(toPos++, byte);
        });
    }

    initHeader(): void {
        this.offset += 8;
    }

    writeChar(input: string): number {
        this.dataView.setInt8(this.offset++, input.charCodeAt(0));
        return this.offset;
    }

    writeHex(input: number): number {
        this.dataView.setInt8(this.offset++, input);
        return this.offset;
    }

    writeUInt8(input: number): number {
        this.dataView.setUint8(this.offset++, input);
        return this.offset;
    }

    writeUInt16(input: number): number {
        this.dataView.setUint16(this.offset, input, true);
        this.offset += 2;
        return this.offset;
    }

    writeInt16(input: number): number {
        this.dataView.setInt16(this.offset, input, true);
        this.offset += 2;
        return this.offset;
    }

    writeUInt32(input: number): number {
        this.dataView.setUint32(this.offset, input, true);
        this.offset += 4;
        return this.offset;
    }

    writeInt32(input: number): number {
        this.dataView.setInt32(this.offset, input, true);
        this.offset += 4;
        return this.offset;
    }

    writeInt64(input: number): void {
        var sign = input < 0;
        if (sign)
            input = -1 - input;
        for (var i = 0; i < 8; i++) {
            var mod = input % 0x100;
            input = (input - mod) / 0x100;
            var v = sign ? mod ^ 0xFF : mod;
            this.dataView.setUint8(this.offset++, v);
        }
    }

    writeUInt64(input: number): void {
        let bigint = BigInt(input);
        var ret = this.dataView.setBigUint64(this.offset, bigint, true)
        this.offset += 8;
        return ret;
    }

    writeFloat32(input: number): void {
        let ret = this.dataView.setFloat32(this.offset, input, true);
        this.offset += 4;
        return ret;
    }

    writeFloat64(input: number): void {
        let ret = this.dataView.setFloat64(this.offset, input, true);
        this.offset += 8;
        return ret;
    }

    writeString(input: string, size: number): number {
        var gbkStr = utf16StrToGbkStr(input);
        this.stringToGBK(gbkStr);
        var fix_size = size - gbkStr.length;
        if (fix_size < 0) fix_size = 0;
        this.offset += fix_size;
        return this.offset;
    }
    writeCString(input) {
        var utf8Length = this.UTF8Length(input);
        var gbkStr = utf16StrToGbkStr(input);
        this.stringToGBK(gbkStr);
        this.offset = this.writeUInt16(utf8Length);
        this.writeHex(0); //add '\0'
        return this.offset;
    }

    writeUTF8String(input, size) {
        var utf8Length = this.UTF8Length(input);
        if (utf8Length > 0) {
            this.stringToUTF8(input);
        }
        var fix_size = size - utf8Length;
        if (fix_size < 0) fix_size = 0;
        this.offset += fix_size;
        //this.writeHex(0); //add '\0'
        return;
    }

    readInt64(): number {
        var bytes = new Uint8Array(this.buffer, this.offset, 8);
        var sign = bytes[7] >> 7;
        this.offset += 8;
        var sum = 0;
        var digits = 1;
        for (var i = 0; i < 8; i++) {
            var value = bytes[i];
            sum += (sign ? value ^ 0xFF : value) * digits;
            digits *= 0x100;
        }
        return sign ? -1 - sum : sum;
    }



    readUInt32(): number {
        let value = this.dataView.getUint32(this.offset, true);
        this.offset += 4;
        return value;
    }

    readUInt64(): bigint {
        let value = this.dataView.getBigUint64(this.offset, true);
        this.offset += 8;
        return value;
    }

    readInt32(): number {
        let value = this.dataView.getInt32(this.offset, true);
        this.offset += 4;
        return value;
    }

    readInt16(): number {
        let value = this.dataView.getInt16(this.offset, true);
        this.offset += 2;
        return value;
    }

    readUInt16(): number {
        let value = this.dataView.getUint16(this.offset, true);
        this.offset += 2;
        return value;
    }

    readUInt8(): number {
        let value = this.dataView.getUint8(this.offset);
        this.offset += 1;
        return value;
    }

    readString(length: number): string {
        var buf_size = this.buffer.byteLength;
        if (this.offset + length > buf_size) length = buf_size - this.offset; //服务端有时候 最后一个字段字符串 按/n长度 写入
        var uint8Array = new Uint8Array(this.buffer, this.offset, length);
        var charCodeArray = [];
        for (var i = 0; i < uint8Array.length; i++) {
            if (uint8Array[i] == 0)
                break

            charCodeArray.push(String.fromCharCode(uint8Array[i]));
        }
        var ret = gbkStrToUtf16Str(charCodeArray.join(''));
        this.offset += uint8Array.length;
        return ret
    }

    readUTF8String(length) {
        //var length = this.readInt16();
        var buf_size = this.buffer.byteLength;
        if (this.offset + length > buf_size) length = buf_size - this.offset; //服务端有时候 最后一个字段字符串 按/n长度 写入
        var uint8Array = new Uint8Array(this.buffer, this.offset, length);
        var ret = this.parseUTF8(uint8Array, 0, uint8Array.length, length);
        this.offset += uint8Array.length;
        return ret;
    }
    readCString() {
        var length = this.readInt16();
        return this.readString(length);
    }


    readFloat32(): number {
        let value = this.dataView.getFloat32(this.offset, true);
        this.offset += 4;
        return value;
    }

    readFloat64(): number {
        let value = this.dataView.getFloat64(this.offset, true);
        this.offset += 8;
        return value;
    }

    stringToGBK(input) {
        for (var i = 0; i < input.length; i++) {
            var charCode = input.charCodeAt(i);
            this.writeHex(charCode);
        }
    }
    stringToUTF8(input) {
        for (var i = 0; i < input.length; i++) {
            var charCode = input.charCodeAt(i);
            // Check for a surrogate pair.
            if (0xD800 <= charCode && charCode <= 0xDBFF) {
                var lowCharCode = input.charCodeAt(++i);
                if (isNaN(lowCharCode)) {
                    //return ;
                    //throw new Error(string.format(ERROR.MALFORMED_UNICODE, [ charCode,
                    //		lowCharCode ]));
                }
                charCode = ((charCode - 0xD800) << 10) + (lowCharCode - 0xDC00)
                    + 0x10000;
            }
            if (charCode <= 0x7F) {
                this.writeHex(charCode);
            } else if (charCode <= 0x7FF) {
                this.writeHex(charCode >> 6 & 0x1F | 0xC0);
                this.writeHex(charCode & 0x3F | 0x80);
            } else if (charCode <= 0xFFFF) {
                this.writeHex(charCode >> 12 & 0x0F | 0xE0);
                this.writeHex(charCode >> 6 & 0x3F | 0x80);
                this.writeHex(charCode & 0x3F | 0x80);
            } else {
                this.writeHex(charCode >> 18 & 0x07 | 0xF0);
                this.writeHex(charCode >> 12 & 0x3F | 0x80);
                this.writeHex(charCode >> 6 & 0x3F | 0x80);
                this.writeHex(charCode & 0x3F | 0x80);
            }
        }
        // return this.byteStream;

    }

    isASCIIByte(a): boolean {
        return 0x00 <= a && a <= 0x7F;
    }

    GBKLength(input): number {
        var output = 0;
        for (var i = 0; i < input.length; i++) {
            var charCode = input.charCodeAt(i);
            if (this.isASCIIByte(charCode)) output++;
            else {
                output += 2;
                i++;
            }
        }
        return output;
    }

    UTF8Length(input): number {
        var output = 0;
        for (var i = 0; i < input.length; i++) {
            var charCode = input.charCodeAt(i);
            if (charCode > 0x7FF) {
                // Surrogate pair means its a 4 byte character
                if (0xD800 <= charCode && charCode <= 0xDBFF) {
                    i++;
                    output++;
                }
                output += 3;
            } else if (charCode > 0x7F)
                output += 2;
            else
                output++;
        }
        return output;
    }

    parseUTF8(input, offset, length, maxSize): string {
        var output = "";
        var utf16;
        var pos = offset;

        while (pos < offset + length) {
            var byte1 = input[pos++];
            if (byte1 == 0) break;
            if (byte1 < 128)
                utf16 = byte1;
            else {
                var byte2 = input[pos++] - 128;
                if (byte2 < 0) {

                }
                if (byte1 < 0xE0)
                    utf16 = 64 * (byte1 - 0xC0) + byte2;
                else {
                    var byte3 = input[pos++] - 128;
                    if (byte3 < 0) { }

                    if (byte1 < 0xF0)
                        utf16 = 4096 * (byte1 - 0xE0) + 64 * byte2 + byte3;
                    else {
                        var byte4 = input[pos++] - 128;
                        if (byte4 < 0) { }

                        if (byte1 < 0xF8) // 4 byte character
                            utf16 = 262144 * (byte1 - 0xF0) + 4096 * byte2 + 64
                                * byte3 + byte4;

                    }
                }
            }

            if (utf16 > 0xFFFF) // 4 byte character - express as a surrogate
            {
                utf16 -= 0x10000;
                output += String.fromCharCode(0xD800 + (utf16 >> 10)); // lead
                // character
                utf16 = 0xDC00 + (utf16 & 0x3FF); // trail character
            }
            output += String.fromCharCode(utf16);
        }
        return output;
    }

    encode = function (bytes) {
        for (var i = 0; i < bytes.length; i++) {
            bytes[i] ^= 0xFF;
        }
        return bytes;
    }


    hasError(): boolean {
        return false; // Placeholder for error handling
    }
}