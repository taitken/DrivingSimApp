import { useState } from "react"
import { UiButton } from "../../../../ui/ui-button/ui-button"
import { ServiceProvider } from "../../../../../services/service-provider.service"
import { Dimensions } from "../../../../../models/dimension.model"

export function CalibrationCreationEnterRealWorldMeasurements() {
    const [width, setWidth] = useState(null)
    const [height, setHeight] = useState(null)


    function nextStep() {
        ServiceProvider.calibrationCreationService.realWorldDimensionsEmitter.update(new Dimensions(width, height));
        ServiceProvider.calibrationCreationService.nextStep();
    }

    function validate(value: number): boolean {
        return value > 0;
    }

    return (
        <>
            <h3 className="text-primary">Enter Real World Measurements</h3>
            <p>Please enter the dimensions of the object that was selected in the previous step.</p>
            <div className="mt-5 mb-2 w-100">
                <div className="ms-auto me-auto">
                    <div className="form-group me-2 mb-2 ms-auto me-auto w-50">
                        <span style={{width: "75px"}}>Width</span>
                        <input className="form-field" type="number" name="myInput" value={width ?? 0} onChange={(e) => { if (validate(+e.target.value)) setWidth(+e.target.value) }} />
                        <span>cm</span>
                    </div>
                    <div className="form-group ms-auto me-auto w-50">
                        <span style={{width: "75px"}}>Height</span>
                        <input className="form-field" type="number" name="myInput" value={height ?? 0} onChange={(e) => { if (validate(+e.target.value)) setHeight(+e.target.value) }} />
                        <span>cm</span>
                    </div>
                </div>
            </div>
            <div className="footer ms-auto mt-5 ">
                <UiButton onClick={nextStep} disabled={!validate(width) || !validate(height)} style="accent" size="lg">Confirm</UiButton>
            </div>
        </>
    )
}