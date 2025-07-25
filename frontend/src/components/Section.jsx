import { useState } from "react"
import Card from "./Card"
import { Plus, Ellipsis } from 'lucide-react'
import SectionMenu from "./Menus"
 
export default function Section( {section, taskNum, children, onAddTask}){
    
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

    const [sectionMenu, setSectionMenu] = useState(false)
    const handleSectionMenu = () => setSectionMenu(state => !state)

    return(
        <>
            <div className="flex flex-col w-fit h-full grow-0 bg-secondary/30 rounded-[5px] p-1 text-primary relative">
                {sectionMenu && (<SectionMenu />)}
                
                <div className="flex gap-2 items-center">
                    <p className="px-2 m-1 bg-secondary rounded-[5px]">{section}</p>
                    <p className="text-secondary/80">{taskNum}</p>
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
                    
                </div>

                {/* Cards */}
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
                
            </div>
        </>
    )
}