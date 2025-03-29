import { BackendService } from "./backend.service";
import { StateService } from "./state.service";

export class ServiceProvider {
    public static stateService: StateService = new StateService();
    public static backendService: BackendService = new BackendService();
}