import { useRef, useState } from "react"
import Card from "./Card"
import { Plus, Ellipsis, ArrowRightToLine } from 'lucide-react'
import SectionMenu from "./Menus"
 
export default function Section( {section_index, section_name, totalTask, dispatch, children}){
    // Toggle Section Menu
    const [toggleSectionMenu, setToggleSectionMenu] = useState(false)

    // Section Collapse State
    const [collapse, setCollapse] = useState(false)

    // Rename Section
    const [sectionName, setSectionName] = useState(section_name)
    const [disableRename, setDisableRename] = useState(true)
    const sectionNameRef = useRef(null)
    
    const toggleRenameSection = () => {
        setDisableRename(false);

        setTimeout(() => {
            sectionNameRef.current?.focus()
            sectionNameRef.current?.select()
        }, 0)
    }

    // Adding Task
    const [addTaskTop, setAddTaskTop] = useState(false)
    const inputStart = useRef(null)
    const [addTaskBot, setAddTaskBot] = useState(false)
    const inputEnd = useRef(null)
    const [newTask, setNewTask] = useState('')

    const addTask = (position) =>{
        dispatch({
            type: 'ADD_TASK',
            payload: {section_index, name:newTask, position:position}
        })

        setNewTask('')
        setAddTaskTop(false)
        setAddTaskBot(false)
    }

    return(
        <>
            <div 
                className={`flex flex-col h-full grow-0 bg-secondary/30 rounded-[5px] p-1 text-primary relative
                            transition-all ease-in duration-200
                            ${collapse ? `w-[50px]` : 'w-fit'}`}
            >
                {toggleSectionMenu && (
                    <SectionMenu 
                        onCollapse={() => setCollapse(true)}
                        onRename={toggleRenameSection}
                        onDelete={() => {
                            dispatch({
                                type: 'DELETE_SECTION',
                                payload: {section_index}
                            })
                        }}
                        onHandleToggleSection={() => setToggleSectionMenu(false)}
                        />
                )}
                
                <div 
                    className={`flex gap-2 items-center
                                ${collapse && ('flex-col py-2')}`}
                >
                    {collapse && (
                        <div title={'Open'}>
                            <ArrowRightToLine
                                onClick={() => setCollapse(false)} 
                                className="h-full p-1 text-secondary/50 rounded-[5px] cursor-pointer
                                                hover:bg-secondary/10"/>
                        </div>
                    )}
                    
                    {!disableRename 
                        ? (<input 
                                type='text'
                                ref={sectionNameRef}
                                disabled={disableRename}
                                value={sectionName}
                                onChange={(e) => setSectionName(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter'){
                                        if(sectionName.trim() === '') return;

                                        dispatch({
                                            type: 'RENAME_SECTION',
                                            payload: {section_index, newName: sectionName}
                                        })

                                        setToggleSectionMenu(false)
                                        setDisableRename(true);
                                    }
                                }}

                                className={`px-2 m-1 bg-primary text-secondary rounded-[3px] max-w-[100px] truncate text-[12px] ${collapse && 'mt-10 mb-1 text-right rotate-[-90deg] origin-center'}`}  
                            />) 
                        : ( <p 
                                onDoubleClick={toggleRenameSection}
                                className={`px-2 m-1 bg-primary text-secondary rounded-[3px] max-w-[100px] truncate text-[12px] ${collapse && 'mt-10 mb-1 text-right rotate-[-90deg] origin-center'}`}  

                                >{sectionName}
                            </p>)
                    }
                    

                    <p className={`text-secondary/80 ${collapse && 'mt-9'}`}>{totalTask}</p>

                    {!collapse && (
                        <div className="flex ml-auto gap-2">
                            <Ellipsis
                                onClick={() => setToggleSectionMenu(state=>!state)} 
                                className="h-full p-1 text-secondary/50 rounded-[5px] cursor-pointer
                                            hover:bg-secondary/10"/>
                            <Plus
                                onClick={() => {
                                    addTaskBot && setAddTaskBot(false); 
                                    setAddTaskTop(state=>!state);
                                    setNewTask('')
                                    
                                    setTimeout(() => {
                                        inputStart.current?.focus();
                                        inputStart.current?.select();
                                    }, 0);
                                }}
                                className="h-full p-1 text-secondary/50 rounded-[5px] cursor-pointer 
                                            hover:bg-secondary/10"/> 
                        </div>
                    )}
                </div>

                {!collapse && (

                    <div className="flex flex-col h-full gap-2 overflow-y-auto">
                        
                        {addTaskTop && (
                            <div className={`flex w-[250px] h-fit border-2 border-accent py-1 px-1 bg-primary rounded-[5px] text-secondary text-[12px]`}>
                                <input 
                                    type="text"
                                    ref={inputStart} 
                                    placeholder="Task Name"
                                    className="w-full"
                                    value={newTask}
                                    onChange={(e) => {
                                        setNewTask(e.target.value)
                                    }}
                                    onKeyDown={(e) => e.key==='Enter' && addTask('start')}
                                />
                                <button
                                    onClick={() => addTask('start')} 
                                    className="px-2 bg-accent/80 rounded-[5px] text-primary cursor-pointer
                                            hover:bg-accent/100 "
                                            >Save
                                </button>
                            </div>
                        )}
                        
                        {children}

                        <div className={`w-[250px] h-fit border-2 border-accent py-1 px-1 bg-primary rounded-[5px] text-secondary text-[12px]
                                        ${addTaskBot ? 'flex' : 'hidden'}`}>
                            <input 
                                type="text"
                                ref={inputEnd} 
                                placeholder="Task Name"
                                value={newTask}
                                onChange={(e) => {
                                    setNewTask(e.target.value)
                                }}
                                onKeyDown={(e) => e.key==='Enter' && addTask('end')}
                                className="w-full"
                            />
                            <button
                                onClick={() => addTask('end')} 
                                className="px-2 bg-accent/80 rounded-[5px] text-primary cursor-pointer
                                        hover:bg-accent/100 "
                                        >Save
                            </button>
                        </div>

                        <Card
                            onClick={() => {
                                    addTaskTop && setAddTaskTop(false); 
                                    setAddTaskBot(state=>!state);
                                    setNewTask('')
                                    
                                    setTimeout(() => {
                                        inputEnd.current?.focus();
                                        inputEnd.current?.select();
                                    }, 0);
                                }}
                            className={`!h-fit w-[250px] items-start !bg-primary/0 text-secondary/80 !p-1 cursor-pointer
                                        hover:!bg-primary/90`} 
                            description={ addTaskBot ? `Close`  :  `+ Add Task`}
                        />
                    </div>
                )}
                
            </div>
        </>
    )
}

