const isNotLoggedIn = async ()=>{
    document.getElementById("Login").innerHTML = "<a href='login.html'>Login</a><br><a href='register.html'>Register</a>"
}

const isLoggedIn = async ()=>{
    document.getElementById("Login").innerHTML = "<a href='/logout'>Logout</a>"
}

isNotLoggedIn();