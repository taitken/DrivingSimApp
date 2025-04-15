import { useEffect, useState } from "react";
import { XY } from "../../../models/xy.model";
import { UiButton } from "../../ui/ui-button/ui-button";
import { VideoCropper } from "./video-cropper";
import { BaseContentService } from "../../../services/base-content.service";



export function VideoCropperContainer({ eventEmitterService }: { eventEmitterService: BaseContentService }) {
    const [rowCols, setRowCols] = useState(new XY(2, 2));
    const [selectedSection, setSelectedSection] = useState(null)

    useEffect(() => {
        eventEmitterService.croppedVideoSections.update(new XY(2, 2));
        let sub1 = eventEmitterService.selectedVideoSectionEmitter.listenForUpdateAndExecuteImmediately((newSection => {
            setSelectedSection(newSection);
        }));
        let sub2 = eventEmitterService.croppedVideoSections.listenForUpdateAndExecuteImmediately((croppedSections => {
            setRowCols(croppedSections);
        }));
        return () => {
            sub1.unsubscribe();
            sub2.unsubscribe();
        }
    }, []);

    function skip() {
        eventEmitterService.selectedVideoSectionEmitter.update(null)
        eventEmitterService.nextStep();
    }

    function validate(e: React.ChangeEvent<HTMLInputElement>): boolean {
        return +e.target.value > 0;
    }

    return (
        <>
            <div className="content-container">
                <h3 >Crop</h3>
                <p>If your video contains footage from multiple cameras, you may want to crop the image to only show video from a selected camera.</p>
                <div className="mb-2 d-flex">
                    <div className="form-group me-2">
                        <span>Columns</span>
                        <input className="form-field" type="number" name="myInput" value={rowCols.x} onChange={(e) => { if (validate(e)) eventEmitterService.croppedVideoSections.update(new XY(+e.target.value, rowCols.y)) }} />
                    </div>
                    <div className="form-group">
                        <span>Rows</span>
                        <input className="form-field" type="number" name="myInput" value={rowCols.y} onChange={(e) => { if (validate(e)) eventEmitterService.croppedVideoSections.update(new XY(rowCols.x, +e.target.value)) }} />
                    </div>
                </div>
                <div className="mb-3">
                    <VideoCropper rowCols={rowCols} eventEmitterService={eventEmitterService}></VideoCropper>
                </div>
                <div className="footer ms-auto mt-auto ">
                    <UiButton className="me-2" onClick={skip} style="accent" size="lg">Skip</UiButton>
                    <UiButton onClick={skip} disabled={selectedSection == null} style="accent" size="lg">Confirm</UiButton>
                </div>
            </div>
        </>
    )
}