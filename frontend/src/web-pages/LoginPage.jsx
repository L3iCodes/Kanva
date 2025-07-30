import { EyeClosed, Eye, Mail } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

export default function LoginPage(){
    const [showPassword, setShowPassword] = useState(true)
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate()
    const location = useLocation();
    const { login } = useAuth();

    const handleSignUp = () => navigate('/sign-up')
    const handlePassword = () => setShowPassword(state => !state)
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData(e.target);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        }

        const result = await login(credentials)

        if(result.success){
            setMessage({ message: 'Login successful!', success: true });
            navigate('/')
        }else{
            setMessage({ message: result.message, success: false });
        }

        setIsLoading(false);
    }


    return(
        <div className="pageWrapper h-full items-center justify-center">
            <form
                onSubmit={handleLogin}
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
                
                <p className={`${!message && 'opacity-0'} mt-2 self-end cursor-none font-bold ${message && message.success ? 'text-green-400' : 'text-red-400'}`}>{message && (message.message)}</p>
                
                <button 
                    type='submit'
                    className={`p-2 rounded-[5px] w-full text-secondary font-bold bg-accent/80 cursor-pointer mt-8 
                                hover:bg-accent/100 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
                    >{isLoading ? 'Logging in...' : 'Login'}
                </button>
                
                <p className="mt-10">Don't have an account? <span onClick={handleSignUp}className="text-accent hover:font-bold cursor-pointer">Register now!</span></p>

            </form>
        </div>
    )
}