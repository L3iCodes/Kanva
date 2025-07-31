import { ChevronDown, LogIn } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Header(){
    const { user } = useAuth()
    const navigate = useNavigate()

    return(
        <div 
            className="flex flex-row items-center h-[50px] py-5 px-3 gap-3 bg-secondary text-primary">
            <h1 className="font-bold text-2xl ml-[50px] md:ml-[0px]">kanva</h1>
            
            {user ? 
                (
                    <div className='flex w-full justify-end items-center gap-2'>
                        <div className='w-[30px] h-[30px] rounded-full bg-accent' />
                        <p className='text-[12px]'>{user.username}</p>
                        <ChevronDown className='icon' />
                    </div>
                )
                :
                (
                    <div 
                        onClick={() => navigate('/login')} 
                        title='Login' 
                        className='flex ml-auto items-center hover:bg-accent px-1 rounded-[5px] cursor-pointer text-[14px]'
                        >Login<LogIn className='ml-1 icon'/></div>
                )
            }
            
            
        </div>
    )
}