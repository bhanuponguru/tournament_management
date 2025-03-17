import {React,useState} from 'react'
import axios from 'axios';
import {Navigate} from "react-router-dom";
import {useCookies} from 'react-cookie';
const Login = () => {
    const [onLogin,setOnLogin] = useState(true);
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [name,setName] = useState("");
    const [error,setError] = useState("");
    const [message,setMessage] = useState("");
    const [cookies,setCookie,removeCookie] = useCookies(["token"]);
    console.log(cookies);
    if(cookies.token){
        return <Navigate to="/" />
    }
    const handleLogin = () => {
        const base_url = process.env.REACT_APP_baseUrl;
        const url = base_url + "/login";
        axios.post(url, {
            email: email,
            password: password
        }).then((response) => {;
            setCookie('token',response.data.access_token);
        }).catch((error) => {
            console.log(error);
            setError("Invalid Credentials");
        })
        setEmail("");
        setPassword("");
    }
    const hadleSignup = () => {
        const base_url = process.env.REACT_APP_baseUrl;
        const url = base_url + "/register";
        axios.post(url, {
            email: email,
            password: password,
            name: name
        }).then((response) => {
            setMessage(response.data.message);
            localStorage.setItem('token', response.data.token);
        }).catch((error) => {
            console.log(error);
            setError(error);
        })
        setEmail("");
        setName("");
        setPassword("");
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className = " w-1/5 border rounded-lg p-4 ">
                <div className = "flex flex-row justify-between" >
                    <div onClick={() => {setOnLogin(true);setError('')}}  className={`flex justify-center w-[50%] cursor-pointer  ${onLogin ? "bg-blue-400 hover:bg-blue-500" : "bg-gray-100 hover:bg-gray-200"}` } >
                        Login
                    </div>
                    <div onClick={() => {setOnLogin(false);setError('')}}  className={`flex justify-center w-[50%] cursor-pointer  ${onLogin ? "bg-gray-100 hover:bg-gray-200" : "bg-blue-400 hover:bg-blue-500"}`} >
                        SignUp
                    </div>
                </div>
                <div>
                    {message ? <div className="text-center text-green-500">{message}</div> : ""}
                    {error ? <div className="text-center text-red-500">{error}</div> : ""}
                </div>
                {onLogin ? 
                (<div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold">Login</h1>
                    <div>
                        <div className="m-2" >
                            <label className="mx-1" htmlFor="email">Email</label>
                            <input value={email} onChange= {(e) => {setEmail(e.target.value)}} className="border rounded-lg px-1 my-1 w-full" type="email" id= "email" placeholder="Email" />
                        </div>
                        <div className="m-2" >
                            <label className="mx-1" htmlFor="password">Password</label>
                            <input value={password} onChange= {(e) => {setPassword(e.target.value)}} className="border rounded-lg px-1 my-1 w-full" id="password" type="password" placeholder="Password" />
                        </div>
                        <button onClick={handleLogin} className="text-center w-full mx-1 p-1 rounded-full hover:bg-blue-400 my-2 bg-blue-300">Login</button>
                    </div>
                </div>) 
                : (<div className="flex flex-col items-center" >
                    <h1 className="text-lg font-bold" >SignUp</h1>
                    <div>
                        <div className="m-2" >
                            <label  className="mx-1" htmlFor="email">Email</label>
                            <input value={email} onChange= {(e) => {setEmail(e.target.value)}} className="border rounded-lg px-1 my-1 w-full" type="email" id= "email" placeholder="Email" />
                        </div>
                        <div className="m-2" >
                            <label className="mx-1" htmlFor="name">Name</label>
                            <input value={name} onChange= {(e) => {setName(e.target.value)}} className="border rounded-lg px-1 my-1 w-full" id="name" type="name" placeholder="Name" />
                        </div>
                        <div className="m-2" >
                            <label className="mx-1" htmlFor="password">Password</label>
                            <input value={password} onChange= {(e) => {setPassword(e.target.value)}} className="border rounded-lg px-1 my-1 w-full" id="password" type="password" placeholder="Password" />
                        </div>
                        <button onClick={hadleSignup} className="text-center w-full mx-1 p-1 rounded-full hover:bg-blue-400 my-2 bg-blue-300" >Signup</button>
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default Login
