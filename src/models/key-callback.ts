import { StateTrigger } from "../services/state.service";

export interface KeyCallback {
    key: StateTrigger,
    stateCallback: (newState: any)=> void
}