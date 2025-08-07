import { ChevronDown, ChevronUp, House, Kanban, MoonStar, SunMedium, LogOut, LogIn  } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

function Navbar(){
    const location = useLocation();
    const currentPath = location.pathname;

    // Navbar Controls
    const [navbarOpen, setNavbarOpen] = useState(false)
    const {user, logout} = useAuth();
    const handleNavbar = () => setNavbarOpen(state => !state)
    const navigate = useNavigate()

    // Theme Control (Darkmode / LightMode)
    const [isDark, setIsDark] = useState(false)
    const handleDarkMode = () => setIsDark(state => !state)
    useEffect(()=>{
        document.documentElement.setAttribute('data-theme', isDark ? 'dark': 'light')
    }, [isDark])

    return(
        <>
            <div 
                className={`flex justify-center items-center py-3 h-[50px] w-[50px] rounded-b-[0px] bg-secondary text-primary absolute
                           md:flex-col md:h-full md:rounded-b-[20px] md:static
                           transition-all duration-50 ease-in 
                           ${navbarOpen && ('flex-col w-[50px] h-full static')}`}
            >
                {/* Navbar Toggle */}
                {navbarOpen ? (
                    <ChevronUp 
                        title='Menu'
                        onClick={handleNavbar}
                        className="icon !bg-accent mb-auto md:opacity-0"
                    />
                    ) : (
                    <ChevronDown
                        title='Menu'
                        onClick={handleNavbar}
                        className="icon !bg-accent md:mb-auto md:opacity-0"
                    />
                )}


                {/* Page Navigation Icons */}
                <div className={`md:flex flex-col items-center gap-3
                                ${navbarOpen ? 'flex' : 'hidden'}`}
                >
                    {user 
                        ?(
                            <div 
                                onClick={() => navigate(`/board-list`)} 
                                title='Kanban'>
                                <Kanban className={`icon ${(currentPath === '/board-list' || currentPath.startsWith('/kanban')) && 'bg-accent'}`}/>
                            </div>)
                        : (
                            <div 
                                onClick={() => navigate(`/`)} 
                                title='Home'>
                                    <House className={`icon ${currentPath === '/' && ('bg-accent')}`} />
                            </div>
                        )}
                    
                </div>
                

                {/* Theme Toggle */}
                <div 
                    title={isDark ? 'Toggle Light Mode' : 'Toggle Dark Mode'}
                    className={`md:flex flex-col items-center gap-3 mt-auto
                                ${navbarOpen ? 'flex' : 'hidden'}`}
                >

                    {isDark? (
                        <MoonStar 
                            onClick={handleDarkMode}
                            className='icon'
                        />
                    ) : (
                        <SunMedium 
                            onClick={handleDarkMode}
                            className='icon'
                        />
                    )}
                    {user 
                        ? (<div 
                                onClick={() => {
                                    logout();
                                    navigate(`/`);
                                }} 
                                title='Logout'>
                                    <LogOut className='icon'/>
                            </div>) 
                        : (<div onClick={() => navigate('/login')} title='Login'><LogIn className='icon'/></div>)}
                    
                </div>
                
            </div>
        </>
    )
}

export default Navbar;