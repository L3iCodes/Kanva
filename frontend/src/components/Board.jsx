import Section from "./Section"
import Card from "./Card"

export default function Board({ details }){
    return(
        <>
            <div className="flex flex-col gap-3 h-full w-full" >
                <div className="h-[10%]">
                    <h1 className="text-3xl font-bold">{details.title}</h1>
                    <p className="w-[50%]">{details.desc}</p>
                </div>
                
                <div className="flex flex-row gap-4 mt-2 h-full">
                    <Section 
                        title='To-Do'
                        taskNum={3}
                    >
                        <Card 
                            title={"Research"}
                            description={`lorem ipsum something something`}
                            className={'w-[250px]'}
                            showProgressBar={true}
                        />

                        <Card 
                            title={"Research"}
                            description={`lorem ipsum something something`}
                            className={'w-[250px]'}
                            showProgressBar={true}
                        />

                        <Card 
                            title={"Research"}
                            description={`lorem ipsum something something`}
                            className={'w-[250px]'}
                            showProgressBar={true}
                        />
                    </Section>

                </div>
            </div>
        </>
    )
}