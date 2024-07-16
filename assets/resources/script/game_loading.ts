import { _decorator, Asset, AssetManager, assetManager, Button, Color, Component, director, game, instantiate, Label, Node, Prefab, ProgressBar, SpringJoint2D, Sprite, UITransform } from 'cc';
import { GameConfig } from './game_config';
import { Splash } from './splash';
import { LoadingBar } from './loading_bar';
import { AnimationTips } from './animation_tips';
import { Network } from './network/Network';
import EventCenter from './network/netData/EventCenter';
import DataManager from './network/netData/DataManager';
import { roomCmd } from './network/netData/cmd';
import { NetworkSend } from './network/NetworkSend';
const { ccclass, property } = _decorator;

enum LoadType {
    INIT = 0,
    LOGIN = 1 << 0, // 登录信息
    BETINFO = 1 << 1, // 下注信息
    BUNDLE = 1 << 2, // 游戏子包
}

// 加载ui资源占用百分比
enum LoadPre {
    INIT = 0,
    SHARED_BUNDLE = 20,
    USER_INFO = 10,
    BET_INFO = 10,
    GAME_BUNDLE = 60
}

@ccclass('GameLoading')
export class GameLoading extends Component {
    @property({ type: Label })
    lbVersion: Label; // 版本号

    @property({ type: LoadingBar })
    loadingBar: LoadingBar; // 进度条

    @property({ type: AnimationTips })
    animationTips: AnimationTips; // 提示跑马灯

    @property({ type: Sprite })
    spBar: Sprite;

    @property({ type: Label })
    lbTips: Label; // 加载文字提示

    @property({ type: Button })
    btnStart: Button; // 开始按钮

    @property({ type: Node })
    ndPopLayer: Node; // 

    @property({ type: Node })
    ndAdaptationTop: Node; // 适配节点

    @property({ type: Node })
    ndAdaptationBottom: Node; // 适配节点

    config: GameConfig = new GameConfig();
    loadType: LoadType = LoadType.INIT;

    private loginPer = LoadPre.INIT;

    protected onLoad(): void {
        this.animationTips.node.active = false;
        this.btnStart.node.active = false;
        this.loadingBar.setProgress(this.loginPer);
        this.lbVersion.string = `version:${this.config.version}`;
        this.lbVersion.color = this.config.themeColor;
        this.register()
    }

    protected start(): void {
        this.loadBundleShared();
    }

    private register() {
        let splash = director.getScene().getComponentInChildren(Splash);
        splash.node.on("view_resize", this.onEmitViewResize, this);
    }

    private connect(){
        Network.Instance.CreateWS();
        EventCenter.getIns().once("onConnect",this.onConnect,this);
    }
    
    private onConnect(){
        let eventName = DataManager.getCmdEventName(roomCmd.MDM_GF_FRAME, roomCmd.SUB_GF_SCENE,DataManager.serverTypeStr);
        EventCenter.getIns().once(eventName,this.login,this);
    }

    // 拉取登录信息
    private async login() {
        this.lbTips.string = this.getL10n("shared_account_login");
        this.config.userInfo = DataManager.initLoginData();
        if (!this.config.userInfo) {
            return
        }
        this.loadingBar.addProgress(LoadPre.USER_INFO / 100);

        this.lbTips.string = this.getL10n("shared_load_user_info");
        this.config.betInfo=DataManager.initBetInfo();
        // ok = await this.betInfo();
        if (!this.config.betInfo) {
            return
        }
        this.loadType |= LoadType.BETINFO;
        this.loadingBar.addProgress(LoadPre.BET_INFO / 100);
        this.loadBundle();
    }

