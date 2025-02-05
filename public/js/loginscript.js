const isNotLoggedIn = async ()=>{
    document.getElementById("Login").innerHTML = "<a href='login.html'>Login</a>"
}

const isLoggedIn = async ()=>{
    document.getElementById("Login").innerHTML = "<a href='/logout'>Logout</a>"
}

isNotLoggedIn();