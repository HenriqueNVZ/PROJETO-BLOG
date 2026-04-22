import {Request} from 'express'
import {User} from '@prisma/client'


type UserWithoutPassword = Omit<User,"password">;
//Utilizado no middleware para retornar a rota os dados do usuario omitindo a senha
export type ExtendedRequest = Request &{
    user?: UserWithoutPassword;
}