import { BackendService } from "./backend.service";
import { CalibrationCreationService } from "./calibration-creation.service";
import { CalibrationTestingService } from "./calibration-testing.service";
import { StateService } from "./state.service";
import { VideoProcessingService } from "./video-processing.service";

export class ServiceProvider {
    public static stateService: StateService = new StateService();
    public static backendService: BackendService = new BackendService();
    public static calibrationTestingService: CalibrationTestingService = new CalibrationTestingService();
    public static calibrationCreationService: CalibrationCreationService = new CalibrationCreationService();
    public static videoProcessingService: VideoProcessingService = new VideoProcessingService();
}