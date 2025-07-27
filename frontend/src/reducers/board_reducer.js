import { SectionIcon } from "lucide-react";
import { act } from "react";

export const board_reducer = (state, action) => {
    switch (action.type){
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
            const newSection = {
                name: name,
                tasks: []
            }

            return {
                ...state,
                sections: [...state.sections, newSection]
            }
        }

        case 'ADD_TASK': {
            const {section_index, name, position} = action.payload;
            
            const newTask = {
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
            const { section_index, task_index, target_section } = action.payload;

            // Clone sections
            const updatedSections = [...state.sections];

            // Step 1: Get the task
            const taskToMove = updatedSections[section_index].tasks[task_index];

            // Step 2: Remove from original section
            updatedSections[section_index] = {
                ...updatedSections[section_index],
                tasks: updatedSections[section_index].tasks.filter((_, index) => index !== task_index)
            };

            // Step 3: Add to target section (append at the end)
            updatedSections[target_section] = {
                ...updatedSections[target_section],
                tasks: [...updatedSections[target_section].tasks, taskToMove]
            };

            return {
                ...state,
                sections: updatedSections
            };
        }

        default:
            return state
    }
}