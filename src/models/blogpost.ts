import{postArray} from '../middleware/authRouter';

class blogPost{
    postId:number=0;
    createdDate:string=""; // toJSON?
    title: string="";
    content:string="";
    userId:string="";
    headerImage:string="";
    lastUpdated:string=""; // toJSON?

    //checks for the two required fields
    validPost(){
        if(this.title.length > 0 && this.content.length){
            return true;
        }else{
            return false;
        }   
    }

    //creates and returns new post
    createPost(userId:string){
        let now = new Date();
        let postId = 0;
        this.createdDate = now.toJSON();
        this.lastUpdated = now.toJSON();
        this.userId = userId;
        for(let per of postArray){
            if(per.postId == postId){
                postId++;
            }
        }
        this.postId = postId;
        return this;
    }

    displayPost(){
        return this;
    }
    
}
export {blogPost};