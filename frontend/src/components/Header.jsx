import { ChevronDown } from 'lucide-react';

export default function Header(){
    return(
        <div 
            className="flex flex-row items-center h-[50px] py-5 px-3 gap-3 bg-secondary text-primary">
            <h1 className="font-bold text-2xl ml-[50px] md:ml-[0px]">kanva</h1>
            
            <div className='flex w-full justify-end items-center gap-2'>
                <div className='w-[30px] h-[30px] rounded-full bg-accent' />
                <p className='text-[12px]'>Username</p>
                <ChevronDown className='icon' />
            </div>
            
        </div>
    )
}