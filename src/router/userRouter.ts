import express from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../models/user';
import {authRoute} from '../middleware/authRouter';
import {userArray} from '../middleware/authRouter';

let userRoute = express.Router();

/* 
1. Returns userArray and status 200
2. Bad Token response
3. Error if not logged in
*/
userRoute.get("/", authRoute, (req,res,next)=>{
    res.status(200).send(userArray.map(user=>user.GetPasswordlessUser()));
});

/*
1. create new user 
2. bad email checker 
3. doesn't allow duplicates 
*/
userRoute.post('/', (req,res,next)=>{
    if(userArray.find(user => user.userId == req.body.userId)){
        res.status(409).send({message:'UserId already in use',status:409});
    }else{
        let sentUser = new User();
        Object.assign(sentUser, req.body);
        if(sentUser.CompleteUser()){ //sentUser.hasOwnProperty("emailAddress")
            if(sentUser.validateEmail()){ //return false if email valid
                res.status(406).send({message:"Bad Email Address", status:406});
            }else{
                userArray.push(sentUser);
                res.status(201).send(sentUser.GetPasswordlessUser());
            }
        }else{
            res.status(406).send({message:'All properties are required for a new user: userId,firstName,lastName,emailAddress, password',status:406});
        }
    }
});

// Returns the user record requested
userRoute.get("/:userId", authRoute, (req,res,next)=>{
    let user = userArray.find(user => user.userId == req.params.userId);
    if(user){
        res.status(200).send(user.GetPasswordlessUser());
    }else{
        res.status(404).send({message:'User not found',status:404});
    }
});

// Login that returns signed jwt
userRoute.get("/:userId/:password", (req,res,next)=>{
    let user = userArray.find(user => user.password == req.params.password && user.userId == req.params.userId);
    if(user){
        let pwdLess = user.GetPasswordlessUser();
        console.log(pwdLess);
        let token = jwt.sign({
            "UserData": pwdLess
        }, 'bigFoot', { subject: req.params.userId });
        res.status(200).send({token: token});
    }else{
        res.status(401).send({message:'Bad username or password',status:401});
    }  
});

/*
1. Update existing user
2. User not found
3. Error for bad email (bad data)
*/
userRoute.patch("/:userId", authRoute, (req,res,next)=>{
    let user = userArray.find(user => user.userId == req.params.userId);
    if(user){
        if(user.validateEmail()){
            res.status(406).send({message: "Bad Email Address", status: "406"});
        }else{
            delete req.body.userId;
            Object.keys(user).forEach(function(key) {
                if(req.body.hasOwnProperty(key)){ 
                    (user as any)[key] = req.body[key];
                }
            });
            res.status(200).send(user.GetPasswordlessUser());
        }
    }else{
        res.status(404).send({message:'User not found',status:404});
    }
});

/* 
1. Deletes a given a user 
2. throw error if user not found 
3. throw error if not logged in 
*/
userRoute.delete("/:userId", authRoute, (req,res,next)=>{
    let user = userArray.find(user => user.userId == req.params.userId);
    if(user){
        userArray.splice(userArray.indexOf(user),1);
        res.status(204).send({message:'User deleted'});//I dont think status is needed here, maybe not message either
    }else{
        res.status(404).send({message:'User not found',status:404});
    }
});

export {userRoute};
//Prisma lecture 12