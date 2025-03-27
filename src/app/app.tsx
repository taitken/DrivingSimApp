import { createRoot } from 'react-dom/client';
import './app.css';
import { Button } from 'react-bootstrap/esm';
import Content from './content/content';

const root = createRoot(document.body);
root.render(
    <div>
        <Content></Content>
        <Button>Test Button label</Button>
    </div>
);