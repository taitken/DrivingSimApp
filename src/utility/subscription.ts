export class Subscription {
    constructor(func: (newState: any) => void, list: ((newState: any) => void)[]) {
        this.subscriptionFunction = func;
        this.subscriptionList = list;
    }

    private subscriptionFunction: (newState: any) => void;
    private subscriptionList: ((newState: any) => void)[];

    unsubscribe() {
        let subIndex = this.subscriptionList.findIndex(func => func == this.subscriptionFunction);
        if (subIndex > 0)
            this.subscriptionList.splice(subIndex, 1);
    }
}