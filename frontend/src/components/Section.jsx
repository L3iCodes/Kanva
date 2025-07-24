import Card from "./Card"

export default function Section( {title, taskNum, children}){
    return(
        <>
            <div className="flex flex-col gap-3 w-fit h-fit">
                <div 
                    className="flex w-full bg-secondary p-3 text-primary rounded-[10px] relative"
                >
                    <h1 className="sticky top-0 left-0">{title}</h1>
                    {/* Display number of tasks */}
                    <div 
                        className="flex flex-col items-center justify-center h-full bg-accent absolute top-0 right-0 p-3 rounded-r-[10px] "
                    >
                        <p className="font-bold">tasks</p>
                        <p>{taskNum}</p>
                    </div>
                </div>

                {/* Cards */}
                {children}
            </div>
        </>
    )
}