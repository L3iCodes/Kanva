import Section from "./Section"
import Card, { TaskCard, SubTaskCard } from "./Card"
import TaskDetail from "./TaskDetail"
import { Plus, Check, Trash, Pen, ExternalLink, CircleUser } from "lucide-react"
import { act, useRef, useState, useEffect } from "react"
import { DndContext, closestCorners, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, useDroppable } from '@dnd-kit/core'
import { arrayMove, horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useAuth } from "../../auth/AuthProvider"


export default function Board({ board, dispatch }){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;
    const { user } = useAuth()

    // Add Section Toggle
    const [toggleAddSection, setToggleAddSection] = useState(false)
    const [newSection, setNewSection] = useState('')
    const newSectionRef = useRef(null)

    const handleAddSection = () => {
        dispatch({
            type: 'ADD_SECTION',
            payload: { name: newSection }
        });

        setToggleAddSection(false);
        setNewSection('');
    };
    
    // Open Task Detail Modal
    const [taskDetail, setTaskDetail] = useState({})
    const [openTaskDetail, setOpenTaskDetail] = useState(false)
    const [activeDragItem, setActiveDragItem] = useState(null);

    // Open Search
    const [openSearch, setOpenSearch] = useState(false)
    const [searchedUser, setSearchedUser] = useState([])
    const [search, setSearch] = useState('')
    
    const handleSearch = async (searchValue) => {
        if (!searchValue.trim()){
            setSearchedUser([])
            setSearch('')
            return;
        } 

        fetch(`${BACKEND_URL}/search/user?username=${encodeURIComponent(searchValue)}`, {
            method: 'GET',
        })
        .then(res => res.json())
        .then(data => {
            const allUsers = data.list
            const filteredUsers = allUsers.filter(searched =>
                !board.shared_user.some(sharedUser =>
                    (sharedUser._id || sharedUser.id || sharedUser) === searched._id
                ) && user.id !== searched._id && searched.username !== 'admin'
            );

            setSearchedUser(filteredUsers)
        })
        .catch(err => console.log('Search error ' + err))
    }

    // Drag and Drop Functionality
    const handleDragStart = (event) => {
        const { active } = event;
        setActiveDragItem(active.id);
    };

    const handleDragEnd = (e) => {
        setActiveDragItem(null);

        const {active, over} = e;
        if (!over) return; // 🛡 Prevent error if dropped outside valid zone

        const activeId = active.id.toString();
        const overId = over.id.toString();

        if (active.id === over.id) return;
        
        // Section Reordering
        if(activeId.startsWith('section-') && overId.startsWith('section-')){
            const oldIndex = board.sections.findIndex(s=>`section-${s._id}` === activeId)
            const newIndex = board.sections.findIndex(s=>`section-${s._id}` === overId)

            if (oldIndex !== -1 && newIndex !== -1){
                const newSection = arrayMove(board.sections, oldIndex, newIndex)
                
                dispatch({
                    type: 'REORDER_SECTION',
                    payload: {newSection: newSection}
                })
            }
        }

        // Task Reordering
        if(activeId.startsWith('task-') && overId.startsWith('task-') || overId.startsWith('empty-placeholder-')){
            let sourceSection = -1;
            let targetSection = -1;

            board.sections.forEach((section, sIndex) => {
                if (section.tasks.some(task => `task-${task._id}` === activeId)) {
                    sourceSection = sIndex;
                }
            });

            if (overId.startsWith('empty-placeholder-')) {
                const targetSectionId = overId.replace('empty-placeholder-', '');
                targetSection = board.sections.findIndex(section => section._id.toString() === targetSectionId);
            } else if (overId.startsWith('task-')) {
                board.sections.forEach((section, sIndex) => {
                    if (section.tasks.some(task => `task-${task._id}` === overId)) {
                        targetSection = sIndex;
                    }
                });
            }

            if (sourceSection === -1 || targetSection === -1) return;

            const sourceTasks = [...board.sections[sourceSection].tasks];
            const targetTasks = [...board.sections[targetSection].tasks];
            
            
            const activeTask = sourceTasks.findIndex(task => `task-${task._id}` === activeId);
            const overTask = (sourceSection === targetSection
                ? sourceTasks
                : targetTasks
            ).findIndex(task => `task-${task._id}` === overId);

            const [movedTask] = sourceTasks.splice(activeTask, 1);

            if(sourceSection === targetSection){
                // Moving task within the same section
                sourceTasks.splice(overTask, 0, movedTask);
                dispatch({
                    type: 'REORDER_TASKS_WITHIN_SECTION',
                    payload: {
                    sectionIndex: sourceSection,
                    newTasks: sourceTasks,
                    }
                });
                
            }else{
                if (overId.startsWith('empty-placeholder')) {
                    targetTasks.unshift(movedTask);
                } else {
                    let overTask = targetTasks.findIndex(task => `task-${task._id}` === overId);
                    targetTasks.splice(overTask, 0, movedTask);
                }
                dispatch({
                    type: 'MOVE_TASK_BETWEEN_SECTIONS',
                    payload: {
                        sourceSectionIndex: sourceSection,
                        targetSectionIndex: targetSection,
                        sourceTasks: sourceTasks,
                        targetTasks: targetTasks,
                    },
                });
            }
        }
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8, 
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200, 
                tolerance: 8,
            },
        })
    );

    function EmptyDropZone({ sectionId }) {
        const { setNodeRef, isOver } = useDroppable({
            id: `empty-placeholder-${sectionId}`,
        });

        return (
            <div 
                ref={setNodeRef}
                className={`h-[55px] rounded-[5px] w-full border-2 border-dashed transition-colors ${
                    isOver ? 'border-accent bg-primary/10' : 'border-primary/50'
                }`}
            >
            </div>
        );
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
                        onTaskDetail={()=>{
                            setOpenTaskDetail(state => !state)}}
                    />)}
                
                <div className="flex flex-row items-center gap-2 w-full sticky left-0 z-20">
                    <h1 className="text-2xl font-bold">{board.title}</h1>
                    <div className="flex items-center gap-2"> |
                        {/* <div title="Delete Board">
                            <Trash className="w-[18px] text-secondary/50 cursor-pointer hover:text-secondary"/>        
                        </div>
                        <div title="Rename Board">
                            <Pen className="w-[18px] text-secondary/50 cursor-pointer hover:text-secondary"/>   
                        </div> */}
                        <div title="Share Board" className="flex gap-2 relative z-30">
                            <ExternalLink 
                                onClick={() => {
                                    setOpenSearch(state => !state);
                                    setSearch('')
                                }}
                                className="w-[18px] text-secondary/50 cursor-pointer hover:text-secondary"/>   
                            <input
                                type="text"
                                placeholder="Share with:"
                                className={`text-[12px] border-1 border-secondary rounded-2xl
                                            transition-all duration-300 ease-in
                                            ${openSearch ? `w-[200px] px-2` : `w-[0px]` }`}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    handleSearch(e.target.value)
                                }}
                            />
                            {openSearch && searchedUser.length > 0 && (
                                <div className={`flex flex-col gap-1 p-2 w-[200px] bg-primary border-1 border-accent right-0 top-8 h-fit shadow-lg shadow-secondary/50 rounded-[5px] absolute
                                                transition-all ease-in-out duration-900`}> 
                                    {searchedUser.map((element) => (
                                        <button 
                                            key={element._id}
                                            className="flex items-center gap-2 px-2 py-1 text-[12px] align-baseline hover:bg-accent cursor-pointer rounded-[2px]"    
                                        >
                                            <CircleUser />
                                            {element.username}

                                        </button>
                                    ))}
                                </div>)}
                        </div>
                        
                    </div>
                    
                </div>

                <div className="flex flex-row justify-baseline gap-4 mt-2 h-full">
                    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                        
                         <SortableContext items={board.sections.map(section => `section-${section._id}`)} strategy={horizontalListSortingStrategy}>

                            {board.sections.map((section, section_index) => (
                                
                                <Section
                                    key={section._id}
                                    id={`section-${section._id}`}
                                    section_index={section_index}
                                    section_name={section.name}
                                    totalTask={section.tasks.length}
                                    dispatch={dispatch}
                                >
                                    <SortableContext 
                                        items={section.tasks.map(task => `task-${task._id}`)}
                                        strategy={verticalListSortingStrategy}>
                                        {section.tasks.length > 0 
                                            ? (
                                                section.tasks.map((task, task_index) => (
                                                    <TaskCard 
                                                        key={task._id}
                                                        id={`task-${task._id}`}
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
                                                                section_list: board.sections.map(section => section.name),
                                                                current_section: section_index
                                                            })
                                                        }}
                                                        dispatch={dispatch}
                                                    />
                                                ))
                                            )
                                            : (  <EmptyDropZone sectionId={section._id} />
                                            )
                                        }
                                        
                                        
                                        
                                    </SortableContext>
                                </Section>
                        ))}

                        </SortableContext>
                        <DragOverlay>
                            {activeDragItem?.startsWith('task-') && (() => {
                                const taskId = activeDragItem.replace('task-', '');
                                const task = board.sections.flatMap(s => s.tasks).find(t => t._id.toString() === taskId);
                                if (!task) return null;

                                return (
                                <TaskCard
                                    key={task._id}
                                    id={`{task-${task._id}`}
                                    task_details={task}
                                    className="w-[250px] opacity-80 shadow-xl"
                                    dragging
                                />
                                );
                            })()}

                            {activeDragItem?.startsWith('section-') && (() => {
                                const sectionId = activeDragItem.replace('section-', '');
                                const section = board.sections.find(s => s._id === sectionId);
                                if (!section) return null;

                                return (
                                <Section
                                    id={`section-${section._id}`}
                                    section_name={section.name}
                                    className="opacity-80 shadow-xl"
                                    dragging
                                />
                                );
                            })()}
                        </DragOverlay>
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
                                            handleAddSection()
                                        }
                                    }}
                                />
                                {newSection && (
                                    <Check
                                        onClick={()=>{
                                           handleAddSection()
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