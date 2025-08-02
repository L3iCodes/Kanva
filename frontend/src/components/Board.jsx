import Section from "./Section"
import Card, { TaskCard, SubTaskCard } from "./Card"
import TaskDetail from "./TaskDetail"
import { Plus, Check } from "lucide-react"
import { act, useRef, useState } from "react"
import { DndContext, closestCorners } from '@dnd-kit/core'
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { useAuth } from "../../auth/AuthProvider"

export default function Board({ board, dispatch }){
    // Add Section Toggle
    const [toggleAddSection, setToggleAddSection] = useState(false)
    const [newSection, setNewSection] = useState('')
    const newSectionRef = useRef(null)

    const { refresh } = useAuth()
    
    // Open Task Detail Modal
    const [taskDetail, setTaskDetail] = useState({})
    const [openTaskDetail, setOpenTaskDetail] = useState(false)

    const getSectionPos = id => board.sections.findIndex(section => section._id === id)

    const handleDragEnd = (e) => {
        const {active, over} = e;

        if (active.id === over.id) return;
        
        const originalPos = getSectionPos(active.id)
        const newPos = getSectionPos(over.id)
        const newSection = arrayMove(board.sections, originalPos, newPos)

        dispatch({
            type: 'REORDER_SECTION',
            payload: {newSection: newSection}
        })

        refresh()
    }
    
    return(
        <>
            <div className="flex flex-col gap-3 h-full w-full overflow-x-auto" >
                {openTaskDetail && taskDetail && (
                    <TaskDetail 
                        key={`${taskDetail.section_index}-${taskDetail.task_index}`} 
                        task_detail={taskDetail}
                        board={board}
                        dispatch={dispatch}
                        onTaskDetail={()=>setOpenTaskDetail(state => !state)}
                    />)}
                
                <div className="flex flex-col gap-2 w-full sticky left-0">
                    <h1 className="text-2xl font-bold">{board.title}</h1>
                    
                </div>

                <div className="flex flex-row justify-baseline gap-4 mt-2 h-full">
                    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                        
                         <SortableContext items={board.sections.map(section => section._id)} strategy={horizontalListSortingStrategy}>

                            {board.sections.map((section, section_index) => (
                                console.log('SECTION ID: '+ section._id + ' INDEX: ' +section_index),
                                <Section
                                    key={section._id}
                                    id={section._id}
                                    section_index={section_index}
                                    section_name={section.name}
                                    totalTask={section.tasks.length}
                                    dispatch={dispatch}
                                >
                                    {section.tasks.map((task, task_index) => (
                                        <TaskCard 
                                            key={task._id}
                                            section_index={section_index}
                                            task_index={task_index}
                                            task_details={task}
                                            board={board}
                                            section_list={board.sections.map(section => section.name)}
                                            className={'w-[250px]'}
                                            onTaskDetail={() => {
                                                setOpenTaskDetail(state => !state);
                                                setTaskDetail({
                                                    section_index: section_index,
                                                    task_index: task_index,
                                                })
                                            }}
                                            dispatch={dispatch}
                                        />
                                    ))} 
                                </Section>
                        ))}

                        </SortableContext>
                        
                    </DndContext>
                    


                    <div className="flex flex-col gap-3 text-[12px]">
                        <button
                            onClick={() => {
                                    setToggleAddSection(state => !state)
                                    setNewSection('')

                                    setTimeout(() => {
                                        newSectionRef.current?.focus();
                                        newSectionRef.current?.select();
                                    }, 0)
                                }}
                            className={`flex !h-fit w-[250px] justufy-start !bg-accent/50 text-secondary/80 !rounded-[5px] !p-1 cursor-pointer
                                        hover:!bg-accent/100`} 
                        >
                            + Section
                        </button>
                        
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
                                            refresh();
                                        }
                                    }}
                                />
                                {newSection && (
                                    <Check
                                        onClick={()=>{
                                            dispatch({
                                                type: 'ADD_SECTION',
                                                payload: { name:newSection }
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