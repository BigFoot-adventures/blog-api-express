class User{
    userId:string='';
    firstName:string='';
    lastName:string='';
    emailAddress:string='';
    password:string='';

    // Return true if all the properties are filled in
    CompleteUser(){
        if(this.userId.length > 0 && this.firstName.length > 0 && this.lastName.length > 0 && this.emailAddress.length > 0 && this.password.length > 0){
            return true;
        }else{
            return false;
        }
    }

    // Return a user without the password property
    GetPasswordlessUser(){
        let pwdLess = new User();
        Object.assign(pwdLess, this);
        let returnObj = <any>pwdLess; //why is returnObj necessary, should you be able to delete password on pwdless? maybe pwdless is a reference to orig obj
        delete returnObj.password;
        return returnObj;
    }

    //return false if email is valid
    validateEmail(){
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.emailAddress)){
            return false;
        }
        //bad email
        return true;
    }
}

export {User};