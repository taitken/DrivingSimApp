export enum StateTrigger {
    MENU_STEP,
    VIDEO_FILE_SECLECTED,
    VIDEO_SECTION_SELECTED,
    CALIBRATION_POINTS
}

export class StateService {

    constructor() {
    }

    private eventSubscribers: KeyCallback[] = [];
    private currentStates: {[key: number]: any} = {};

    public subscribeToStateTrigger(key: StateTrigger, subscriber: (newState: any)=> void ) {
        this.eventSubscribers.push({ key, stateCallback: subscriber });
    }

    public subscribeImmediatelyToStateTrigger(key: StateTrigger, subscriber: (newState: any)=> void ) {
        this.subscribeToStateTrigger(key, subscriber);
        subscriber(this.currentStates[key]);
    }

    public updateState(key: StateTrigger, newState: any) {
        this.currentStates[key] = newState;
        this.eventSubscribers.forEach(keyCallback => {
            if (keyCallback.key == key)
                keyCallback.stateCallback(newState);
        });
    }
}

interface KeyCallback {
    key: StateTrigger,
    stateCallback: (newState: any)=> void
}

interface KeyCurrentState {
    key: StateTrigger,
    currentState: any;
}