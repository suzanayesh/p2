import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import createError from 'http-errors';
import logger from 'morgan';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import './config.js';
import dataSource from './db/dbconfig.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
const suzanfile = fileURLToPath(import.meta.url);
const suzanname = path.dirname(suzanfile);
dotenv.config();
const app = express();
const PORT = 3000;
app.use(cors({
    origin: "http://localhost:3000"
}));
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });
app.use("/uploads", express.static(path.join(suzanname, "uploads")));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(500).send("Failed Upload File!");
        return;
    }
    const fileURL = req.file.destination + req.file.filename;
    res.send({
        message: 'File Uploaded Successfully!',
        file: fileURL
    });
});
app.get('/file', (req, res) => {
    const fileName = req.query.name?.toString() || '';
    try {
        const data = fs.readFileSync('uploads/' + fileName, 'utf-8');
        const JSONData = JSON.parse(data);
        res.send(JSONData);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500).send(err);
});
dataSource.initialize().then(() => {
    console.log("Connected to DB!");
}).catch(err => {
    console.error('Failed to connect to DB: ' + err);
});
app.listen(PORT, () => {
    logger(`App is listening on port ${PORT}`);
    console.log(`App is listening on port ${PORT}`);
    // initDB();
});
export default app;
