import { useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthProvider"

export default function HomePage(){
    const { user } = useAuth()
    const navigate = useNavigate()

    return(
        <div className="pageWrapper justify-center items-center h-full text-secondary">
            {!user && (
                <div className="flex flex-col ">
                    <p className="!text-[18px] md:!text-3xl">Get Started with</p>
                    <h1 className="text-[50px] md:text-[200px] font-bold">KANVA</h1>
                    <div className="flex gap-5 justify-center !text-[18px] md:!text-3xl md:gap-10"> 
                        <button 
                            onClick={() => navigate(`login`)}
                            className="w-[80px] md:w-[140px] px-2 bg-secondary text-primary rounded-[5px] cursor-pointer hover:bg-accent">Login</button>
                        <button 
                            onClick={() => navigate(`sign-up`)}
                            className="w-[80px] md:w-[140px] px-2 bg-secondary text-primary rounded-[5px] cursor-pointer hover:bg-accent">Signup</button>
                    </div>
                </div>
            )}
            
            {/* {!user
                ? (<h1 className="text-[50px] md:text-[200px] ">KANVA</h1>)
                : (<h1 className="text-[50px] md:text-[200px] ">DASHBOARD</h1>)} */}
            

            {/* {user 
                ? (<p className="!text-[20px]">Welcome  <span className="text-accent/80 ml-2 font-bold hover:font-extrabold cursor-pointer">{user.username}</span></p>)
                :(<p className="!text-[20px]"><span onClick={() => navigate(`login`)} className="text-accent/80 ml-2 font-bold hover:font-extrabold cursor-pointer">Login</span></p>)} */}
            
        </div>
    )
}