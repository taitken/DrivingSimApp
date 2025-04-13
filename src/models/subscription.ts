import { KeyCallback } from "./key-callback";

export class Subscription {
    constructor(func: (newState: any) => void, list: KeyCallback[]) {
        this.subscriptionFunction = func;
        this.subscriptionList = list;
    }

    private subscriptionFunction: (newState: any) => void;
    private subscriptionList: KeyCallback[];

    unsubscribe() {
        let subIndex = this.subscriptionList.findIndex(f => f.stateCallback == this.subscriptionFunction);
        if (subIndex > 0)
            this.subscriptionList.splice(subIndex, 1);
    }
}