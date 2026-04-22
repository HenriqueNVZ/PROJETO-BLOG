import {Router} from 'express';
import * as controllerMain from '../Controllers/ControllerMain';

export const mainRoutes = Router();

mainRoutes.get('/ping',(req,res) => {
    res.json({pong:true});
})

mainRoutes.get('/posts', controllerMain.getAllPosts);
mainRoutes.get('/posts/:slug', controllerMain.getPost);
mainRoutes.get('/posts/:slug/:related', controllerMain.getRelatedPosts);