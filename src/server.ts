import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { mainRoutes } from './routes/main';
import { authRoutes } from './routes/auth';
import { adminRoutes } from './routes/admin';

const server = express()

//Libera acesso a API por outros dominios
server.use(cors());
//Permite o servidor interpretar JSON
server.use(bodyParser.json());
//Processa dados de formularios
server.use(bodyParser.urlencoded({extended:true}));
//Expoe arquivos estaticos de public
server.use(express.static('public'));

server.use('/api/auth',authRoutes);
server.use('/api/admin',adminRoutes);
server.use('/api',mainRoutes);


server.listen(4444,() => {
    console.log('B7BLOG BACKEND RUNNING');
})