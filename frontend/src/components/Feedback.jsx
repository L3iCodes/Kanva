export default function Feedback({message='', openFeedback, onUndo}){
    return(
        <div className={`flex items-center w-[400px] p-3 text-primary bg-secondary shadow-lg shadow-primary right-0 rounded-[5px] absolute z-10
                        transition-all ease-in
                        ${openFeedback ? 'bottom-0' : 'bottom-[-60px]'} `}>
            <p>{message}</p>
            <button 
                onClick={onUndo}
                className="ml-auto text-[12px] text-primary cursor-pointer px-3 rounded-[2px]
                            hover:bg-primary hover:text-secondary">Undo</button>
        </div>
    )
}