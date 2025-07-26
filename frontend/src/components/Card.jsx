import { useEffect, useState } from "react";
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

export function TaskCard({ taskIndex, title, subTaskNum, subTask, sections, current_section, onMoveTask, className}){
    
    // Sub task toggle control
    const [showSubTask, setShowSubTask] = useState(false)
    const handleSubTask = () => setShowSubTask(state => !state)
    const hasSubTasks = Array.isArray(subTask) && subTask.length > 0;

    // Task menu
    const [taskMenuOpen, setTaskMenuOpen] = useState(false)
    const [moveMenu, setMoveMenu] = useState(false)

    // Move Task function
    const moveTask = (targetSection) => {
        onMoveTask(current_section, taskIndex, targetSection);
        setMoveMenu(false);
    }
    
    return(
        <>
            <div className={`${className} flex flex-col gap-1`}>
                <div
                    onMouseEnter={()=>setTaskMenuOpen(true)}
                    onMouseLeave={()=>(setTaskMenuOpen(false), setMoveMenu(false))} 
                    className={`flex gap-3 flex-col bg-primary/70 rounded-[10px] text-secondary p-3 relative
                                `}
                >
                    {taskMenuOpen && (
                        <TaskCardMenu 
                            sections={sections} 
                            current_section={current_section}
                            moveMenuOpen={moveMenu}
                            onOpenMoveMenu={() => setMoveMenu(state => !state)} 
                            onMoveTask={moveTask}
                        />
                    )}
                    
                    <p className="line-clamp-2">{title}</p>
                    
                    {hasSubTasks && (
                        <div 
                            onClick={handleSubTask}
                            className="flex items-center gap-2 w-full px-2 rounded-[5px] cursor-pointer hover:bg-primary/10"
                        >
                            <CircleChevronRight className="w-[14px]" />
                            <p className="text-[8px]">{subTaskNum} subtasks</p>
                        </div>
                    )}
                </div>

                {hasSubTasks && showSubTask && (
                    <div className={`flex flex-col gap-2`}>
                        {subTask.map((checklist, index) => (
                            
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