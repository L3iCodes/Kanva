import { EyeClosed, Eye, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage(){
    const [showPassword, setShowPassword] = useState(true)
    const handlePassword = () => setShowPassword(state => !state)
    const navigate = useNavigate()
    const handleSignUp = () => navigate('/sign-up')

    return(
        <div className="pageWrapper h-full items-center justify-center">
            <form
                className="flex flex-col items-center w-[90%] max-w-[400px] p-5 bg-secondary/10 rounded-[10px] text-secondary"    
            >
                <h1 className="text-4xl text-accent font-bold self-start">Login</h1>
                
                <label 
                    className="text-[12px] mt-10 mr-auto" 
                    htmlFor="username"
                    >Username / Email
                </label>

                <div className="flex w-full p-1 border-1 rounded-[5px]">
                    <input
                        className="w-full p-1 text-[12px]"
                        id="username"
                        name="username" 
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
                
                <p className='mt-2 self-end cursor-none text-red-400'>Incorrect credentials</p>
                
                <button 
                    type='submit'
                    className="p-2 rounded-[5px] w-full text-secondary font-bold bg-accent/80 cursor-pointer mt-8 
                                hover:bg-accent/100"
                    >Login
                </button>
                

                <p className="mt-10">Don't have an account? <span onClick={handleSignUp}className="text-accent hover:font-bold cursor-pointer">Register now!</span></p>

            </form>
        </div>
    )
}