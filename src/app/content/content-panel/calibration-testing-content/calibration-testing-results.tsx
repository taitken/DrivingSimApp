import { useEffect, useState } from "react";
import { ServiceProvider } from "../../../../services/service-provider.service";
import { UiButton } from "../../../ui/ui-button/ui-button";
import { UiLoading } from "../../../ui/ui-loading";


export function CalibrationTestingResult() {
    const [results, setResults] = useState(null)
    const testingService = ServiceProvider.calibrationTestingService;

    useEffect(() => {
        let homographyFile = testingService.selectedHomographyFile.getValue();
        let selectedPoints = testingService.selectedCanvasPointsEmitter.getValue();
        ServiceProvider.backendService.calcDistance(homographyFile, selectedPoints).then(async (results) => {
            await new Promise(f => setTimeout(f, 1000));
            setResults(results.data);
        });
        return () => {
        }
    }, []);


    function reset() {
        ServiceProvider.calibrationTestingService.resetEmitters();
    }

    const resultBox =
        <>
            <div className="bold fs-4">
                <span className="text-dark">Distance:</span> {results}cm.
            </div>
        </>

    return (
        <>
            <div className="content-container">
                <h3 className="text-primary">Results</h3>
                <p>The analytics process is using your selected homography file to calculate the real life measurements of the drawn distance of the two selected points on the video.</p>
                <div className="d-flex mt-auto mb-auto ms-auto me-auto text-primary">
                    {results == null && <UiLoading></UiLoading>}
                    {results != null && resultBox}
                </div>


                <div className="footer ms-auto">
                    <UiButton onClick={reset} style="accent" size="lg">Reset</UiButton>
                </div>
            </div>
        </>
    )
}