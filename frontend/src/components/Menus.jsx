import { PanelLeftClose, Pen, Trash, X, SendToBack } from 'lucide-react'
import { useState } from 'react'

export default function SectionMenu( {onRename, onDelete, onCollapse, onHandleToggleSection} ){
    return(
        <div className="flex flex-col gap-2 items-start absolute right-[-140px] z-10 top-8 w-[200px] p-2 bg-primary rounded-[5px] shadow-lg shadow-secondary/50 text-secondary text-[12px]">
            <button 
                onClick={() => {
                    onCollapse();
                    onHandleToggleSection();
                    }}
                className="flex items-center gap-2 hover:bg-accent/70 w-full rounded-[5px] px-1 cursor-pointer"
            >
                <PanelLeftClose className='w-[18px]'/>
                Collapse
            </button>
            <button
                onClick={onRename} 
                className="flex items-center gap-2 hover:bg-accent/70 w-full rounded-[5px] px-1 cursor-pointer"
            >
                <Pen className='w-[18px]'/>
                Rename
            </button>
            <button
                onClick={onDelete} 
                className="flex items-center gap-2 hover:bg-accent/70 w-full rounded-[5px] px-1 cursor-pointer"
            >
                <Trash className='w-[18px]'/>
                Delete
            </button>
        </div>
    )
}

export function TaskCardMenu({ section_list, task_index, current_section, toggleMoveMenu, onToggleMoveMenu, onMoveTask, onToggleRename, onRemove, dispatch }){
    
    return(
        <div className='flex items-center gap-1 p-1 absolute top-1 right-1 bg-primary shadow-lg shadow-secondary/50 rounded-[5px]'>
            <div title='Delete Task'>
                <X 
                    onClick={(e) => onRemove(e)}
                    className='w-[18px] h-fit p-[2px] text-secondary/80 rounded-[2px] hover:bg-accent/70 cursor-pointer'
                />
            </div>
            <div title='Rename Task'>
                <Pen 
                    onClick={onToggleRename}
                    className='w-[18px] h-fit p-[2px] text-secondary/80 rounded-[2px] hover:bg-accent/70 cursor-pointer'
                />
            </div>
            <div className={'flex relative'} title='Move Task'>
                <SendToBack
                    onClick={onToggleMoveMenu} 
                    className='w-[18px] h-fit p-[2px] text-secondary/80 rounded-[2px] hover:bg-accent/70 cursor-pointer'/>
                
                {toggleMoveMenu && (
                    <div className='flex flex-col gap-1 w-[100px] bg-primary top-6 right-[-3px] rounded-[5px] p-2 absolute shadow-lg shadow-secondary/50 z-10'>
                        {section_list.map((element, index) => (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMoveTask(index)
                                }}
                                key={`move-${element}`} 
                                className={`flex items-center gap-2 hover:bg-accent/70 w-full rounded-[5px] cursor-pointer text-[12px] px-1 truncate
                                            ${section_list[current_section] === element && ('font-bold')}`}
                            
                                >{element}
                            </button>
                        ))}
                    </div>
                )}
                
                
            </div>
        </div>
    )
}