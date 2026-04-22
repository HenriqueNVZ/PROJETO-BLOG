import { RequestHandler,Request,Response } from "express";
import { getPostBySlug, getPostWithSameTag, getPublishedPosts } from "../services/post";
import { coverToURL } from "../utils/coverToURL";

type Params = {
  slug: string;
};

export const getAllPosts: RequestHandler = async (req:Request,res:Response) =>{
    let page = 1;
    if(req.query.page){
        page = parseInt(req.query.page as string);
        if(page <=0){
            res.json({error:"Pagina inexistente"});
            return;
        }
    }
    let posts = await getPublishedPosts(page);
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


export const getPost: RequestHandler = async (req:Request,res:Response) =>{
    const {slug} = req.params;
        const post = await getPostBySlug(slug);
        
        if(!post || (post && post.status !== 'PUBLISHED')){
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
        });
}

export const getRelatedPosts: RequestHandler = async (req:Request,res:Response) =>{
    const {slug} = req.params;

    let posts = await getPostWithSameTag(slug);

    const postsToReturn = posts.map(post =>({
            id:post.id,
            title:post.title,
            createdAt:post.id,
            cover:coverToURL(post.cover),
            authorName:post.author?.name,
            tags:post.tags,
            slug:post.slug
        }));
        res.json({posts: postsToReturn});
}