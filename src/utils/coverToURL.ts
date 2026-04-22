export const coverToURL = (coverName:string) =>{
    return coverName ? `${process.env.BASE_URL}/images/covers/${coverName}` : ''
}