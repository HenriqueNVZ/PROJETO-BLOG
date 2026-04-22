import { User } from "@prisma/client";
import { createJWT, readJTW } from "../libs/jwt";
import { tokenPayload } from "../Types/token-payload";
import { getUserById } from "./User";
import {Request} from 'express'

export const createToken = (user:User) => {
    return createJWT({
        id:user.id,
    })
}

//Verifica se o usuario tem o token de acesso para a requisição
export const verifyRequest = async (req:Request) => {
    //Receber o token do header authorization Bearer token
    const { authorization } = req.headers;
    //Se o token existir
    if(authorization){
        //Separar o Token de "Bearer " retornando um array: ["","token"]
        const authSplit = authorization.split('Bearer ');
        //Se o token extraido existir retorna payload(dados minimos do user)
        if(authSplit[1]){
            const payload = readJTW(authSplit[1]);
            //Se o payload foi retornado pegar o id desse Payload e busca o usuario no banco de dados
            if(payload){
                const userId = (payload as tokenPayload).id;
                const user = await getUserById(userId);
                if(user) return user;
            }
        }
    }
    return false;
}


