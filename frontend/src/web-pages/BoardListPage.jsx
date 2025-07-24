import { useState } from "react"
import Card from "../components/Card"
import { LoadingCard } from "../components/Card"
import CreateBoard from "../components/CreateBoard"
import { Navigate, useNavigate } from "react-router-dom"

export default function BoardListPage(){

    // Control for create board modal
    const [createOpen, setCreateOpen] = useState(false)
    const handleCreate = () => setCreateOpen(true)

    const navigate = useNavigate()

    return(
        <>
            <div 
                className="pageWrapper text-secondary ">
                    
                {/* Open Create Board Modal */}
                <CreateBoard modalOpen={createOpen} onClose={() => setCreateOpen(false)} />

                <h2 className="font-bold">Your personal boards</h2>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                    <Card 
                        onClick={handleCreate}
                        className={`border-2 border-dashed border-secondary !bg-primary text-secondary items-center !justify-center
                                    hover:!bg-secondary hover:text-primary cursor-pointer`}
                        title={'Create new board'}
                    />
                    <Card 
                        onClick={() => navigate(`/kanban/${123}`)}
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