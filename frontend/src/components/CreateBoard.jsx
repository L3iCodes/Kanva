import { X } from 'lucide-react';
import { useState } from 'react';

export default function CreateBoard( {modalOpen = false, onClose} ){

    return(
        <>
            <div 
                className={` ${modalOpen ? 'flex' : 'hidden'} items-center justify-center top-0 left-0 h-full w-full bg-accent/30 backdrop-blur-[5px] absolute z-20`}
            >
                <form className="flex flex-col w-[300px] h-fit bg-primary p-5 rounded-[10px]">
                    <div className='flex'>
                        <h2 className="font-bold">Create new board</h2>
                        <X 
                            onClick={onClose}
                            className='ml-auto bg-accent/80 rounded-[5px] text-primary cursor-pointer
                                      hover:bg-accent/100'
                        />
                    </div>
                    
                    <label 
                        className="text-[12px] mt-5" 
                        htmlFor="boardName"
                        >Board Name
                    </label>

                    <input
                        className="w-full border-1 rounded-[5px] p-1 text-[12px]"
                        id="boardName" 
                        type="text"
                        required={true}
                    />

                    <label 
                        className="text-[12px] mt-5"
                        htmlFor="boardDesk"
                        >Description
                    </label>

                    <textarea
                        className="w-full border-1 rounded-[5px] p-1 text-[12px]" 
                        id="boardDesk" 
                        type="text"
                    />

                    <button 
                        className="p-2 rounded-[5px] text-primary font-bold bg-accent/80 cursor-pointer mt-5
                                   hover:bg-accent/100"
                        >Create
                    </button>
                </form>
            </div>
        </>
    )
}