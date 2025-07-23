import { ChevronDown, ChevronUp, House, Kanban, MoonStar, SunMedium, LogOut  } from 'lucide-react';
import { useEffect, useState } from 'react';

function Navbar(){
    // Navbar Controls
    const [navbarOpen, setNavbarOpen] = useState(false)
    const handleNavbar = () => setNavbarOpen(state => !state)

    // Theme Control (Darkmode / LightMode)
    const [isDark, setIsDark] = useState(false)
    const handleDarkMode = () => setIsDark(state => !state)
    useEffect(()=>{
        document.documentElement.setAttribute('data-theme', isDark ? 'dark': 'light')
    }, [isDark])

    return(
        <>
            <div 
                className={`flex justify-center items-center py-3 h-[50px] w-[50px] rounded-b-[0px] bg-secondary text-primary
                           md:flex-col md:h-full md:rounded-b-[20px]
                           transition-all duration-50 ease-in 
                           ${navbarOpen && ('flex-col w-[50px] h-full')}`}
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

                    <div title='Home'><House className='icon' /></div>
                    <div title='Kanban'><Kanban className='icon'/></div>
                    
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

                    <div title='Logout'><LogOut className='icon'/></div>
                </div>
                
            </div>
        </>
    )
}

export default Navbar;