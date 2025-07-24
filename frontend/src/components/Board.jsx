import Section from "./Section"
import { TaskCard } from "./Card"

import { Plus } from "lucide-react"
import { useState } from "react"

export default function Board({ details }){
    const [addBtnOpen, setAddBtnOpen] = useState(false)
    const handleAddBtn = () => setAddBtnOpen(state => !state)

    return(
        <>
            <div className="flex flex-col gap-3 h-full w-full" >
                <div className="flex flex-col gap-2 w-full min-h-[100px]">
                    <h1 className="text-3xl font-bold">{details.title}</h1>
                    <p>{details.desc}</p>
                </div>
                {/* <div>
                    <div className="flex items-center gap-2 absolute z-10 bottom-5 right-5 text-primary
                                    md:relative md:bottom-0 md:right-0 md:border-b-2 md:border-t-2 border-accent/30">
                        <Plus
                            onClick={handleAddBtn} 
                            className={`bg-accent w-[60px] h-fit rounded-full p-1 border-3 border-primary cursor-pointer md:w-[50px]`}/>
                       
                        <button 
                            className={`w-[110px] py-1 bg-accent absolute bottom-10 right-18 rounded-[5px] border-2 border-primary cursor-pointer
                                        md:relative md:right-0 md:bottom-0
                                        transition-all duration-300 ease-in
                                        ${addBtnOpen ? 'translate-x-0' : 'translate-x-10 opacity-0 md:translate-x-[-20px]'}`}
                            >Add Task
                        </button>
                        
                        <button 
                            className={`w-[110px] py-1 bg-accent absolute bottom-0 right-18 rounded-[5px] border-2 border-primary cursor-pointer
                                        md:relative md:right-0
                                        transition-all duration-300 ease-in
                                        ${addBtnOpen ? ' translate-x-0' : 'translate-x-10 opacity-0 md:translate-x-[-20px]'}`}
                            >Add Section
                        </button>
                       
                    </div>
                </div> */}

                <div className="flex flex-row justify-baseline gap-4 mt-2 h-full">
                    <Section 
                        title='TO-DO'
                        taskNum={3}
                    >
                        <TaskCard 
                            title={"Create the UI and Prototype of the Website then Lorem ipsum, dolor sit amet consectetur adipisicing elit.  "}
                            className={'!h-fit !w-[250px]'}
                            subTaskNum={10}
                        />

                        
                    </Section>

                </div>
            </div>
        </>
    )
}