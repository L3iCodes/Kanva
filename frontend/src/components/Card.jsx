import ProgressBar from "./ProgressBar";

export default function Card({ title, description, className, showProgressBar = false }){
    return(
        <>
            <div 
                className={`${className} flex justify-evenly gap-2 flex-col h-[200px] bg-secondary rounded-[10px] text-primary p-3
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