/*
This project was started with the Assignment2_Solution repo
*/

import express from 'express';
//import swaggerUI from 'swagger-ui-express';
//import fs from 'fs';
//import path from 'path';
//import cors from 'cors';
import {userRoute} from './router/userRouter';
import {postRoute} from './router/postRouter';
import cors from 'cors';

let app = express();
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
// let swagger_doc = fs.readFileSync(path.join(process.cwd(),'src','openapi.json));
// let swagger_obj = JSON.parse(swagger_doc.toString());

app.use('/Users', userRoute);
app.use('/Posts', postRoute);

//app.use('/', swaggerUI.serve, swagger.setup(swagger_obj));

app.listen(3000);