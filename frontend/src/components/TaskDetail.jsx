import { X, ChevronRight } from 'lucide-react'

export default function TaskDetail({section, task_detail, onTaskDetail}){
    console.log(task_detail)
    
    return(
        <div className="flex items-center justify-center top-0 left-0 h-full w-full absolute bg-primary/20 backdrop-blur-[5px] z-20">
            <div className="flex flex-col gap-5 w-[90%] h-[80%] bg-primary shadow-2xl shadow-secondary rounded-[10px] p-1
                            md:w-[80%]">
                
                <div className='flex items-center static right-0 justify-end'>
                    < X 
                        onClick={onTaskDetail}
                        className='w-[30px] h-[30px] p-1 rounded-[5px] cursor-pointer hover:bg-secondary/10' />
                </div>
                
                <div className='flex flex-col h-full gap-5 p-5 
                                md:px-[20%]'>
                    <textarea 
                        type="text"
                        value={task_detail.task_name}
                        className="w-full p-1 text-3xl line-clamp-2 resize-none rounded-[10px] hover:bg-secondary/10"
                    />

                    <div className='flex items-center gap-5'>
                        <h2>Status</h2>
                        <div className='flex items-center gap-2 px-2 border-1 border-secondary rounded-[5px] bg-accent/80 cursor-pointer
                                        hover:bg-accent'>
                            <h2 className='border-r-1 px-1'>Section</h2>
                            <ChevronRight className='w-[13px]'/>
                        </div>
                    </div>

                    <div className='flex flex-col mt-2'>
                        <h2>Subtasks</h2>
                        <div className='w-full h-[200px] border-1 bg-secondary/10 rounded-[10px]'>

                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}