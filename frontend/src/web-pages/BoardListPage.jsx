import { useState, useEffect } from "react"
import Card, { TaskCard } from "../components/Card"
import { LoadingCard } from "../components/Card"
import CreateBoard from "../components/CreateBoard"
import { Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthProvider"
import { TaskCardMenu } from "../components/Menus"


export default function BoardListPage(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;
    const [userBoards, setUserBoards] = useState()
    const [personalBoards, setPersonalBoards] = useState([])
    const [personalLoading, setPersonalLoading] = useState(true)
    const [sharedLoading, setSharedLoading] = useState(true)
    const [sharedBoards, setSharedBoards] = useState([])
    
    const [loading, setLoading] = useState(true)
    const {user, token, refreshKey, refresh} = useAuth();
    const navigate = useNavigate()

    // Control for create board modal
    const [createOpen, setCreateOpen] = useState(false)
    const handleCreate = () => setCreateOpen(true)

    useEffect(() => {
        fetchUserBoards();
    }, [refreshKey])


    // Fetch lsit of user boards
    const fetchUserBoards = async () => {
        try{
            setLoading(true)
            const response = await fetch(`${BACKEND_URL}/kanban/boards`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if(response.ok){
                const data = await response.json();
                console.log(data)
                
                const fetchPersonalBoards = async () => {
                    if (data.personal_board.length > 0){
                        const results = await Promise.all(
                            data.personal_board.map(id =>
                            fetch(`${BACKEND_URL}/kanban/${id}`)
                                .then(res => res.json())
                                .then(data => ({
                                id,
                                ...data.board
                                }))
                            )
                        )
                        setPersonalBoards(results)
                    }else{
                        setPersonalBoards([]);
                    }
                    setPersonalLoading(false)
                }

                const fetchSharedBoards = async () => {
                    if (data.shared_board.length > 0){
                        const results = await Promise.all(
                            data.shared_board.map(id =>
                            fetch(`${BACKEND_URL}/kanban/${id}`)
                                .then(res => res.json())
                                .then(data => ({
                                id,
                                ...data.board
                                }))
                            )
                        )
                        setSharedBoards(results)
                    }else{
                        setSharedBoards([]);
                    }
                    setSharedLoading(false)
                }

                setTimeout(() => {
                    fetchPersonalBoards()
                    fetchSharedBoards()
                }, 200)
                
            }else{
                console.log('Failed to fetch boards');
            }
        }catch(error){
            console.log('Error fetching boards:', error);
            console.log('Network error occurred');
        }finally{
            setLoading(false)
        }
    }

    // Generate Personal Boards
    useEffect(() => {
        if(!userBoards){
            return
        }

        const fetchPersonalBoards = async () => {
                const results = await Promise.all(
                    userBoards.personal_board.map(id =>
                    fetch(`${BACKEND_URL}/kanban/${id}`)
                        .then(res => res.json())
                        .then(data => ({
                        id,
                        ...data.board
                        }))
                    )
                )
                setPersonalBoards(results)
            }

        fetchPersonalBoards()
    }, [])



    return(
        <>
            <div 
                className="pageWrapper text-secondary ">
                    
                {/* Open Create Board Modal */}
                <CreateBoard modalOpen={createOpen} onClose={() => setCreateOpen(false)} />

                <h2 className="font-bold">Your personal boards</h2>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <button
                        onClick={handleCreate}
                        className={`border-2 border-dashed border-secondary bg-primary text-secondary items-center justify-center rounded-[10px] text-2xl font-bold h-[200px]
                                    md:h-[250px]
                                    hover:!bg-secondary hover:text-primary cursor-pointer`}
                    >
                        Create new board
                    </button>
                     
                    {personalLoading 
                        ? (<LoadingCard length={6}/>)
                        : (
                            personalBoards.map(board => (
                                <Card
                                    key={board.id}
                                    id={board.id}
                                    onClick={() => navigate(`/kanban/${board.id}`)}
                                    title={board.title}
                                    description={board.desc}
                                    enableMenu={true}
                                />
                            ))
                        )
                    }

                </div>

                <h2 className="font-bold mt-5">Shared with you</h2>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                    {sharedLoading 
                        ? (<LoadingCard length={6}/>)
                        : sharedBoards.length > 0 
                            ?   (
                                    sharedBoards.map(board => (
                                        <Card
                                            key={board.id}
                                            id={board.id}
                                            onClick={() => navigate(`/kanban/${board.id}`)}
                                            title={board.title}
                                            description={board.desc}
                                            enableMenu={true}
                                        />
                                    ))
                                )
                            : <h1>No shared boards</h1>
                    }
                </div>
                
            </div>
 
        </>
    )
}

