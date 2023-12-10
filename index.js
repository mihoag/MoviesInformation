require('dotenv').config();
const express = require('express')
const app = express();
const fs = require('fs/promises')
const path = require('path')
const renderTemplate = require('./21457')
const route = require('./routes')
//const route = require('./routes')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.engine('html', async (filePath, options, callback) => { // define the template engine
    let content = await fs.readFile(filePath, { encoding: 'utf-8' });

    let render = renderTemplate(content, options);
    return callback(null, render);
})

app.set('views', './views');
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')))


app.use((err, req, res, next) => {
    const statusCode = err.statusCode | 500;
    res.status(statusCode).send(err.message)
})
route(app);

const PORT_SERVER = process.env.PORT_SERVER || 3000
app.listen(PORT_SERVER);