    // 拉取玩家信息
    private async userInfo() {


        if (GameConfig.getTest()) {
            this.config.userInfo = {
                "player_info": {
                    "id": 3038,
                    "create_time": "2023-12-18 13:09:24",
                    "update_time": "2023-12-22 09:22:52",
                    "agent_id": 1,
                    "balance": 92350000,
                    "frozen": 0,
                    "account": "trynSfVWFpsO",
                    "nickname": "试玩xfLstCzleC",
                    "is_buy": "",
                    "target": 0,
                    "complete": 0,
                    "contr_rate": 0,
                    "special": 0,
                    "agent_name": "T6Line",
                    "client_ip": "172.17.0.1",
                    "line_code": "",
                    "type": 1,
                    "platform": 0,
                    "dealer_id": 0,
                    "currency_id": 1,
                    "password": "",
                    "status": 1,
                    "mute": 0,
                    "last_login_time": "2023-12-18 05:09:24",
                    "bet_count": 0,
                    "valid_bet_amount": 0,
                    "payout_amount": 0,
                    "overage": 0,
                    "total_change_amount": 0,
                    "first_bet_time": "0001-01-01 00:00:00",
                    "last_bet_time": "0001-01-01 00:00:00",
                    "ip": "113.81.199.113",
                    "nation": ""
                },
                "GoldenCity_info": {
                    "id": 3038,
                    "create_time": "2023-12-18 17:24:01",
                    "update_time": "2023-12-22 09:22:52",
                    "player_id": 3038,
                    "free_play_times": 0,
                    "last_time_bet": 60000,
                    "betsize": 300,
                    "betmultiple": 10,
                    "last_bet_id": 4448,
                    "orderid": "7-1703053483-FF283CA2C",
                    "betid": 10,
                    "sceneodds": 1,
                    "havewin": 12000,
                    "buytype": 0,
                    "freeresult": "",
                    "lastresult": "eyJjYXJkX2xpc3QiOlt7Imxpc3QiOlsxMiw0LDMsN10sIndpbnBvcyI6W10sImRyb3BsaXN0IjpudWxsLCJzMmdsaXN0IjpudWxsfSx7Imxpc3QiOls2LDQsNSw1LDZdLCJ3aW5wb3MiOltdLCJkcm9wbGlzdCI6bnVsbCwiczJnbGlzdCI6bnVsbH0seyJsaXN0IjpbMTMxMywyMTNdLCJ3aW5wb3MiOltdLCJkcm9wbGlzdCI6bnVsbCwiczJnbGlzdCI6bnVsbH0seyJsaXN0IjpbMTMxMCwzLDldLCJ3aW5wb3MiOltdLCJkcm9wbGlzdCI6bnVsbCwiczJnbGlzdCI6bnVsbH0seyJsaXN0IjpbOSwxMzEwLDVdLCJ3aW5wb3MiOltdLCJkcm9wbGlzdCI6bnVsbCwiczJnbGlzdCI6bnVsbH0seyJsaXN0IjpbMTIwOSwzMTNdLCJ3aW5wb3MiOltdLCJkcm9wbGlzdCI6bnVsbCwiczJnbGlzdCI6bnVsbH0seyJsaXN0IjpbNyw4LDksMTMsMTBdLCJ3aW5wb3MiOltdLCJkcm9wbGlzdCI6bnVsbCwiczJnbGlzdCI6bnVsbH1dLCJ3aW4iOjAsImhhdmV3aW4iOjEyMDAwLCJyZW1vdmVsaXN0IjpbXSwicm91bmRpZCI6IjU5MjhCQUZDQzYiLCJzY2VuZW9kZHMiOjIsImJhbGFuY2UiOjkyMzUwMDAwLCJzY2F0dGVyY291bnQiOjAsImNyZWF0ZXRpbWUiOjE3MDMyMDgxNzIwMDB9"
                },
                "lastresult": {
                    "card_list": [
                        {
                            "list": [
                                12,
                                4,
                                3,
                                7
                            ],
                            "winpos": [],
                            "droplist": null,
                            "s2glist": null
                        },
                        {
                            "list": [
                                6,
                                4,
                                5,
                                5,
                                6
                            ],
                            "winpos": [],
                            "droplist": null,
                            "s2glist": null
                        },
                        {
                            "list": [
                                1313,
                                213
                            ],
                            "winpos": [],
                            "droplist": null,
                            "s2glist": null
                        },
                        {
                            "list": [
                                1310,
                                3,
                                9
                            ],
                            "winpos": [],
                            "droplist": null,
                            "s2glist": null
                        },
                        {
                            "list": [
                                9,
                                1310,
                                5
                            ],
                            "winpos": [],
                            "droplist": null,
                            "s2glist": null
                        },
                        {
                            "list": [
                                1209,
                                313
                            ],
                            "winpos": [],
                            "droplist": null,
                            "s2glist": null
                        },
                        {
                            "list": [
                                7,
                                8,
                                9,
                                13,
                                10
                            ],
                            "winpos": [],
                            "droplist": null,
                            "s2glist": null
                        }
                    ],
                    "win": 0,
                    "havewin": 12000,
                    "removelist": [],
                    "roundid": "5928BAFCC6",
                    "sceneodds": 2,
                    "balance": 92350000,
                    "scattercount": 0,
                    "createtime": 1703208172000
                }
            }
            this.loadType |= LoadType.LOGIN;
            return true
        }



        let xhrObj = await this.config.login(3);
        if (xhrObj) {
            if (window["Http"].isRequestSuccess(xhrObj)) {
                this.showAccountErrorNotice();
            } else {
                this.showNetErrorNotice();
            }

            return false;
        }

        if (!this.config.isLogin()) { // 登录失败了
            this.showAccountErrorNotice();
            return false
        }

        this.loadType |= LoadType.LOGIN;
        return true
    }

