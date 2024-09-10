import { _decorator, AssetManager, assetManager, Canvas, director } from 'cc';
import Http from './Http';
const { ccclass, property } = _decorator;

export class PromiseEx  {
    static Call(work:(resolve: Function, reject: Function)=>Function){
        return new Promise((resolve, reject)=> {
            let finishCall = work(resolve, reject);
            if (finishCall){
                finishCall()
            }
            return 
        })
    }

    static CallDelay(work:(resolve: Function, reject: Function)=>Function, delay:number){
        return new Promise((resolve, reject)=> {
            director.getScene().getComponentInChildren(Canvas)
            .scheduleOnce(()=>{
                work(resolve, reject)();
            }, delay)

            // setTimeout(()=>{work(resolve, reject)();}, delay*1000)
            return 
        })
    }

    static CallDelayOnly(delay:number){
        return new Promise((resolve, reject)=> {
            director.getScene().getComponentInChildren(Canvas)
            .scheduleOnce(()=>{
                resolve(null);
            }, delay)

            // setTimeout(()=>{resolve(null);}, delay*1000)
            return 
        })
    }

    static async GetBundle(bundleName: string): Promise<AssetManager.Bundle | undefined> {
        return new Promise(resolve => {
            assetManager.loadBundle(bundleName, (error, bundle: AssetManager.Bundle) => {
                if (error) {
                    resolve(undefined);
                } else {
                    resolve(bundle);
                }
            });
        });
    }

    static async GetResource(bundle: AssetManager.Bundle, resourceName: string): Promise<any | undefined> {
        return new Promise(resolve => {
            bundle.load(resourceName, (error, asset) => {
                if (error) {
                    resolve(undefined);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    static HttpPost(url:string, data: string){
        console.log(`request [${url}] `, data)//logflg
        return new Promise((resolve, reject)=> {
            Http.Post(url, data, (xhr: XMLHttpRequest, response:any)=>{
                if (response != null || Http.isRequestSuccess(xhr)){
                    resolve(xhr);
                    return 
                }

                reject(xhr);
            })
        })
    }

}

window["PromiseEx"] = PromiseEx;