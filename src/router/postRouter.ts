import express from 'express';
import jwt from 'jsonwebtoken';
import { authRoute } from '../middleware/authRouter';
import {postArray} from '../middleware/authRouter';
import {blogPost} from '../models/blogpost';

let postRoute = express.Router();

// Return array of posts
postRoute.get("/", (req,res,next)=>{
    res.status(200).send(postArray.map(post=>post.displayPost()));
});

// Create new post .todo
postRoute.post("/", authRoute, (req,res,next)=>{
    
    if(req.headers['authorization']){
        let token = jwt.verify(req.headers['authorization'].replace('Bearer', ''), 'bigFoot') as any;
        console.log({token});
        res.write('hello');
        let thisId = token.userData.userId;
        let newPost = new blogPost();
        Object.assign(newPost, req.body);
        if(newPost.validPost()){
            postArray.push(newPost.createPost(thisId));
            res.status(201).send(newPost);
        }else{
            res.status(406).send({message: "Missing title or content", status: 406});
        }
    }else{
        res.write(req.headers['authorization']);
        res.status(401).send({message: 'Bad or Missing Token'});
    }
});

postRoute.get("/:postId", (req,res,next)=>{
    let thisId = parseInt(req.params.postId);
    let post = postArray.find(post =>post.postId == thisId);
    if(post){
        res.status(200).send(post);
    }else{
        res.status(404).send({message: "Post not Found", status:404});
    }
});

// Update a post
postRoute.patch("/:postId", authRoute, (req,res,next)=>{
    let thisId = parseInt(req.params.postId);
    let post = postArray.find(post =>post.postId == thisId);
    if(post){
        let now = new Date();
        post.title = req.body.title;
        post.content = req.body.content;
        if(req.body.headerImage){
            post.headerImage = req.body.headerImage;
        }
        post.lastUpdated = now.toJSON();
        res.status(200).send(post);
    }else{
        res.status(404).send({message: "Post not Found", status: 404});
    }
});

// Delete a post
postRoute.delete("/:postId", authRoute, (req,res,next)=>{
    let thisId = parseInt(req.params.postId);
    let post = postArray.find(post =>post.postId == thisId);
    if(post){
        postArray.splice(postArray.indexOf(post), 1);
        res.status(204).send({message:"Post Deleted", status:204});
    }else{
        res.status(404).send({message: "Post not Found", status:404});
    }
});

postRoute.get("/User/:userId", (req,res,next)=>{
    //is this required? 
});

export {postRoute};