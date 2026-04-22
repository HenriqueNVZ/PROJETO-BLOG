import { RequestHandler,Response,Request } from "express";
import { ExtendedRequest } from "../Types/extended-request";
import z, { safeParse } from 'zod';
import { createPost, createPostSlug, deletePost, getAllPost, getPostBySlug, handleCover, updatePost } from "../services/post";
import { getUserById } from "../services/User";
import { coverToURL } from "../utils/coverToURL";

export const getPost = async(req:ExtendedRequest,res:Response) => {
    const {slug} = req.params;
    const post = await getPostBySlug(slug);
    if(!post){
        res.json({error:'Post inexistente!'});
        return;
    }

    res.json({
        post:{
            id:post.id,
            title:post.title,
            createdAt:post.createdAt,
            cover:coverToURL(post.cover),
            authorName:post.author?.name,
            tags:post.tags,
            body:post.body,
            slug:post.slug
        }
    })

}
export const getPosts = async (req:ExtendedRequest,res:Response) => {
    //SE FOR ADMIN PEGAR TODOS OS POSTS, SE FOR ROTA PUBLICA PEGAR POST PUBLISHED
    let page = 1;
    if(req.query.page){
        page = parseInt(req.query.page as string);
        if(page <= 0){
            res.json({error:'Página inexistente'});
            return;
        }
    }

    let posts = await getAllPost(page);
    const postsToReturn = posts.map(post =>({
        id:post.id,
        status:post.status,
        title:post.title,
        createdAt:post.id,
        cover:coverToURL(post.cover),
        authorName:post.author?.name,
        tags:post.tags,
        slug:post.slug
    }))
    res.json({posts: postsToReturn,page});
}


export const addPost = async (req:ExtendedRequest,res:Response) => {
    if(!req.user) return;

    const schema = z.object({
        title:z.string(),
        tags:z.string(),
        body:z.string()
    });
    const data = schema.safeParse(req.body)
    if(!data.success){
        res.json({error:data.error.flatten().fieldErrors});
        return;
    }
    if(!req.file){
        res.json({error:'sem arquivo'});
        return;
    }
    //LIDAR COM O ARQUIVO
    const coverName = await handleCover(req.file)
    if(!coverName){
        return res.json({error:'imagem não enviada'})
    }
    //CRIAR SLUG
    const slug = await createPostSlug(data.data.title);
    //CRIAR POST
    const newPost = await createPost({
        authorId:req.user.id,
        slug,
        title:data.data.title,
        tags:data.data.tags,
        body:data.data.body,
        cover: coverName
    });
    //PEGAR INFO DO AUTOR
    const author = await getUserById(newPost.authorId);
    res.status(201).json({
        post:{
            id:newPost.id,
            slug:newPost.slug,
            title:newPost.title,
            createdAt:newPost.createdAt,
            cover:coverToURL(newPost.cover),
            tags:newPost.tags,
            authorName: author?.name
        }
    })
}

export const editPost = async (req:ExtendedRequest,res:Response) => {
    const {slug} = req.params
    
    const schema = z.object({
        status:z.enum(['PUBLISHED','DRAFT']).optional(),
        title:z.string().optional(),
        tags:z.string().optional(),
        body:z.string().optional(),   
    });
    
    const data = schema.safeParse(req.body)
    if(!data.success){
        res.json({error:data.error.flatten().fieldErrors});
        return;
    };
    
    //Verifica se o post existe
    const post = await getPostBySlug(slug);
    if(!post){
        res.json({error: 'Post inexistente'});
        return;
    }
    let coverName: string | false = false;
    if(req.file){
        coverName = await handleCover(req.file);
    }
    //ATUALIZAR O POST
    const updatedPost = await updatePost(slug,{
        updatedAt:new Date(),
        status:data.data.status ?? undefined,
        title:data.data.title ?? undefined,
        tags:data.data.tags ?? undefined,
        body:data.data.body ?? undefined,
        cover:coverName ?coverName : undefined
    });

    const author = await getUserById(updatedPost.authorId);

    res.json({
        post:{
            id: updatedPost.id,
            status: updatedPost.status,
            slug: updatedPost.slug,
            title: updatedPost.title,
            cretedAt:updatedPost.createdAt,
            cover:coverToURL(updatedPost.cover),
            tags:updatedPost.tags, 
            authorName:author?.name
        }
    })
}

export const removePost = async (req: ExtendedRequest,res:Response) => {
    const {slug} = req.params;
    const post = await getPostBySlug(slug);
    if(!post){
        res.json({error:"post inexistente"});
        return;
    }

    await deletePost(slug);
    res.json({error:null});
}


