import Card from "../components/Card"
import { LoadingCard } from "../components/Card"

export default function BoardListPage(){
    return(
        <>
            <div 
                className="pageWrapper text-secondary">
                
                <h2 className="font-bold">Your personal boards</h2>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                    <Card 
                        className={`border-2 border-dashed border-secondary !bg-primary text-secondary items-center !justify-center
                                    hover:!bg-secondary hover:text-primary cursor-pointer`}
                        title={'Create new board'}
                    />
                    <Card 
                        title={`Vysta - A Movie Webite App`}
                        description={`Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                                    Beatae dolore deleniti facere voluptatem reiciendis officiis asperiores optio repellat.`
                                    }
                        showProgressBar={true}
                    />
                    {/* <LoadingCard length={7}/> */}
                </div>

                <h2 className="font-bold mt-5">Shared with you</h2>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                    <LoadingCard length={6}/>
                </div>
                
            </div>
        </>
    )
}