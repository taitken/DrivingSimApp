import { useEffect, useState } from 'react';
import { ServiceProvider } from '../../../../services/service-provider.service';
import { UiButton } from '../../../ui/ui-button/ui-button';
import { CalibrationFilePicker } from '../../../shared-components/calibration-file-picker/calibration-file-picker';

export function VideoProcessingContent() {
    const [selectedRow, setSelectedRow] = useState(null);

    function selectHomopgrayFile(rowData: any) {
        setSelectedRow(rowData);
    }

    function processVideo() {
        if(selectedRow?.fileName)
        {
            ServiceProvider.backendService.processVideo(selectedRow.fileName).then((response) => {
                console.log(response)
            });
        }
    }

    return (
        <>
            <CalibrationFilePicker onSelectFile={selectHomopgrayFile}></CalibrationFilePicker>
        </>
    )
}