import { _decorator, Component } from 'cc';
import { l10n } from '../../../../extensions/localization-editor/static/assets/l10n';
import { SharedNoticeBar } from './shared_notice_bar';
const { ccclass, property } = _decorator;

// 失败重试提示

@ccclass('SharedRetryNotice')
export class SharedRetryNotice extends Component {
    @property({type:SharedNoticeBar})
    sharedNoticeBar:SharedNoticeBar;

    setTimes(times: number){
        let msg = l10n.t("shared_request_fail_retry").replace("{1}", String(times));
        this.sharedNoticeBar.setData(msg);
    }

    destroySelf(){
        this.node.destroy();
    }
}


