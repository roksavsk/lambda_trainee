import express from 'express';
import jsonp from 'body-parser';

import routes from './routes/routes';

const app = express();
const port = 3000;
const { json } = jsonp;

app.use(json());
app.use('/', routes);

app.get('/', async (req, res) => {
    res.send('Welcome to clinic locator!');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
