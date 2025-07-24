import ProgressBar from "./ProgressBar";
import { CircleChevronDown, CircleChevronRight } from "lucide-react";

export default function Card({ title, description, className, showProgressBar = false, onClick}){
    return(
        <>
            <div 
                onClick={onClick}
                className={`${className} flex gap-2 flex-col h-[200px] bg-secondary rounded-[10px] text-primary p-3
                            md:h-[250px]`}>
                <h2 className="font-bold md:text-2xl">{title}</h2>
                <p className="line-clamp-3">{description}</p>

                {showProgressBar && (<ProgressBar totalTask={10} doneTask={9} />) }
            </div>
        </>
    )
}

export function LoadingCard({ length }){
    const loadingCard = Array.from({ length }).map((_, index) => (
        <Card
            key={`placeholder_${index}`}
            className="animate-pulse"
            showProgressBar={false}
        />
    ));

    return <>{loadingCard}</>;
}


export function TaskCard({ title, subTaskNum, className}){
    return(
        <>
            <div 
                className={`${className} flex gap-3 flex-col h-[200px] bg-secondary rounded-[10px] text-primary p-3
                            md:h-[250px]`}
            >
                <p className="line-clamp-2">{title}</p>
                
                {subTaskNum && (
                    <div className="flex items-center gap-2 w-full px-2 rounded-[5px] cursor-pointer hover:bg-primary/10">
                        <CircleChevronRight className="w-[14px]" />
                        <p className="text-[8px]">{subTaskNum} subtasks</p>
                    </div>
                )}


                

            </div>
        </>
    )
}