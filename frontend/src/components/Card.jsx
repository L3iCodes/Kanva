import { use, useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import { CircleChevronDown, CircleChevronRight } from "lucide-react";
import { TaskCardMenu } from "./Menus";

export default function Card({ children, title, description, className, showProgressBar = false, onClick, onMouseEnter, onMouseLeave}){
    const [toggleMenu, setToggleMenu] = useState(false)
    
    return(
        <>
            <div 
                onClick={onClick}
                onMouseEnter={() => setToggleMenu(true)}
                onMouseLeave={() => setToggleMenu(false)}
                className={`${className} flex gap-2 flex-col h-[200px] bg-secondary/90 rounded-[10px] text-primary p-3 cursor-pointer relative
                            md:h-[250px]
                            hover:bg-secondary`}
            >
                {title && (<h2 className="font-bold md:text-2xl">{title}</h2>)}
                <p className="line-clamp-3">{description}</p>
                
                {children && toggleMenu && (
                    children  
                )}
                
                {showProgressBar && (<ProgressBar totalTask={10} doneTask={9} />) }
            </div>
        </>
    )
}

export function LoadingCard({ length }){
    const loadingCard = Array.from({ length }).map((_, index) => (
        <Card
            key={`placeholder_${index}`}
            className="animate-pulse"
            showProgressBar={false}
        />
    ));

    return <>{loadingCard}</>;
}

export function TaskCard({ section_index, task_index, task_details, section_list, dispatch, onTaskDetail, className}){
    
    // Sub task toggle control
    const [toggleCheckList, setToggleCheckList] = useState(false)

    // Task menu
    const [toggleTaskMenu, setToggleTaskMenu] = useState(false)
    const [toggleMoveMenu, setToggleMoveMenu] = useState(false)

    // Task Names
    const [taskName, setTaskName] = useState(task_details.task_name)
    const [disableChangeName, setDisableChangeName] = useState(true)
    const taskNameRef = useRef(null)

    const toggleRename = (e) => {
        e.stopPropagation();
        setDisableChangeName(false);

        setTimeout(() => {
            taskNameRef.current?.focus();
            taskNameRef.current?.select();
        }, 0)
    }

    const moveTask = (target) => {
        dispatch({
            type: 'MOVE_TASK',
            payload: {section_index:section_index, task_index:task_index, target_section:target}
        })
    }    

    const removeTask = (e) => {
        e.stopPropagation();
        dispatch({
            type: 'DELETE_TASK',
            payload: {section_index: section_index, task_index:task_index}
        })
    }

    return(
        <>
            <div className={`${className} flex flex-col gap-1`}>
                <div
                    onClick={onTaskDetail}
                    onMouseEnter={()=>setToggleTaskMenu(true)}
                    onMouseLeave={()=>(setToggleTaskMenu(false), setToggleMoveMenu(false))} 
                    className={`flex gap-3 flex-col bg-primary/80 rounded-[10px] text-secondary p-3 relative cursor-pointer
                                hover:border-1 border-accent`}
                >
                    {toggleTaskMenu && (
                        <TaskCardMenu 
                            section_list={section_list} 
                            task_index={task_index} 
                            current_section={section_index}
                            toggleMoveMenu = {toggleMoveMenu}
                            onToggleMoveMenu={(e) => {
                                setToggleMoveMenu(state => !state)
                                e.stopPropagation()
                            }}
                            enableMoveTask={true}
                            onRemove={removeTask}
                            onToggleRename={toggleRename}
                            onMoveTask={moveTask}
                            dispatch={dispatch}
                        />
                    )}
                    
                    <textarea 
                        className="line-clamp-2 text-[12px] overflow-hidden resize-none" 
                        ref={taskNameRef}
                        disabled={disableChangeName}
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter'){
                                e.preventDefault();
                                
                                dispatch({
                                    type: 'RENAME_TASK',
                                    payload: {section_index:section_index, task_index:task_index, newName:taskName}
                                })

                                setDisableChangeName(true)
                                
                                if (taskNameRef.current) {
                                    taskNameRef.current.scrollTop = 0;
                                }
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                    
                    {task_details.checklist.length > 0 && (
                        <div 
                            onClick={(e) => {
                                setToggleCheckList(state => !state)
                                e.stopPropagation()
                            }}
                            className="flex items-center gap-2 w-full px-2 rounded-[5px] cursor-pointer hover:bg-secondary/10"
                        >
                            <CircleChevronRight className="w-[14px]" />
                            <p className="text-[8px]">{task_details.checklist.length} subtasks</p>
                        </div>
                    )}
                </div>

                {task_details.checklist.length > 0 && toggleCheckList && (
                    <div className={`flex flex-col gap-2`}>
                        {task_details.checklist.map((checklist, index) => (
                            
                            <SubTaskCard 
                                key={index}
                                section_index={section_index}
                                task_index={task_index}
                                subTask_index={index}
                                title={checklist.sub_task}
                                dispatch={dispatch}
                                status={checklist.done}
                                enableTaskMenu={true}
                                className={`hover:border-1 border-accent`}
                            />
                        ))}
                    </div>
                )}

                
            </div>
            
        </>
    )
}

export function SubTaskCard({ title, status, section_index, task_index, enableTaskMenu = false, subTask_index, onClick, className, dispatch}){
    const [toggleTaskMenu, setToggleTaskMenu] = useState(false);
    const [disableChangeName, setDisableChangeName] = useState(true)
    const [taskName, setTaskName] = useState(title)
    const taskNameRef = useRef();
    
    const toggleRename = () => {
        setDisableChangeName(false)

        setTimeout(() => {
            taskNameRef.current?.focus();
            taskNameRef.current?.select();
        }, 0)
    }

    const handleStatus = () => {
        dispatch({
            type: 'UPDATE_SUBTASK_STATUS',
            payload: {
                section_index,
                task_index,
                subTask_index,
                status: !status
            }
        })
    }

    const handleDelete = () => {
        dispatch({
            type: 'DELETE_SUBTASK',
            payload: {
                section_index,
                task_index,
                subTask_index,
            }
        })
    }

    const handleRename = () => {
        dispatch({
            type: 'RENAME_SUBTASK',
            payload: {
                section_index,
                task_index,
                subTask_index,
                newName:taskName,
            }
        })
    }
    
    return(
        <>
            <div 
                onClick={onClick}
                onMouseEnter={()=> enableTaskMenu && setToggleTaskMenu(true)}
                onMouseLeave={()=> {
                    enableTaskMenu && setToggleTaskMenu(false)
                    setDisableChangeName(true)
                    setTaskName(title)
                }} 
                className={`${className} flex gap-3 h-fit ml-8 bg-primary/70 rounded-[10px] text-secondary p-3 relative cursor-pointer`}
            >
                {toggleTaskMenu && (
                    <TaskCardMenu 
                        onRemove={handleDelete}
                        onToggleRename={toggleRename}
                    />
                )}
                
                {status !== null && (
                    <input 
                        onClick={() => {
                            handleStatus()
                        }}
                        type="radio" 
                        checked={status}
                        readOnly
                        className="cursor-pointer accent-accent"
                    />
                )}

                {!disableChangeName ?  (
                    <input
                        type='text' 
                        className="line-clamp-1 text-[12px] overflow-hidden resize-none" 
                        ref={taskNameRef}
                        disabled={disableChangeName}
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter'){
                                e.preventDefault();
                                console.log('New name')
                                
                                handleRename()

                                setDisableChangeName(true)
                                
                                if (taskNameRef.current) {
                                    taskNameRef.current.scrollTop = 0;
                                }
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                ):
                    <p 
                        onDoubleClick={toggleRename}
                        className="line-clamp-2">{title}</p>
                }
                
                     
                
            </div>
        </>
    )
}