import Section from "./Section"
import Card, { TaskCard, SubTaskCard } from "./Card"

import { Plus, Check } from "lucide-react"
import { useState } from "react"

export default function Board({ details }){
    const [sections, setSections] = useState(details.sections);
    
    // Handles section adding
    const [addSection, setAddSection] = useState(false)
    const handleAddSection = () => setAddSection(state => !state)
    const [newSection, setNewSection] = useState(null)
    
    // Function for adding main task
    const addMainTask = (sectionName, newTaskName, position) => {
        const newTask = {
            task_name: newTaskName,
            checklist: []
        };

        setSections(prev => ({
            ...prev,
            [sectionName]: position === 'start'
                ? [newTask, ...prev[sectionName]]
                : [...prev[sectionName], newTask]
        }))
    };

    // Function for adding new section
    const addNewSection = () => {
        setSections(prev => ({
            ...prev,
            [newSection]: []
        }))

        setNewSection('')
        setAddSection(false)
    }

    // Function for moving task to other section
    const moveTask = (currSection, indexOfTask, receivingSection) =>{
        setSections(prev => {
            // Copy section
            const updated = {...prev};

            // Get task
            const taskToMove = updated[currSection][indexOfTask];

            if(!taskToMove) return prev;

            // Move task to receiving section
            updated[receivingSection] = [...updated[receivingSection], taskToMove]

            // Delete task from current section
            updated[currSection] = updated[currSection].filter((_,index) => index !== indexOfTask)

            return updated
        })
    }

    return(
        <>
            <div className="flex flex-col gap-3 h-full w-full overflow-x-auto" >
                <div className="flex flex-col gap-2 w-full sticky left-0">
                    <h1 className="text-2xl font-bold">{details.title}</h1>
                    
                </div>

                <div className="flex flex-row justify-baseline gap-4 mt-2 h-full">
                    
                    {Object.entries(sections).map(([section, value]) => (
                        <Section 
                                key={section} 
                                section={section} 
                                taskNum={value.length}
                                onAddTask={addMainTask}
                                onAddSection={addNewSection} 
                        >
                            {value.map((mainTask, index) => (
                                <TaskCard
                                    key={index}
                                    taskIndex={index} 
                                    title={mainTask.task_name}
                                    className={'!h-fit !w-[250px]'}
                                    subTaskNum={mainTask.checklist.length}
                                    subTask={mainTask.checklist}
                                    sections={Object.keys(sections)}
                                    current_section={section}
                                    onMoveTask={moveTask}
                                />
                            ))}
                        </Section>
                    ))}
                    
                    <div className="flex flex-col gap-3 text-[12px]">
                        <Card
                            onClick={handleAddSection}
                            className={`!h-fit w-[250px] items-start !bg-accent/50 text-secondary/80 !rounded-[5px] !p-1 cursor-pointer
                                        hover:!bg-accent/100`} 
                            description={'+ Section'}
                        />

                        {addSection && (
                            <div className="flex items-center gap-2 border-accent border-2 p-1 rounded-[5px]">
                                <input 
                                    type="text" 
                                    placeholder="Task Name"
                                    className="w-full"
                                    value={newSection}
                                    onChange={(e) => {
                                        setNewSection(e.target.value)
                                    }}
                                />
                                {newSection && (
                                    <Check 
                                        onClick={addNewSection}
                                        className="w-[30px] p-1 hover:bg-accent rounded-[5px] cursor-pointer"/>
                                )}
                            </div>
                        )}
                        
                        
                    </div>
                     
                </div>
            </div>
        </>
    )
}