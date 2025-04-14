import { useEffect } from 'react';
import './ui-button.css';

interface UiButtonInterface {
    children: any,
    style?: 'default' | 'accent',
    disabled?: boolean,
    onClick?: (...args: []) => void
}

export function UiButton({ children, style = 'default', disabled = false, onClick }: UiButtonInterface) {

    return (
        <>
            <button disabled={disabled} className={"button-style " + style} onClick={onClick}>{children}</button>
        </>
    )
}   