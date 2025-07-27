import Section from "./Section"
import Card, { TaskCard, SubTaskCard } from "./Card"
import TaskDetail from "./TaskDetail"

import { Plus, Check } from "lucide-react"
import { useRef, useState } from "react"

export default function Board({ board, dispatch }){
    // Add Section Toggle
    const [toggleAddSection, setToggleAddSection] = useState(false)
    const [newSection, setNewSection] = useState('')
    const newSectionRef = useRef(null)
    
    // Open Task Detail Modal
    const [taskDetail, setTaskDetail] = useState({})
    const [openTaskDetail, setOpenTaskDetail] = useState(false)



    return(
        <>
            <div className="flex flex-col gap-3 h-full w-full overflow-x-auto" >
                {openTaskDetail && taskDetail && (
                    <TaskDetail 
                        task_detail={taskDetail}
                        onTaskDetail={()=>setOpenTaskDetail(state => !state)}
                    />)}
                
                <div className="flex flex-col gap-2 w-full sticky left-0">
                    <h1 className="text-2xl font-bold">{board.title}</h1>
                    
                </div>

                <div className="flex flex-row justify-baseline gap-4 mt-2 h-full">
                    
                    {board.sections.map((section, section_index) => (
                        <Section
                            key={`section-${section.name}`}
                            section_index={section_index}
                            section_name={section.name}
                            totalTask={section.tasks.length}
                            dispatch={dispatch}
                        >
                            {section.tasks.map((task, task_index) => (
                                <TaskCard 
                                    key={`${section.name}-${task.task_name}-${task_index}`}
                                    section_index={section_index}
                                    task_index={task_index}
                                    task_details={task}
                                    section_list={board.sections.map(section => section.name)}
                                    className={'w-[250px]'}
                                    onTaskDetail={() => {
                                        setOpenTaskDetail(state => !state);
                                        setTaskDetail(task)
                                    }}
                                    dispatch={dispatch}
                                />
                            ))}
                            
                        </Section>
                    ))}


                    <div className="flex flex-col gap-3 text-[12px]">
                        <Card
                            onClick={() => {
                                setToggleAddSection(state => !state)
                                setNewSection('')

                                setTimeout(() => {
                                    newSectionRef.current?.focus();
                                    newSectionRef.current?.select();
                                }, 0)
                            }}
                            className={`!h-fit w-[250px] items-start !bg-accent/50 text-secondary/80 !rounded-[5px] !p-1 cursor-pointer
                                        hover:!bg-accent/100`} 
                            description={'+ Section'}
                        />

                        {toggleAddSection && (
                            <div className="flex items-center gap-2 border-accent border-2 p-1 rounded-[5px]">
                                <input 
                                    type="text"
                                    ref={newSectionRef}
                                    placeholder="Task Name"
                                    className="w-full"
                                    value={newSection}
                                    onChange={(e) => {
                                        setNewSection(e.target.value)
                                    }}
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter'){
                                            dispatch({
                                                type: 'ADD_SECTION',
                                                payload: {name:newSection, position:'start'}
                                            })

                                            setToggleAddSection(false)
                                        }
                                    }}
                                />
                                {newSection && (
                                    <Check
                                        onClick={()=>{
                                            dispatch({
                                                type: 'ADD_SECTION',
                                                payload: { newSection }
                                            })

                                            setToggleAddSection(false)
                                        }} 
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