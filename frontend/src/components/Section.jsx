import { useRef, useState } from "react"
import Card from "./Card"
import { Plus, Ellipsis, ArrowRightToLine } from 'lucide-react'
import SectionMenu from "./Menus"
 
export default function Section( {section, taskNum, children, onAddTask, onRename, onDelete}){
    
    // Handles new task functions
    const [addTaskTop, setAddTaskTop] = useState(false)
    const handleAddTaskTop = () => setAddTaskTop(state => !state)

    const [addTaskBot, setAddTaskBot] = useState(false)
    const handleAddTaskBot = () => setAddTaskBot(state => !state)
    const [newTask, setNewTask] = useState('')


    // Adds new task
    const handleAddTask = (position) => {
        if(!newTask) return;

        onAddTask(section, newTask, position);
        setNewTask('');
        setAddTaskBot(false);
        setAddTaskTop(false);
    }

    // Handles section menu
    const [sectionMenu, setSectionMenu] = useState(false)
    const handleSectionMenu = () => setSectionMenu(state => !state)

    // Handles renaming section
    const [disableRename, setDisableRename] = useState(true)
    const [sectionName, setSectionName] = useState(section)
    const sectionNameRef = useRef(null);
    
    const handleRename = () => {
        setDisableRename(false)
        setSectionMenu(false)
        // Wait until after re-render
        setTimeout(() => {
            sectionNameRef.current?.focus()
            sectionNameRef.current?.select()
        }, 0)
    }

    // Handles section collapse
    const [collapse, setCollapse] = useState(false)

    return(
        <>
            <div 
                className={`flex flex-col h-full grow-0 bg-secondary/30 rounded-[5px] p-1 text-primary relative
                            transition-all ease-in duration-200
                            ${collapse ? `w-[50px]` : 'w-fit'}`}
            >
                {sectionMenu && (
                    <SectionMenu 
                        onRename={handleRename} 
                        onDelete={() => onDelete(section)}
                        onCollapse={() => setCollapse(true)}
                        onHandleSection={() => setSectionMenu(false)}
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
                    
                    <input 
                        type='text'
                        ref={sectionNameRef} 
                        className={`px-2 m-1 bg-secondary rounded-[5px] max-w-[100px] truncate text-[12px] ${collapse && 'mt-10 mb-1 text-right rotate-[-90deg] origin-center'}`}
                        disabled={disableRename}
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const trimmedName = sectionName.trim();
                                if (trimmedName === '') return;

                                onRename(section, sectionName);
                                setDisableRename(true);
                            }
                        }}
                    />

                    <p className={`text-secondary/80 ${collapse && 'mt-9'}`}>{taskNum}</p>

                    {!collapse && (
                        <div className="flex ml-auto gap-2">
                            <Ellipsis
                                onClick={handleSectionMenu} 
                                className="h-full p-1 text-secondary/50 rounded-[5px] cursor-pointer
                                            hover:bg-secondary/10"/>
                            <Plus
                                onClick={() => {addTaskBot && setAddTaskBot(false); handleAddTaskTop(); }}
                                className="h-full p-1 text-secondary/50 rounded-[5px] cursor-pointer 
                                            hover:bg-secondary/10"/> 
                        </div>
                    )}
                    
                    
                </div>

                {/* Cards */}
                {!collapse && (
                    <div className="flex flex-col h-full gap-2 overflow-y-auto">
                        {/* ADD TASK TOP */}
                        <div className={`w-[250px] h-fit border-2 border-accent py-1 px-1 bg-primary rounded-[5px] text-secondary text-[12px]
                                        ${addTaskTop ? 'flex' : 'hidden'}`}>
                            <input 
                                type="text" 
                                placeholder="Task Name"
                                className="w-full"
                                value={newTask}
                                onChange={(e) => {
                                    setNewTask(e.target.value)
                                }}
                            />
                            <button
                                onClick={() => handleAddTask('start')} 
                                className="px-2 bg-accent/80 rounded-[5px] text-primary cursor-pointer
                                        hover:bg-accent/100 "
                                        >Save
                            </button>
                        </div>
                        
                        {children}

                        {/* ADD TASK BOT */}
                        <div className={`w-[250px] h-fit border-2 border-accent py-1 px-1 bg-primary rounded-[5px] text-secondary text-[12px]
                                        ${addTaskBot ? 'flex' : 'hidden'}`}>
                            <input 
                                type="text" 
                                placeholder="Task Name"
                                value={newTask}
                                onChange={(e) => {
                                    setNewTask(e.target.value)
                                }}
                                className="w-full"
                            />
                            <button
                                onClick={() => handleAddTask('end')} 
                                className="px-2 bg-accent/80 rounded-[5px] text-primary cursor-pointer
                                        hover:bg-accent/100 "
                                        >Save
                            </button>
                        </div>

                        <Card
                            onClick={() => { addTaskTop && setAddTaskTop(false); handleAddTaskBot(); }}
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