const express = require('express');
const path = require('path');

const routes = require('./routes');

const app = express();
const port = process.env.PORT || 5000;

app.use('/static', express.static(path.join(__dirname, 'public')));

// app.use(
//     express.urlencoded({
//         extended: true,
//     }),
// );
// app.use(express.json());

routes(app);

app.listen(port, () => {
    console.log(`Backend CodeLearn listening on http://localhost:${port}`);
});
