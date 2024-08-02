const emailValidator = (email) => {
    // Simple regex pattern for validating email addresses
    const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexPattern.test(email);
  };

const passwordValidator = (pass)=>{
    const regexPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.*[a-zA-Z]).{8,}$/ ;
    return regexPattern.test(pass);
}

const nameValidator = (name)=>{
    const regexPattern =/^[A-Za-z]+$/;
    let words = name.trim().split(/\s+/);
    return words.length === 2 && words.every(word => regexPattern.test(word));
}

export const validatorMap = {
    name:{validator:nameValidator,error:"Should be exactly two names"},
    email:{validator:emailValidator,error:"Invalid Email Format"},
    password:{validator:passwordValidator,error:`Password should be at least 8 \n
                                                 Should have at least one uppercase letter \n
                                                 Should have at least one lowercase letter \n
                                                 Should have one special character .`}
}

