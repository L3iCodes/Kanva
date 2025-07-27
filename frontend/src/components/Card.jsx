import { useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import { CircleChevronDown, CircleChevronRight } from "lucide-react";
import { TaskCardMenu } from "./Menus";

export default function Card({ title, description, className, showProgressBar = false, onClick}){
    return(
        <>
            <div 
                onClick={onClick}
                className={`${className} flex gap-2 flex-col h-[200px] bg-secondary rounded-[10px] text-primary p-3
                            md:h-[250px]`}>
                {title && (<h2 className="font-bold md:text-2xl">{title}</h2>)}
                <p className="line-clamp-3">{description}</p>

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

export function TaskCard({ section_index, task_index, task_details, section_list, dispatch, className}){
    
    // Sub task toggle control
    const [toggleCheckList, setToggleCheckList] = useState(false)

    // Task menu
    const [toggleTaskMenu, setToggleTaskMenu] = useState(false)
    const [toggleMoveMenu, setToggleMoveMenu] = useState(false)

    // Task Names
    const [taskName, setTaskName] = useState(task_details.task_name)
    const [disableChangeName, setDisableChangeName] = useState(true)
    const taskNameRef = useRef(null)

    const toggleRename = () => {
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

    return(
        <>
            <div className={`${className} flex flex-col gap-1`}>
                <div
                    onMouseEnter={()=>setToggleTaskMenu(true)}
                    onMouseLeave={()=>(setToggleTaskMenu(false), setToggleMoveMenu(false))} 
                    className={`flex gap-3 flex-col bg-primary/70 rounded-[10px] text-secondary p-3 relative
                                `}
                >
                    {toggleTaskMenu && (
                        <TaskCardMenu 
                            section_list={section_list} 
                            task_index={task_index} 
                            current_section={section_index}
                            toggleMoveMenu = {toggleMoveMenu}
                            onToggleMoveMenu={() => setToggleMoveMenu(state => !state)}
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
                    />
                    
                    {task_details.checklist.length > 0 && (
                        <div 
                            onClick={() => setToggleCheckList(state => !state)}
                            className="flex items-center gap-2 w-full px-2 rounded-[5px] cursor-pointer hover:bg-primary/10"
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
                                title={checklist.sub_task}
                                status={checklist.done}
                            />
                        ))}
                    </div>
                )}

                
            </div>
            
        </>
    )
}

export function SubTaskCard({ title, status, className}){
    return(
        <>
            <div 
                className={`${className} flex gap-3 h-fit ml-8 bg-primary/70 rounded-[10px] text-secondary p-3`}
            >
                <input 
                    type="radio" 
                    checked={status}
                    readOnly
                />
                <p className="line-clamp-2">{title}</p> 
            </div>
        </>
    )
}