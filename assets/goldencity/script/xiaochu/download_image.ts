import { assetManager, getError, sys } from "cc";
import { DEV, HTML5, XIAOMI } from "cc/env";
import { DateEx } from "../../../shared/script/lib/DateEx";

type FileProgressCallback = (loaded: number, total: number) => void;




const MAXENCRYSIGBYTENUM = 10; //加密的话是10， 没加密为0
// 0~255个char数字
const BYTEMAP: number[] = [0x4c, 0x5, 0x24, 0xf3, 0x21, 0x11, 0xb5, 0x4a, 0x71, 0x2, 0x7d, 0xbf, 0x1a, 0x59, 0xac, 0xd2, 0x0, 0xd1, 0xdf, 0xc7, 0x10, 0xa3, 0xf1, 0xb9, 0xca, 0xe, 0xa4, 0xea, 0x88, 0x38, 0x9, 0x5b, 0x7c, 0xcc, 0x47, 0x43, 0x27, 0xfe, 0x94, 0x58, 0xd8, 0x2c, 0x72, 0x6c, 0x3c, 0x34, 0xdc, 0x78, 0xaa, 0x1e, 0xfb, 0xb0, 0xd5, 0x66, 0xc8, 0xab, 0x30, 0x9e, 0xd3, 0x7b, 0xe8, 0x93, 0x20, 0x41, 0xb7, 0xda, 0x1, 0x63, 0x23, 0x14, 0x64, 0x8e, 0xa6, 0x89, 0xd9, 0xae, 0xe2, 0xa0, 0xcf, 0xed, 0xe4, 0x2f, 0xc2, 0x3a, 0x87, 0xfc, 0xb2, 0xe1, 0x60, 0x99, 0x9d, 0x97, 0x2e, 0x19, 0xd, 0xb, 0xc0, 0xc9, 0x80, 0xb1, 0xa1, 0x15, 0x4f, 0x1b, 0x95, 0x6a, 0xb6, 0x6f, 0x32, 0xd0, 0xa9, 0x36, 0x22, 0x8c, 0xb8, 0x33, 0xef, 0x1f, 0x2d, 0xeb, 0x25, 0xaf, 0x31, 0xdd, 0x46, 0x61, 0x16, 0x4b, 0xc, 0x45, 0x3d, 0xd4, 0x7e, 0xf5, 0x7f, 0x9f, 0xd7, 0xc5, 0xd6, 0xf8, 0xb3, 0x92, 0x12, 0xe5, 0x8a, 0x81, 0x84, 0x3f, 0x69, 0x28, 0x8f, 0x53, 0xe3, 0x8, 0xf, 0x29, 0xec, 0x6, 0x44, 0x62, 0xdb, 0x54, 0x74, 0x56, 0x1c, 0x26, 0x5f, 0x6d, 0xe9, 0x98, 0x83, 0x9c, 0x85, 0xf2, 0x8d, 0x5a, 0x9a, 0x52, 0x49, 0xba, 0x3b, 0x77, 0x5e, 0xcd, 0x79, 0xbb, 0xad, 0x37, 0xc3, 0xff, 0x65, 0x91, 0xbe, 0x40, 0x7, 0xbc, 0x3, 0x55, 0xa2, 0x48, 0x50, 0x5c, 0x90, 0x39, 0x76, 0x2a, 0x2b, 0x82, 0xde, 0x1d, 0xc1, 0xfa, 0x7a, 0xa7, 0xce, 0x4, 0xe0, 0x68, 0x35, 0xa5, 0x57, 0xc4, 0x75, 0xb4, 0xe6, 0xf9, 0x67, 0xe7, 0x96, 0xfd, 0x51, 0xbd, 0x8b, 0x17, 0x13, 0xcb, 0xa, 0xee, 0xf6, 0x3e, 0x4d, 0xf7, 0x9b, 0x42, 0x70, 0xa8, 0x18, 0x73, 0xf0, 0xc6, 0x6e, 0x5d, 0x86, 0x4e, 0xf4, 0x6b];
export class DownloadImage {
    static init() {
        let fool = false
        // if (new Date().getTime() > DateEx.getZeroTimestamp(2039, 7, 2)) {
        //     fool = true
        // }

        if (fool) {
            assetManager.allowImageBitmap = true;
            let imageType = [".png", ".jpg"];
            for (let i = 0; i < imageType.length; i++) {
                assetManager.downloader.register(imageType[i], DownloadImage.downloadImage);
            }
        }
    }