    // 拉取投注信息
    private async betInfo() {

        if (GameConfig.getTest()) {
            this.config.betInfo = {
                "betinfo": [
                    {
                        "betid": 1,
                        "betsize": 300,
                        "betmultiple": 1,
                        "betbase": 20
                    },
                    {
                        "betid": 2,
                        "betsize": 300,
                        "betmultiple": 2,
                        "betbase": 20
                    },
                    {
                        "betid": 3,
                        "betsize": 300,
                        "betmultiple": 3,
                        "betbase": 20
                    },
                    {
                        "betid": 4,
                        "betsize": 300,
                        "betmultiple": 4,
                        "betbase": 20
                    },
                    {
                        "betid": 5,
                        "betsize": 300,
                        "betmultiple": 5,
                        "betbase": 20
                    },
                    {
                        "betid": 6,
                        "betsize": 300,
                        "betmultiple": 6,
                        "betbase": 20
                    },
                    {
                        "betid": 7,
                        "betsize": 300,
                        "betmultiple": 7,
                        "betbase": 20
                    },
                    {
                        "betid": 8,
                        "betsize": 300,
                        "betmultiple": 8,
                        "betbase": 20
                    },
                    {
                        "betid": 9,
                        "betsize": 300,
                        "betmultiple": 9,
                        "betbase": 20
                    },
                    {
                        "betid": 10,
                        "betsize": 300,
                        "betmultiple": 10,
                        "betbase": 20
                    },
                    {
                        "betid": 11,
                        "betsize": 1000,
                        "betmultiple": 1,
                        "betbase": 20
                    },
                    {
                        "betid": 12,
                        "betsize": 1000,
                        "betmultiple": 2,
                        "betbase": 20
                    },
                    {
                        "betid": 13,
                        "betsize": 1000,
                        "betmultiple": 3,
                        "betbase": 20
                    },
                    {
                        "betid": 14,
                        "betsize": 1000,
                        "betmultiple": 4,
                        "betbase": 20
                    },
                    {
                        "betid": 15,
                        "betsize": 1000,
                        "betmultiple": 5,
                        "betbase": 20
                    },
                    {
                        "betid": 16,
                        "betsize": 1000,
                        "betmultiple": 6,
                        "betbase": 20
                    },
                    {
                        "betid": 17,
                        "betsize": 1000,
                        "betmultiple": 7,
                        "betbase": 20
                    },
                    {
                        "betid": 18,
                        "betsize": 1000,
                        "betmultiple": 8,
                        "betbase": 20
                    },
                    {
                        "betid": 19,
                        "betsize": 1000,
                        "betmultiple": 9,
                        "betbase": 20
                    },
                    {
                        "betid": 20,
                        "betsize": 1000,
                        "betmultiple": 10,
                        "betbase": 20
                    },
                    {
                        "betid": 21,
                        "betsize": 10000,
                        "betmultiple": 1,
                        "betbase": 20
                    },
                    {
                        "betid": 22,
                        "betsize": 10000,
                        "betmultiple": 2,
                        "betbase": 20
                    },
                    {
                        "betid": 23,
                        "betsize": 10000,
                        "betmultiple": 3,
                        "betbase": 20
                    },
                    {
                        "betid": 24,
                        "betsize": 10000,
                        "betmultiple": 4,
                        "betbase": 20
                    },
                    {
                        "betid": 25,
                        "betsize": 10000,
                        "betmultiple": 5,
                        "betbase": 20
                    },
                    {
                        "betid": 26,
                        "betsize": 10000,
                        "betmultiple": 6,
                        "betbase": 20
                    },
                    {
                        "betid": 27,
                        "betsize": 10000,
                        "betmultiple": 7,
                        "betbase": 20
                    },
                    {
                        "betid": 28,
                        "betsize": 10000,
                        "betmultiple": 8,
                        "betbase": 20
                    },
                    {
                        "betid": 29,
                        "betsize": 10000,
                        "betmultiple": 9,
                        "betbase": 20
                    },
                    {
                        "betid": 30,
                        "betsize": 10000,
                        "betmultiple": 10,
                        "betbase": 20
                    },
                    {
                        "betid": 31,
                        "betsize": 25000,
                        "betmultiple": 1,
                        "betbase": 20
                    },
                    {
                        "betid": 32,
                        "betsize": 25000,
                        "betmultiple": 2,
                        "betbase": 20
                    },
                    {
                        "betid": 33,
                        "betsize": 25000,
                        "betmultiple": 3,
                        "betbase": 20
                    },
                    {
                        "betid": 34,
                        "betsize": 25000,
                        "betmultiple": 4,
                        "betbase": 20
                    },
                    {
                        "betid": 35,
                        "betsize": 25000,
                        "betmultiple": 5,
                        "betbase": 20
                    },
                    {
                        "betid": 36,
                        "betsize": 25000,
                        "betmultiple": 6,
                        "betbase": 20
                    },
                    {
                        "betid": 37,
                        "betsize": 25000,
                        "betmultiple": 7,
                        "betbase": 20
                    },
                    {
                        "betid": 38,
                        "betsize": 25000,
                        "betmultiple": 8,
                        "betbase": 20
                    },
                    {
                        "betid": 39,
                        "betsize": 25000,
                        "betmultiple": 9,
                        "betbase": 20
                    },
                    {
                        "betid": 40,
                        "betsize": 50000,
                        "betmultiple": 10,
                        "betbase": 20
                    },
                    {
                        "betid": 41,
                        "betsize": 50000,
                        "betmultiple": 1,
                        "betbase": 20
                    },
                    {
                        "betid": 42,
                        "betsize": 50000,
                        "betmultiple": 2,
                        "betbase": 20
                    },
                    {
                        "betid": 43,
                        "betsize": 50000,
                        "betmultiple": 3,
                        "betbase": 20
                    },
                    {
                        "betid": 44,
                        "betsize": 50000,
                        "betmultiple": 4,
                        "betbase": 20
                    },
                    {
                        "betid": 45,
                        "betsize": 50000,
                        "betmultiple": 5,
                        "betbase": 20
                    },
                    {
                        "betid": 46,
                        "betsize": 50000,
                        "betmultiple": 6,
                        "betbase": 20
                    },
                    {
                        "betid": 47,
                        "betsize": 50000,
                        "betmultiple": 7,
                        "betbase": 20
                    },
                    {
                        "betid": 48,
                        "betsize": 50000,
                        "betmultiple": 8,
                        "betbase": 20
                    },
                    {
                        "betid": 49,
                        "betsize": 50000,
                        "betmultiple": 9,
                        "betbase": 20
                    },
                    {
                        "betid": 50,
                        "betsize": 50000,
                        "betmultiple": 10,
                        "betbase": 20
                    }
                ],
                "betadjust": [
                    1,
                    2,
                    3,
                    11,
                    5,
                    10,
                    15,
                    20,
                    31,
                    25,
                    30,
                    40,
                    46,
                    48,
                    50
                ],
                "defaultbetid": 10,
                "buyfreebetid": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    15,
                    16,
                    17,
                    18,
                    19,
                    20,
                    21,
                    22
                ]
            }
            this.loadType |= LoadType.BETINFO;
            return true
        }


