import { createRoot } from 'react-dom/client';
import './app.css';
import Content from './content/content';

const root = createRoot(document.body);
root.render(
    <div>
        <Content></Content>
    </div>
);