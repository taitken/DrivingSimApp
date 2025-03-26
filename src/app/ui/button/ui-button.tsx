import { BackendService } from '../../../services/backend.service';
import './ui-button.css'; 6

export default function UiButton({ children }: { children: any }) {
    let backendService: BackendService = new BackendService();

    function sendHttp(){
        backendService.sendAxios();
    }

    return (
        <>
            <div className="button-style p-5" onClick={sendHttp}>{children}</div>
        </>
    )
}   