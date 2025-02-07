const checkCredentials = async (functionA, functionB)=>{
    try{
        const response = await fetch("/checklogin");
        if(response.ok){
            if(response.status == 202)
            {
                functionA();
            } else{
                functionB();
            }

        } else{
            throw new Error(response.statusText);
        }
        
    } catch(error){
        console.error("Error", error);
    }

}

const isNotLoggedIn = async ()=>{
    document.getElementById("Login").innerHTML = "<a href='login.html'>Login</a><br><a href='register.html'>Register</a>"
}

const isLoggedIn = async ()=>{
    document.getElementById("Login").innerHTML = "<a href='/addtolist'>Add to List</a><br><br><a href='/logout'>Logout</a>"
}

checkCredentials(isLoggedIn, isNotLoggedIn);