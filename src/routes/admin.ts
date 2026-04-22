import {Router} from 'express';
import * as AdminController from '../Controllers/Admin';
import {privateRoute} from '../Middlewares/private-routes';
import {upload} from '../libs/multer';

export const adminRoutes = Router();
//TODAS AS ROTAS DA ARÉA ADMIN SÓ PODEM SER ACESSADAS SE ESTIVEREM LOGADAS:ISSO OCORRE ATRA´VES DA PRIVATEROUTE(MIDDLEWARE DE TOKE JWT)

//Rota para Adicionar um post
adminRoutes.post('/posts', privateRoute, upload.single('cover'), AdminController.addPost);
//Rota para pegar varios posts
adminRoutes.get('/posts',privateRoute,AdminController.getPost);
//Rota para pegar 1 post
adminRoutes.get('/posts/:slug',privateRoute,AdminController.getPost);
//Rota para editar um post
adminRoutes.put('/posts/:slug',privateRoute,upload.single('cover'),AdminController.editPost);
//Rota para excluir um post
adminRoutes.delete('/posts/:slug',privateRoute,AdminController.removePost);