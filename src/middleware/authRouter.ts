import express from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../models/user';
import{blogPost} from '../models/blogpost';

let userArray: User[] = [];
let postArray: blogPost[] = [];

let authRoute = express.Router();
authRoute.use('/:thisId', (req,res,next)=>{
    let user = userArray.find(user => user.userId == req.params.thisId);
    let intId = parseInt(req.params.thisId);
    let post = postArray.find(post => post.postId == intId);
    if(user){
        if(req.headers['authorization']){
            try{
                let token = jwt.verify(req.headers['authorization'].replace('Bearer', ''), 'bigFoot', { audience: req.params.thisId });
                // I think the audience option is working to verify that the user is the correct one for the request
                if(token){
                    var cont=true;
                }else{
                    cont=false; 
                }
            }catch{
                cont=false;
            }
        }else{
            cont=false;
        }
        if(cont){
            next();
        }else{
            res.status(401).send({message: 'Bad or Missing Token'});
        }
    }else if(post){
        if(req.headers['authorization']){
            try{
                let token = jwt.verify(req.headers['authorization'].replace('Bearer', ''), 'bigFoot', { audience: post.userId });
                // I think the audience option is working to verify that the user is the correct one for the request
                if(token){
                    var cont=true;
                }else{
                    cont=false; 
                }
            }catch{
                cont=false;
            }
        }else{
            cont=false;
        }
        if(cont){
            next();
        }else{
            res.status(401).send({message: 'Bad or Missing Token'});
        }
    }else{
        res.status(404).send({message:'Not found',status:404});
    }
});
authRoute.use('/', (req,res,next)=>{
    if(req.headers['authorization']){
        try{
            let token = jwt.verify(req.headers['authorization'].replace('Bearer', ''), 'bigFoot');
            if(token){
                // only checks that the authorization can be decoded, 
                // does not check that the token represents the correct user or session
                var cont=true;
            }else{
                cont=false; 
            }
        }catch{
            cont=false;
        }
    }else{
        cont=false;
    }
    if(cont){
        next();
    }else{
        res.status(401).send({message: 'Bad or Missing Token'});
    }
});

export {authRoute, postArray, userArray};