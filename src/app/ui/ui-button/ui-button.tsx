import './ui-button.css';

export function UiButton({ children, onClick }: { children: any , onClick?: ()=>void}) {
    return (
        <>
            <div className="button-style" onClick={onClick}>{children}</div>
        </>
    )
}   