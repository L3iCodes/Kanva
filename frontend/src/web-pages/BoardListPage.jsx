import { useState, useEffect } from "react"
import Card from "../components/Card"
import { LoadingCard } from "../components/Card"
import CreateBoard from "../components/CreateBoard"
import { Navigate, useNavigate } from "react-router-dom"

export default function BoardListPage(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;
    const sampleCollection = ['123', '153']

    // Control for create board modal
    const [createOpen, setCreateOpen] = useState(false)
    const handleCreate = () => setCreateOpen(true)

    const [boards, setBoards] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBoards = async () => {
        const results = await Promise.all(
            sampleCollection.map(id =>
            fetch(`${BACKEND_URL}/kanban/${id}`)
                .then(res => res.json())
                .then(data => ({
                id,
                ...data.board
                }))
            )
        )
        setBoards(results)
        }

        fetchBoards()
    }, [])
    console.log(boards)

    return(
        <>
            <div 
                className="pageWrapper text-secondary ">
                    
                {/* Open Create Board Modal */}
                <CreateBoard modalOpen={createOpen} onClose={() => setCreateOpen(false)} />

                <h2 className="font-bold">Your personal boards</h2>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <Card 
                        onClick={handleCreate}
                        className={`border-2 border-dashed border-secondary !bg-primary text-secondary items-center !justify-center
                                    hover:!bg-secondary hover:text-primary cursor-pointer`}
                        title={'Create new board'}
                    />
                    
                    {boards.map(board => (
                        <Card
                        key={board.id}
                        onClick={() => navigate(`/kanban/${board.id}`)}
                        title={board.title}
                        description={board.desc}
                        />
                    ))}
                    
                </div>

                <h2 className="font-bold mt-5">Shared with you</h2>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                    <LoadingCard length={6}/>
                </div>
                
            </div>
 
        </>
    )
}