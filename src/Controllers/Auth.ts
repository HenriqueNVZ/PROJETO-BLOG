import { RequestHandler,Response } from "express";
import {z} from 'zod';
import {createUser, verifyUser} from '../services/User'
import { createToken } from "../services/auth";
import { ExtendedRequest } from "../Types/extended-request";

export const signup:RequestHandler = async (req,res) => {
    const schema = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string()
    });
    const data = schema.safeParse(req.body);
    if(!data.success){
        res.json({ error: data.error.issues });
        return;
    }

    const newUser = await createUser(data.data);
    if(!newUser){
        res.json({error: 'ERRO ao criar usuario'});
        return;
    }
    const token = createToken(newUser);

    res.status(201).json({
        user:{
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        },
        token:token
    })
}

export const signin:RequestHandler = async (req,res) => {
    const schema = z.object({
        email:z.string().email(),
        password:z.string(),
    })
    const data = schema.safeParse(req.body);
    if(!data.success){
        res.json({ error: data.error.issues });
        return;
    }

    const user = await verifyUser(data.data)
    if(!user){
        res.json({error:"Acesso negado"});
        return;
    }
    const token = createToken(user)
    
    res.status(201).json({
        user:{
            id: user.id,
            name: user.name,
            email: user.email,
        },
        token
    })

}

// Retorna os dados do usuário autenticado, já validados pelo middleware via JWT e consulta ao banco
export const validate = (req:ExtendedRequest, res:Response) => {
    res.json({user: req.user});
}