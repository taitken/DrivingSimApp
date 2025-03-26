import { createRoot } from 'react-dom/client';
import './app.css';
import UiButton from './ui/button/ui-button';

const root = createRoot(document.body);
root.render(
    <div>
        <h2 className="testClass">Hello from React!</h2>
        <UiButton>Test Button label</UiButton>
        <button id="testButton">test</button>
    </div>
);