import express from 'express';
import { json } from 'body-parser';

import routes from './routes/routes';

const app = express();
const port = 3000;

app.use(json());
app.use('/storage', routes);

app.get('/', (req, res) => {
    res.send('Welcome to JSON storage!');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
