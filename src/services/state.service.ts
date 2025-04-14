import { Subscription } from "../utility/subscription";

export enum StateTrigger {
    MENU_STEP,
    VIDEO_FILE_SECLECTED,
    VIDEO_SECTION_SELECTED,
    CALIBRATION_POINTS
}

export class StateService {

    constructor() {
    }

    //     private eventSubscribers: KeyCallback[] = [];
    //     private currentStates: { [key: number]: any } = {};

    //     public subscribeToStateTrigger(key: StateTrigger,  subscriber: (newState: any) => void): Subscription {
    //         this.eventSubscribers.push({ key: key, stateCallback: subscriber });
    //         return new Subscription(subscriber, this.eventSubscribers)
    //     }

    //     public subscribeImmediatelyToStateTrigger(key: StateTrigger, subscriber: (newState: any) => void): Subscription {
    //         let sub = this.subscribeToStateTrigger(key , subscriber);
    //         subscriber(this.currentStates[key]);
    //         return sub;
    //     }

    //     public updateState(key: StateTrigger, newState: any) {
    //         this.currentStates[key] = newState;
    //         this.eventSubscribers.forEach(keyCallback => {
    //             if (keyCallback.key == key)
    //                 keyCallback.stateCallback(newState);
    //         });
    //     }
}