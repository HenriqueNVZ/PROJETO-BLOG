import jwt from 'jsonwebtoken'

export const createJWT = (payload:any) =>{
    return jwt.sign(
        payload,process.env.JWT_KEY as string
    )
}

//Recebe o token e verifica se é válido e assinado por mim, se sim retorna payload
export const readJTW = (hash:string) =>{
    try{
        return jwt.verify(
            hash,
            process.env.JWT_KEY as string
        )
    }catch(error){
        return false;
    }
}
