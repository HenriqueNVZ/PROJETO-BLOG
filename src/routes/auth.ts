import {Router} from 'express';
import * as authController from '../Controllers/Auth';
import { privateRoute } from '../Middlewares/private-routes';

export const authRoutes = Router();

authRoutes.post('/signup',authController.signup);
//Ao efetuar login recebemos um token JWT para validar nosso acesso ao APP, esse token deve ser colocado no header da req
authRoutes.post('/signin',authController.signin);
//Valida a sessão ao iniciar o APP com JWT no middleware 
authRoutes.post('/validate',privateRoute,authController.validate);
