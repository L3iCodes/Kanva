export default function Feedback({message='', openFeedback}){
    return(
        <div className={`w-[400px] p-3 text-primary bg-secondary shadow-lg shadow-primary right-0 rounded-[5px] absolute z-10
                        transition-all ease-in
                        ${openFeedback ? 'bottom-0' : 'bottom-[-60px]'} `}>
            <p>{message}</p>
        </div>
    )
}