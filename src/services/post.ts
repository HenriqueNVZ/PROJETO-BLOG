import fs from 'fs/promises'
import {v4} from 'uuid'
import slug from 'slug'
import multer from 'multer';
import { prisma } from '../libs/prisma';
import { Prisma } from '@prisma/client';
import { ExtendedRequest } from '../Types/extended-request';

export const getPublishedPosts = async (page: number) => {
    let perPage = 5;
    if(page <= 0 ) return [];
    const posts = await prisma.post.findMany({
        where:{
            status:'PUBLISHED'
        },
        include:{
            author:{
                select:{
                    name:true
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        },
        take:perPage,
        skip:(page-1)*perPage
    });
    return posts;
}

export const getPostWithSameTag = async (slug:string) => {
    const post = await prisma.post.findUnique({
        where:{slug}
    });
    if(!post) return [];
    
    const tags = post.tags.split(',');
    if(tags.length === 0) return [];

    const posts = await prisma.post.findMany({
        where:{
            status:'PUBLISHED',
            slug :{not:slug},
            OR: tags.map(term =>({
                tags:{contains: term,mode:'insensitive'}
            }))
        },
        include:{
            author:{
                    select:{
                        name:true
                    }
                }
            },
        orderBy:{
            createdAt:'desc'
        },
        take:4
    })
    return posts;
}


export const getAllPost = async (page: number) => {
    let perPage = 5;
    if(page <= 0 ) return [];
    const posts = await prisma.post.findMany({
        include:{
            author:{
                select:{
                    name:true
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        },
        take:perPage,
        skip:(page-1)*perPage
    });
    return posts;
}


export const getPostBySlug = async (slug:string) => {
    return await prisma.post.findUnique({
        where:{slug},
        include:{
            author:{
                select:{
                    name:true
                }
            }
        }
    })
}

export const handleCover = async (file:Express.Multer.File) => {
    //Tipos de arquivos aceitos
    const allowed = ['image/jpeg','image/jpg','image/png'];
    //Verifica se a extensção do arquivo é aceita
    if(allowed.includes(file.mimetype)){
        //Nome = identificadorUnico.jpg
        const coverName = `${v4()}.jpg`;
        try{
            //Move o arquivo para public
            await fs.rename(
                file.path,
                `./public/images/covers/${coverName}`
            );
        }
        catch(error){
            return false;
        }
        return coverName;
    }
    return false;
}

export const createPostSlug = async(title:string) => {
    let newSlug = slug(title);
    let KeepTrying = true;
    let postCount = 1;

    while(KeepTrying){
        //Recebe o Post se tiver slug existente
        const post = await getPostBySlug(newSlug);
        if(!post){
            KeepTrying = false;
        }else{
            newSlug = slug(`${title} $(++postCount)`);
        }
    }
    return newSlug;
}

type CreatePostProps = {
    authorId:number,
    slug:string,
    title:string,
    tags:string,
    body:string,
    cover:string
}
export const createPost = async(data:CreatePostProps) =>{
    return await prisma.post.create({data});
}

export const updatePost = async(slug:string,data: Prisma.PostUpdateInput) =>{
    return await prisma.post.update({
        where:{slug},
        data
    })
}

export const deletePost = async(slug:string) =>{
    return await prisma.post.delete({where:{slug}})
}
