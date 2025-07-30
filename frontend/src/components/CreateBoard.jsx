import { X } from 'lucide-react';
import { useState } from 'react';

export default function CreateBoard( {modalOpen = false, onClose} ){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;

    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target);
        const boardData = {
            title: formData.get('boardName'),
            desc: formData.get('boardDescription'),
            owner: '123'
        }
        
        fetch(`${BACKEND_URL}/kanban/create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(boardData)
        })  
            .then(res => {
                if(!res.ok){
                    console.log(`Error creating new board`);
                    return;
                }
                setIsLoading(false);
                e.target.reset();
                onClose()
            })
            .catch(error => console.log(`Something went wrong: ${error}`))
    }

    return(
        <>
            <div 
                className={` ${modalOpen ? 'flex' : 'hidden'} items-center justify-center top-0 left-0 h-full w-full bg-accent/30 backdrop-blur-[5px] absolute z-20`}
            >
                <form
                    onSubmit={handleSubmit} 
                    className="flex flex-col w-[300px] h-fit bg-primary p-5 rounded-[10px]">
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
                        name="boardName" 
                        type="text"
                        required={true}
                    />

                    <label 
                        className="text-[12px] mt-5"
                        htmlFor="boardDesc"
                        >Description
                    </label>

                    <textarea
                        className="w-full border-1 rounded-[5px] p-1 text-[12px]" 
                        id="boardDesc" 
                        name="boardDescription"
                        type="text"
                    />

                    <button 
                        type='submit'
                        disabled={isLoading}
                        className="p-2 rounded-[5px] text-primary font-bold bg-accent/80 cursor-pointer mt-5
                                   hover:bg-accent/100"
                        >{isLoading ? 'Creating...' : 'Create'}
                    </button>
                </form>
            </div>
        </>
    )
}