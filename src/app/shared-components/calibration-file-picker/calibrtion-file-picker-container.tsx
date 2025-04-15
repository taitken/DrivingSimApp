import { useEffect, useState } from 'react';
import { UiButton } from '../../ui/ui-button/ui-button';
import { CalibrationFilePicker } from './calibration-file-picker';
import { BaseContentService } from '../../../services/base-content.service';


export function CalibrationFilePickerContainer({ eventEmitterService }: { eventEmitterService: BaseContentService }) {
    const [selectedFile, setSelectedRow] = useState(null)

    function onHomographyRowSelect(selectedRow) {
        setSelectedRow(selectedRow.fileName);
    }

    function confirmSelection() {
        if (!!selectedFile) {
            eventEmitterService.selectedHomographyFile.update(selectedFile);
            eventEmitterService.nextStep();
        }
    }

    return (
        <>
            <div className="content-container">
                <h3 >Select Homography File</h3>
                <p>Please select a homography file that was created in the 'Calibration Creation' process. This file contains instructions to the analytics process of how video file pixels map to real world distances.</p>
                <CalibrationFilePicker onSelectFile={onHomographyRowSelect}></CalibrationFilePicker>
                <UiButton size="lg" style="accent" className='mt-3 ms-auto' disabled={!selectedFile} onClick={confirmSelection}>Confirm</UiButton>
            </div>
        </>
    )
}