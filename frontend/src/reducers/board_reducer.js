import { SectionIcon } from "lucide-react";
import { act } from "react";
import mongoose from 'mongoose'

export const board_reducer = (state, action) => {
    switch (action.type){
        case 'INIT':
            return action.payload;
        
        case 'RENAME_SECTION': {
            const { section_index, newName } = action.payload;
            const updatedSections = [...state.sections]

            updatedSections[section_index] = {
                ...updatedSections[section_index],
                name: newName.trim(),
            }

            return {
                ...state,
                sections: updatedSections
            }
        }

        case 'DELETE_SECTION': {
            const { section_index } = action.payload;
            const updatedSections = state.sections.filter((_,index) => index !== section_index)

            return{
                ...state,
                sections: updatedSections
            }
        }

        case 'ADD_SECTION': {
            const { name } = action.payload;
            const id = new mongoose.Types.ObjectId()

            const newSection = {
                _id: id,
                name: name.trim() === '' ? 'New Section' : name,
                tasks: []
            }

            return {
                ...state,
                sections: [...state.sections, newSection]
            }
        }

        case 'REORDER_SECTION': {
            const { newSection } = action.payload;

            return {
                ...state,
                sections: newSection
            }
        }

        case 'REORDER_TASKS_WITHIN_SECTION':
            const updatedSection = {
                ...state.sections[action.payload.sectionIndex],
                tasks: action.payload.newTasks,
            };
            return {
                ...state,
                sections: state.sections.map((section, index) =>
                index === action.payload.sectionIndex ? updatedSection : section
            )
        };

        case 'MOVE_TASK_BETWEEN_SECTIONS': {
                const { sourceTasks, targetTasks, sourceSectionIndex, targetSectionIndex } = action.payload;
                
                const updatedSection = [...state.sections]
                
                updatedSection[sourceSectionIndex] = {
                    ...updatedSection[sourceSectionIndex],
                    tasks: sourceTasks
                }

                updatedSection[targetSectionIndex] = {
                    ...updatedSection[targetSectionIndex],
                    tasks: targetTasks
                }
                
                return{
                    ...state,
                    sections: updatedSection
                }

        }
        
            
        case 'ADD_TASK': {
            const {section_index, name, position} = action.payload;
            const id = new mongoose.Types.ObjectId()

            
            const newTask = {
                _id: id,
                task_name: name.trim() === '' ? 'New Task' : name,
                checklist: []
            }
            const updatedSection = [...state.sections];
            updatedSection[section_index] = {
                ...updatedSection[section_index],
                tasks: position === 'start'
                    ? [newTask, ...updatedSection[section_index].tasks]
                    : [...updatedSection[section_index].tasks, newTask]
            }

            return {
                ...state,
                sections: updatedSection
            }
        }

        case 'DELETE_TASK': {
            const {section_index, task_index} = action.payload;
    
            const updatedSection = [...state.sections];

            updatedSection[section_index] = {
                ...updatedSection[section_index],
                tasks: updatedSection[section_index].tasks.filter((_,index) => index !== task_index)
            }

            return {
                ...state,
                sections: updatedSection
            }
        }

        case 'RENAME_TASK': {
            const {section_index, task_index, newName} = action.payload;
            const updatedSection = [...state.sections];

            updatedSection[section_index] = {
                ...updatedSection[section_index],
                tasks: updatedSection[section_index].tasks.map((task, index) => (
                    index === task_index 
                        ? {...task, task_name: newName}
                        : task
                ))
            }

            return {
                ...state,
                sections: updatedSection
            }
        }

        case 'MOVE_TASK': {
            console.log('MOVING')
            const { section_index, task_index, target_section } = action.payload;

            // Clone sections
            const updatedSections = [...state.sections];

            // Get the task
            const taskToMove = updatedSections[section_index].tasks[task_index];
            console.log('Task to move ' + JSON.stringify(taskToMove))

            // Remove from original section
            updatedSections[section_index] = {
                ...updatedSections[section_index],
                tasks: updatedSections[section_index].tasks.filter((_, index) => index !== task_index)
            };
            console.log('Updated Section (Remove) '+JSON.stringify(updatedSections))

            // Add to target section (append at the end)
            updatedSections[target_section] = {
                ...updatedSections[target_section],
                tasks: [...updatedSections[target_section].tasks, taskToMove]
            };

            console.log('Updated Section (Moved) '+JSON.stringify(updatedSections))


            return {
                ...state,
                sections: updatedSections
            };
        }

        case 'ADD_SUBTASK': {
            const {section_index, task_index, taskName} = action.payload;
            const newTask = {
                sub_task: taskName.trim() === '' ? 'New Sub Task' : taskName,
                done: false
            }

            const updatedSection = [...state.sections];
            const section = updatedSection[section_index];
            const tasks = [...section.tasks];

            const updatedTask = {
                ...tasks[task_index],
                checklist: [...tasks[task_index].checklist, newTask]
            }

            tasks[task_index] = updatedTask;

            updatedSection[section_index] = {
                ...section,
                tasks: tasks,
            };

            return {
                ...state,
                sections: updatedSection
            }
        }

        case 'UPDATE_SUBTASK_STATUS': {
            const {section_index, task_index, subTask_index, status} = action.payload;

            const updatedSection = [...state.sections];     // Copy the whole section
            const section = updatedSection[section_index];  // Get specific section
            const tasks = [...section.tasks];               // Copy list of main tasks
            const task = tasks[task_index]                  // Copy specific tasks

            const updatedCheckList = [...task.checklist];   // Copy checklist
            updatedCheckList[subTask_index] = {
                ...updatedCheckList[subTask_index],
                done: status
            };                                              // Update subtask

            task.checklist = updatedCheckList; 
            tasks[task_index] = task

            updatedSection[section_index] = {               // Update the specific section
                ...section,                                 // Store copied section
                tasks                                       // Store modified tasks list
            }

            return {
                ...state,
                sections: updatedSection
            }

        }

        case 'DELETE_SUBTASK': {
            const {section_index, task_index, subTask_index} = action.payload;

            const updatedSection = [...state.sections];     
            const section = updatedSection[section_index];  
            const tasks = [...section.tasks];               
            const task = tasks[task_index]                  

            const updatedCheckList = task.checklist.filter((_,index) => index !== subTask_index);   
            
            const updatedTask = {
                ...task,
                checklist: updatedCheckList
            }

            tasks[task_index] = updatedTask     // Update current task

            updatedSection[section_index] = {   // Update Section (tasks)               
                ...section,                                  
                tasks                                       
            }

            return {
                ...state,
                sections: updatedSection
            }

        }

        case 'RENAME_SUBTASK': {
            const {section_index, task_index, subTask_index, newName} = action.payload;

            const updatedSection = [...state.sections];     // Copy the whole section
            const section = updatedSection[section_index];  // Get specific section
            const tasks = [...section.tasks];               // Copy list of main tasks
            const task = tasks[task_index]                  // Copy specific tasks

            const updatedCheckList = [...task.checklist];   // Copy checklist
            updatedCheckList[subTask_index] = {
                ...updatedCheckList[subTask_index],
                sub_task: newName
            };                                              // Update subtask

            const updatedTask = {
                ...task,
                checklist: updatedCheckList,
            };

            tasks[task_index] = updatedTask;

            updatedSection[section_index] = {               // Update the specific section
                ...section,                                 // Store copied section
                tasks                                       // Store modified tasks list
            }

            return {
                ...state,
                sections: updatedSection
            }

        }

        default:
            return state
    }
}