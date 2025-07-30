import { EyeClosed, Eye, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;

    const [showPassword, setShowPassword] = useState(true)
    const handlePassword = () => setShowPassword(state => !state)
    const navigate = useNavigate()
    const handleLogin = () => navigate('/login')

    const [message, setMessage] = useState()
    
    const handleSignUp = (e) => {
        e.preventDefault(); 

        const formData = new FormData(e.target);
        const newAccount = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
        }
        console.log(newAccount)

        fetch(`${BACKEND_URL}/sign-up`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newAccount)
        })
            .then(res => res.json())
            .then(data => {
                setMessage(data)

                if(!data.success){
                    e.target.username.value = ''
                    e.target.email.value = ''
                }else{
                    e.target.reset()
                }
            
            })

        .catch(err => (console.log(err)))
    }

    return(
        <div className="pageWrapper h-full items-center justify-center">
            <form
                onSubmit={handleSignUp}
                className="flex flex-col items-center w-[90%] max-w-[400px] p-5 bg-secondary/10 rounded-[10px] text-secondary"    
            >
                <h1 className="text-4xl text-accent font-bold self-start">Sign Up</h1>
                
                <label 
                    className="text-[12px] mt-10 mr-auto" 
                    htmlFor="username"
                    >Username
                </label>

                <div className="flex w-full p-1 border-1 rounded-[5px]">
                    <input
                        className="w-full p-1 text-[12px]"
                        id="username"
                        name="username" 
                        type="text"
                        required={true}
                    />
                    <User />
                </div>

                <label 
                    className="text-[12px] mt-4 mr-auto" 
                    htmlFor="email"
                    >Email
                </label>

                <div className="flex w-full p-1 border-1 rounded-[5px]">
                    <input
                        className="w-full p-1 text-[12px]"
                        id="email"
                        name="email" 
                        type="text"
                        required={true}
                    />
                    <Mail />
                </div>
                
                <label 
                    className="text-[12px] mt-4 mr-auto" 
                    htmlFor="password"
                    >Password
                </label>
                
                <div className="flex w-full p-1 border-1 rounded-[5px]">
                    <input
                        className="w-full p-1 text-[12px]"
                        id="password"
                        name="password" 
                        required={true}
                        type={showPassword ? 'text' : 'password'}
                    />
                    {showPassword 
                        ? (<Eye onClick={handlePassword}/>)
                        : (<EyeClosed onClick={handlePassword}/>) }
                </div>
                
                <p className={`${!message && 'opacity-0'} mt-2 self-end cursor-none font-bold ${message && message.success ? 'text-green-400' : 'text-red-400'}`}>{message && (message.message)}</p>
                
                <button 
                    type='submit'
                    className="p-2 rounded-[5px] w-full text-secondary font-bold bg-accent/80 cursor-pointer mt-8 
                                hover:bg-accent/100"
                    >Sign Up
                </button>
                

                <p className="mt-10">Already have an account? <span onClick={handleLogin}className="text-accent hover:font-bold cursor-pointer">Login</span></p>

            </form>
        </div>
    )
}