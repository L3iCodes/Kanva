import Card from "./Card"
import { Plus, Ellipsis } from 'lucide-react'
 
export default function Section( {title, taskNum, children}){
    return(
        <>
            <div className="flex flex-col w-fit h-full bg-secondary/30 rounded-[5px] p-1 text-primary">
                <div className="flex gap-2 items-center">
                    <p className="px-2 m-1 bg-secondary rounded-[5px]">{title}</p>
                    <p className="text-secondary/80">{taskNum}</p>
                    <div className="flex ml-auto gap-2">
                        <Ellipsis 
                            className="h-full p-1 text-secondary/50 rounded-[5px] cursor-pointer
                                        hover:bg-secondary/10"/>
                        <Plus 
                            className="h-full p-1 text-secondary/50 rounded-[5px] cursor-pointer 
                                        hover:bg-secondary/10"/> 
                    </div>
                    
                </div>

                {/* Cards */}
                <div className="flex flex-col h-full gap-2 overflow-y-auto">
                    {children}
                </div>
                
            </div>
        </>
    )
}