import './ui-button.css';

export function UiButton({ children, onClick }: { children: any , onClick?: (...args:[]) => void}) {
    return (
        <>
            <div className="button-style" onClick={onClick}>{children}</div>
        </>
    )
}   