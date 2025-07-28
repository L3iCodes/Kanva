import { X, ChevronRight } from 'lucide-react'
import { TaskCard, SubTaskCard } from './Card'
import { useState, useRef } from 'react'

export default function TaskDetail({task_detail, onTaskDetail, board, dispatch}){
    console.log(board)
    const { section_index, task_index } = task_detail;
    const task = board.sections[section_index].tasks[task_index];
    
    const addTaskRef = useRef();
    const [toggleAddTask, setToggleAddTask] = useState(false)
    const [newTask, setNewTask] = useState('')
    const addSubTask = () =>{
        setToggleAddTask(false)
        setNewTask('')

        dispatch({
            type: 'ADD_SUBTASK',
            payload: {
                section_index: section_index,
                task_index: task_index,
                taskName: newTask
            }
        })
    }

    const handleAddTask = (e) => {
        setToggleAddTask(true)

        setTimeout(() => {
            addTaskRef.current?.focus();
            addTaskRef.current?.select();
        }, 0)
    }

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
                        value={task.task_name}
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

                    <div className='flex flex-col mt-2 border-1 rounded-[10px] overflow-auto'>
                        <h2 className='w-full bg-secondary/10 p-1'>Subtasks</h2>
                        
                        <div className='flex flex-col w-full'>
                            {task.checklist.map((subTask, index) => (
                                <SubTaskCard 
                                    key={index}
                                    section_index={section_index}
                                    task_index={task_index}
                                    subTask_index ={index}
                                    title={subTask.sub_task}
                                    status={subTask.done}
                                    enableTaskMenu={true}
                                    dispatch={dispatch}
                                    className={'!ml-0 !rounded-none border-1 border-secondary/10 hover:border-accent'}
                                />
                            ))}
                            
                            {/* ADD SUB TASK BOT */}
                            <div className={`w-full h-fit border-2 border-accent p-2 bg-primary rounded-[5px] text-secondary text-[12px]
                                            ${toggleAddTask ? 'flex' : 'hidden'}`}>
                                <input 
                                    type="text" 
                                    ref={addTaskRef}
                                    placeholder="Task Name"
                                    value={newTask}
                                    onChange={(e) => {
                                        setNewTask(e.target.value)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addSubTask();
                                        }
                                    }}
                                    className="w-full"
                                />
                                <button
                                    onClick={addSubTask} 
                                    className="px-2 bg-accent/80 rounded-[5px] text-primary cursor-pointer
                                            hover:bg-accent/100"
                                            >Save
                                </button>
                            </div>

                            <SubTaskCard 
                                onClick={handleAddTask}
                                enableTaskMenu={false}
                                title={'+ Add Task'}
                                className={`!ml-0 !rounded-none border-1 border-secondary/10 text-secondary/60 cursor-pointer
                                            hover:bg-secondary/5`}
                                status={null}
                            />
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}