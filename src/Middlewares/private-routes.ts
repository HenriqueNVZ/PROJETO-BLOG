import { NextFunction,Request,Response } from "express";
import { verifyRequest } from "../services/auth";
import { ExtendedRequest } from "../Types/extended-request";


export const privateRoute = async (req: ExtendedRequest,res:Response,next:NextFunction) => {
    const user = await verifyRequest(req);
    //Verifica se o usuario buscado no banco por verifyRequest existe
    if(!user){
        res.status(401).json({error:"Acesso Negado!"});
        return;
    }
    //Se existir libera o acesso a rota e envia o usuario que está acessando
    //O type Request não aceita esse req.user por isso alteramos ele
    req.user = user;
    next()
}