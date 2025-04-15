import { useEffect } from 'react';
import './ui-button.css';

interface UiButtonInterface {
    children: any,
    style?: 'default' | 'accent',
    className?: string,
    disabled?: boolean,
    size?: 'lg' | 'md' | 'sm'
    onClick?: (...args: []) => void
}

export function UiButton({ children, style = 'default', className, disabled = false, size = 'md', onClick,  }: UiButtonInterface) {

    return (
        <>
            <button disabled={disabled} className={"button-style " + style + " " + size + " " + className} onClick={onClick}>{children}</button>
        </>
    )
}   