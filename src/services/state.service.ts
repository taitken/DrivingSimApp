export enum StateTrigger {
    VIDEO_SECTION_SELECTED,
    CALIBRATION_POINTS
}

export class StateService {

    constructor() {
    }

    private eventSubscribers: KeyCallback[] = [];

    public subscribeToStateTrigger(key: StateTrigger, subscriber: (newState: any)=> void ) {
        this.eventSubscribers.push({ key, stateCallback: subscriber });
    }

    public updateState(key: StateTrigger, newState: any) {
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