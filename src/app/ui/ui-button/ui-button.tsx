import './ui-button.css';

export function UiButton({ children }: { children: any }) {
    return (
        <>
            <div className="button-style">{children}</div>
        </>
    )
}   