        let xhrObj = await this.config.reqBetInfo(3);
        if (xhrObj) {
            if (window["Http"].isRequestSuccess(xhrObj)) {
                this.showAccountErrorNotice();
            } else {
                this.showNetErrorNotice();
            }

            return false;
        }

        this.loadType |= LoadType.BETINFO;
        return true;
    }

    // 加载通用
    private loadBundleShared() {
        this.lbTips.string = this.getL10n("shared_load_shared");

        assetManager.loadBundle("shared", async (err: Error | null, data: AssetManager.Bundle) => {
            if (err != null) {
                this.scheduleOnce(this.loadBundleShared.bind(this), 1.0)
                return
            }

            await this.checkL10Bundle();
            this.loadingBar.addProgress(LoadPre.SHARED_BUNDLE / 100);

            window["SharedConfig"].SetThemeColor(this.config.themeColor);// 设置主题颜色
            this.config.init();
            // this.config.setErrorCallback(this.onCallBackResponeErrorCode.bind(this));
           
            //this.login();
            this.connect();
        })
    }

    // 检查l10多语言的子包是否加载完毕
    private async checkL10Bundle() {
        let check = (resolve: Function, reject: Function) => {
            // TODO l10n有时候会比res包加载的慢，先这样， 后面看怎么把l10n不在res下使用，或者调整加载顺序，修改bundle的顺序无效
            if (assetManager.getBundle("l10n") != null) {
                resolve();
                return
            }

            this.scheduleOnce(() => {
                resolve();
            }, 1.5)
            return
        }

        await window["PromiseEx"].Call(check)
        this.playAnimation()
    }

    private loadBundle() {
        assetManager.loadBundle(this.config.bundle, async (err: Error | null, data: AssetManager.Bundle) => {
            if (err != null) {
                console.error(`load bundle fail ${this.config.bundle}`)//logflg
                await window["PromiseEx"].CallDelayOnly(1.5) // 等待几秒后重试
                this.loadBundle()
                return
            }

            this.loadGamePrefab()
        })
    }

    private loadGamePrefab() {
        let oldPer = 0;
        assetManager.getBundle(this.config.bundle).load(this.config.gamePrefab, (finished: number, total: number, item: AssetManager.RequestItem) => {
            let per = Math.floor(finished / total * 100) / 100;
            if (oldPer > per) {
                return
            }

            this.lbTips.string = this.getL10n("shared_load_game_bundle") + `【${Math.floor(per * 100)}%】`;
            if (finished == total) {
                this.loadingBar.setProgress(1);
            } else {
                this.loadingBar.addProgress((per - oldPer) * LoadPre.GAME_BUNDLE / 100);
            }
            oldPer = per;
        }, async (err: Error, data: Asset) => {
            if (err != null) { // 加载失败重试
                console.error(`load game prefab fail ${this.config.gamePrefab}`)//logflg
                await window["PromiseEx"].CallDelayOnly(1.5) // 等待几秒后重试
                this.loadGamePrefab()
                return
            }

            this.loadType |= LoadType.BUNDLE;
            this.onLoadBundleComplete()
        })
    }

    private async onLoadBundleComplete() {
        this.animationTips.node.active = false;
        this.unscheduleAllCallbacks();
        if ((this.loadType & LoadType.BETINFO) == 0) { // 等待下注信息获取
            this.schedule(() => { // 没有拉取到数据。定时检查
                this.onLoadBundleComplete();
            }, 3.0)
            return
        }

        await this.waitLodingSvgHide();

        this.spBar.node.active = false;
        this.btnStart.node.active = true;
    }

    // 等待svg消失
    private async waitLodingSvgHide() {
        let _svgStartDate = window["_svgStartDate"] as Date;
        if (!_svgStartDate) {
            return
        }

        let _svgDuration = window["_svgDuration"] as number + 500;

        let now = new Date();
        let pastTime = now.getTime() - _svgStartDate.getTime();
        if (pastTime < _svgDuration) {
            await window["PromiseEx"].CallDelayOnly((_svgDuration - pastTime) / 1000)
        }
    }

    private playAnimation() {
        if (this.animationTips.node.active) {
            return
        }

        this.animationTips.node.active = true;
        this.animationTips.play();
    }

    // 错误码提示
    private showAccountErrorNotice() {
        assetManager.getBundle("shared").load("prefab/commom/shared_notice_box", Prefab, (err: Error, data: Prefab) => {
            if (err != null) {
                return;
            }
            this.loadTips(data, this.getL10n("shared_login_fail_account_error_title"), this.getL10n("shared_login_fail_account_error_content"));
        })
    }

    private showNetErrorNotice() {
        assetManager.getBundle("shared").load("prefab/commom/shared_notice_box", Prefab, (err: Error, data: Prefab) => {
            if (err != null) {
                return;
            }
            this.loadTips(data, this.getL10n("shared_login_fail_net_error_title"), this.getL10n("shared_login_fail_net_error_content"));
        })
    }

    private loadTips(noticeBoxPrefab: Prefab, title: string, content: string) {
        let nd = instantiate(noticeBoxPrefab);
        nd.parent = this.ndPopLayer;
        let noticeBox = nd.getComponent("SharedNoticeBox") as any; // SharedNoticeBox
        noticeBox.setInfo(title, content, this.getL10n("shared_title_reload"), this.getL10n("shared_btn_exit"));
        noticeBox.setClickCallback(
            () => {
                window["SystemEx"].restart();
            },
            () => {
                window["SystemEx"].gameEnd();
            });
    }

    private onBntStart() {
        assetManager.getBundle(this.config.bundle).load(this.config.gamePrefab, (err: Error, data: Prefab) => {
            let splash = director.getScene().getComponentInChildren(Splash)

            let game = instantiate(data);
            game.attr({
                "game_config": this.config,
                "splash": splash.node,
                "limit_offset_y": splash.getLimitOffsetY(),
                "offset_y": splash.getOffsetY()
            });
            game.parent = this.node.parent;
            this.node.destroy()
        })
    }

    private onEmitViewResize(offsetY: number, limitOffsetY: number) {
        let height = Math.max(Math.min(offsetY, limitOffsetY), 0);
        let uiTransform = this.ndAdaptationTop.getComponent(UITransform);
        uiTransform.height = height;

        uiTransform = this.ndAdaptationBottom.getComponent(UITransform);
        uiTransform.height = Math.max(0, Math.max(0, height - 65)); // 65 是底部离pg的距离
    }

    private getL10n(key: string) {
        // l10n的子包加载有时候会比resources慢
        if (window["l10n"]) {
            return window["l10n"].t(key);
        }

        return key;
    }
}


