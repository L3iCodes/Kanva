import { use, useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import { CircleChevronDown, CircleChevronRight } from "lucide-react";
import { TaskCardMenu } from "./Menus";
import { useAuth } from "../../auth/AuthProvider";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Card({ children, id, title = ' ', description = ' ', className, showProgressBar = false, onClick, enableMenu = false}){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;
    const [toggleMenu, setToggleMenu] = useState(false)
    const [disablEdit, setDisableEdit] = useState(true)
    const {token, refresh} = useAuth()
    const [newTitle, setNewTitle] = useState(title)
    const [newDesc, setnewDesc] = useState(description)
    const descRef = useRef();
    const titleRef = useRef();

    const toggleRename = (e) => {
        e.stopPropagation()
        setDisableEdit(state => !state)

        setTimeout(() => {
            titleRef.current?.focus()
            titleRef.current?.select()
        }, 0)

    }
    
    // Delete board
    const deleteBoard = async (id, e) => {
        e.stopPropagation();
        
        try{
            const response = await fetch(`${BACKEND_URL}/kanban/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
            if(response.ok){
                const data = await response.json();
                console.log(data.message); 
                refresh();
            }else{
                const data = await response.json();
                console.log(data.message); 
            }

        }catch(error){
            console.log('Failed board deletion: ' + error)
        }  
    }

    const renameBoard = async (e) => {
        e.stopPropagation();
        console.log('Renaming Board');

        try {
            console.log('Entered')
            console.log(newDesc, newTitle)
            const response = await fetch(`${BACKEND_URL}/kanban/rename/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newTitle: newTitle,
                    newDesc: newDesc
                })
            });

            const data = await response.json();
            console.log(data)

            if (response.ok) {
                console.log(data.message);
                refresh();
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log('Renaming Error: ' + error);
        }
    }
    
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

                <textarea
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter'){
                            e.preventDefault();
                            renameBoard(e);
                            toggleRename(e);
                            refresh();
                        }
                    }}
                    className={`line-clamp-2 font-bold md:text-2xl resize-none ${!disablEdit && 'border-accent border-1 rounded-[5px]'}`}
                    disabled = {disablEdit}
                    ref={titleRef}
                    value={newTitle}
                >
                    {title}
                </textarea>

                <textarea
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setnewDesc(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter'){
                            e.preventDefault();
                            renameBoard(e);
                            toggleRename(e);
                            refresh();
                        }
                    }}
                    className={`line-clamp-2 text-[12px] h-[90%] resize-none ${!disablEdit && 'border-accent border-1 rounded-[5px]'}`}
                    disabled = {disablEdit}
                    ref={descRef}
                    value={newDesc}
                >
                    {description}
                </textarea>
                
                {toggleMenu && enableMenu &&
                
                    (<TaskCardMenu 
                        onRemove={(e) => deleteBoard(id, e)}
                        onToggleRename={(e) => toggleRename(e)}
                    />)
                }
                

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

export function TaskCard({ section_index, id, task_index, task_details, section_list, dispatch, onTaskDetail, className}){
    
    // Sub task toggle control
    const [toggleCheckList, setToggleCheckList] = useState(false)

    // Task menu
    const [toggleTaskMenu, setToggleTaskMenu] = useState(false)
    const [toggleMoveMenu, setToggleMoveMenu] = useState(false)

    // Task Names
    const [taskName, setTaskName] = useState(!task_details ? '' : task_details.task_name)
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

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };


    return(
        <>
            <div 
                ref={setNodeRef}
                    style={style}
                    {...attributes}
                    {...listeners}
                className={`${className} flex flex-col gap-1`}>
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