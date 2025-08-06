import { useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthProvider"

export default function HomePage(){
    const { user } = useAuth()
    const navigate = useNavigate()

    return(
        <div className="pageWrapper justify-center h-full items-center text-secondary">
            {!user
                ? (<h1 className="text-[50px] md:text-[200px] ">KANVA</h1>)
                : (<h1 className="text-[50px] md:text-[200px] ">DASHBOARD</h1>)}
            

            {user 
                ? (<p className="!text-[20px]">Welcome  <span className="text-accent/80 ml-2 font-bold hover:font-extrabold cursor-pointer">{user.username}</span></p>)
                :(<p className="!text-[20px]"><span onClick={() => navigate(`login`)} className="text-accent/80 ml-2 font-bold hover:font-extrabold cursor-pointer">Login</span></p>)}
            
        </div>
    )
}