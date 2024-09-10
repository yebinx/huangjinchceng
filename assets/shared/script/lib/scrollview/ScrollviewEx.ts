import { Prefab,  ScrollView } from 'cc';
import { PageViewEx } from './pageview';
import ScrollViewInfinite from './scroll_view_infinite';

export class ScrollViewEx {
    static replacePageViewEx(oldScrollView:ScrollView): PageViewEx{
        let node = oldScrollView.node;
        node.active = false;// 取消激活状态，使其在替换新组件后才调用onLoad

        let pageViewEx = node.addComponent(PageViewEx);
        pageViewEx.scrollView = oldScrollView;

        node.active = true;
        return  pageViewEx
    }

    static replaceScrollViewInfinite(oldScrollView:ScrollView, itemPrefab: Prefab){
        let node = oldScrollView.node;
        node.active = false; // 取消激活状态，使其在替换新组件后才调用onLoad

        let scrollViewInfinite = node.addComponent(ScrollViewInfinite);
        scrollViewInfinite.scrollView = oldScrollView;
        scrollViewInfinite.itemPrefab = itemPrefab;

        node.active = true;
        return scrollViewInfinite
    }
}

// 
