import { useEffect, useState } from "react";
import { CalibrationFilePicker } from "../../../../shared-components/calibration-file-picker/calibration-file-picker";
import { UiButton } from "../../../../ui/ui-button/ui-button";
import { ServiceProvider } from "../../../../../services/service-provider.service";
import { CalibrationTestingSteps } from "../../../../../services/calibration-testing.service";


export function CalibrationTestingFilePicker() {
    const [selectedFile, setSelectedRow] = useState(null)

    function onHomographyRowSelect(selectedRow) {
        setSelectedRow(selectedRow.fileName);
    }

    function confirmSelection() {
        if(!!selectedFile)
        {
            ServiceProvider.calibrationTestingService.selectedHomographyFile.update(selectedFile);
            ServiceProvider.calibrationTestingService.stepEmitter.update(CalibrationTestingSteps.PICK_VIDEO);
        }
    }

    return (
        <>
            <CalibrationFilePicker onSelectFile={onHomographyRowSelect}></CalibrationFilePicker>
            <div className='mt-3 w-25'>
                <UiButton style="accent" disabled={!selectedFile} onClick={confirmSelection}>Confirm</UiButton>
            </div>
        </>
    )
}