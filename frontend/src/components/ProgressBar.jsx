export default function ProgressBar({ totalTask = 0, doneTask = 0}){
    const percentage = ((doneTask/totalTask)*100).toString()
    console.log(percentage)

    return(
        <>
            <div 
                className="flex flex-col justify-center h-[40px]
                            md:h-[55px]"
            >
                <div className="flex items-center">
                    <p>Sub task</p>
                    <p className="ml-auto">{doneTask} / {totalTask}</p>

                </div>
                
                <div className="w-full border-1 h-[15px] rounded-[5px]">
                    <div 
                        className={`h-full rounded-[5px] bg-accent`}
                        style={{ width: `${(doneTask / totalTask) * 100}%` }}
                />
                </div>
            </div>
        </>
    )
}