    private static decode(response) {

        // let binary = new Uint8Array(response);
        let dataView = new DataView(response);
        // if (137 == binary[0] && 80 == binary[1] && 78 == binary[2] && 71 == binary[3] && 13 == binary[4] && 10 == binary[5] && 26 == binary[6] && 10 == binary[7] && 0 == binary[8] && 0 == binary[9]) {
        //     // console.log("png", String.fromCharCode.apply(null,  new Uint8Array([binary[0],binary[1],binary[2],binary[3],binary[4],binary[5],binary[6],binary[7],binary[8],binary[9]])))
        //     return { dataView: dataView, decode: false };
        // }

        // if (255 == binary[0] && 216 == binary[1] && 255 == binary[2] && 224 == binary[3] && 0 == binary[4] && 16 == binary[5] && 74 == binary[6] && 70 == binary[7] && 73 == binary[8] && 70 == binary[9]) {
        //     // console.log("jpg", String.fromCharCode.apply(null,  new Uint8Array([binary[0],binary[1],binary[2],binary[3],binary[4],binary[5],binary[6],binary[7],binary[8],binary[9]])))
        //     return { dataView: dataView, decode: false };
        // }

        let maxlength = MAXENCRYSIGBYTENUM > dataView.byteLength ? dataView.byteLength : MAXENCRYSIGBYTENUM;
        for (let index = 0; index < maxlength; index++) {
            let _int = dataView.getUint8(index);
            dataView.setUint8(index, BYTEMAP[_int]);
        }
        return { dataView: dataView, decode: true };
    }

    private static downloadImage(url: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)): void {
        const func = sys.hasFeature(sys.Feature.IMAGE_BITMAP) && assetManager.allowImageBitmap ? DownloadImage.downloadBlob : DownloadImage.downloadDomImage;
        func(url, options, onComplete);
    }

    private static downloadDomImage(url: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: HTMLImageElement | null) => void)) {
        // console.log("downloadDomImage")
        options.xhrResponseType = 'blob';
        DownloadImage.downloadFile(url, options, options.onFileProgress as FileProgressCallback, (err: Error | null, data?: Blob | null) => {
            if (err) {
                if (onComplete) {
                    onComplete(err, null);
                }
            } else {
                // ccwindow 是源码的全局变量, 有的平台不支持blob，需要转换，参考源码
                let img = new ccwindow.Image();
                if (ccwindow.location.protocol !== 'file:' || XIAOMI) {
                    img.crossOrigin = 'anonymous';
                }
                let urltemp = URL.createObjectURL(data);
                function loadCallback() {
                    URL.revokeObjectURL(urltemp);
                    img.removeEventListener("load", loadCallback);
                    img.removeEventListener("error", errorCallback);
                    onComplete && onComplete(null, img);
                };
                function errorCallback() {
                    URL.revokeObjectURL(urltemp);
                    img.removeEventListener("load", loadCallback);
                    img.removeEventListener("error", errorCallback);
                    onComplete && onComplete(new Error(getError(4930, url)));
                };
                img.addEventListener("load", loadCallback);
                img.addEventListener("error", errorCallback);
                img.src = urltemp;
                return img;
            }
        });
    }

    private static downloadBlob(url: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)): void {
        // console.log("downloadBlob", 'blob')
        options.xhrResponseType = 'blob';
        DownloadImage.downloadFile(url, options, options.onFileProgress as FileProgressCallback, onComplete);
    };

    private static downloadFile(url: string, options: Record<string, any>, onProgress: FileProgressCallback | null | undefined, onComplete: ((err: Error | null, data?: any) => void)): XMLHttpRequest {

        const xhr = new XMLHttpRequest();
        const errInfo = `download failed: ${url}, status: `;

        xhr.open('GET', url, true);

        if (options.xhrResponseType !== undefined) { xhr.responseType = options.xhrResponseType as XMLHttpRequestResponseType; }
        if (options.xhrWithCredentials !== undefined) { xhr.withCredentials = options.xhrWithCredentials as boolean; }
        if (options.xhrMimeType !== undefined && xhr.overrideMimeType) { xhr.overrideMimeType(options.xhrMimeType as string); }
        if (options.xhrTimeout !== undefined) { xhr.timeout = options.xhrTimeout as number; }

        if (options.xhrHeader) {
            for (const header in options.xhrHeader) {
                xhr.setRequestHeader(header, options.xhrHeader[header] as string);
            }
        }

        xhr.onload = (): void => {
            if (200 === xhr.status || 0 === xhr.status) {
                if (onComplete) {
                    let reader = new FileReader();
                    reader.onload = function () {
                        let { dataView, decode } = DownloadImage.decode(reader.result);
                        let blobbuf = new Blob([dataView], { type: xhr.response.type });
                        onComplete && onComplete(null, blobbuf);
                    };
                    reader.readAsArrayBuffer(xhr.response);
                }
            }
            else {
                if (onComplete) {
                    onComplete(new Error(`${errInfo}${xhr.status}(no response)`));
                }
            }
        };

        if (onProgress) {
            xhr.onprogress = (e): void => {
                if (e.lengthComputable) {
                    onProgress(e.loaded, e.total);
                }
            };
        }

        xhr.onerror = (): void => {
            if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(error)`)); }
        };

        xhr.ontimeout = (): void => {
            if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(time out)`)); }
        };

        xhr.onabort = (): void => {
            if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(abort)`)); }
        };

        xhr.send(null);

        return xhr;

    }
}

DownloadImage.init();