import { ChevronDown, LogIn, Bell, Check, X } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Feedback from './Feedback';

export default function Header(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;
    const { user, token, refresh } = useAuth()
    const [messageList, setMessageList] = useState([])
    const [openMessage, setOpenMessage] = useState(false)
    const [openFeedback, setOpenFeedback] = useState(false)
    const [feedbackTimer, setFeedbackTimer] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState('')
    const [boardName, setBoardName] = useState('')
    
    const navigate = useNavigate()
    const handleMessages = async () => {
        fetch(`${BACKEND_URL}/retrieve/messages`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            setMessageList(data.message_list.messages)
        })
    }

    const handleMessageResponse = async (response, message, index) => {
        fetch(`${BACKEND_URL}/message/response`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                response,
                message
            })
        })
        .then(res => res.json())
        .then(data => {
            refresh();
            setFeedbackMessage(data)
            messageList.splice(index, 1)
            setOpenFeedback(true)
            setBoardName(message.boardName)

            if (feedbackTimer) {
                clearTimeout(feedbackTimer);
            }
            
            // Set new timer
            const timer = setTimeout(() => {
                setOpenFeedback(false);
                setBoardName('');

            }, 3000);
            
            setFeedbackTimer(timer);
        })
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (feedbackTimer) {
                clearTimeout(feedbackTimer);
            }
        };
    }, [feedbackTimer]);

    return(
        <div 
            className="flex flex-row items-center h-[50px] py-5 px-3 gap-3 bg-secondary text-primary">
            <h1 className="font-bold text-2xl ml-[50px] md:ml-[0px]">kanva</h1>
            
            <Feedback message={`[${boardName}] ${feedbackMessage.message}`} openFeedback={openFeedback}/>
            
            {user ? 
                (
                    <div className='flex w-full justify-end items-center gap-2 relative'>
                        <Bell 
                            onClick={() => {
                                handleMessages()
                                setOpenMessage(state => !state)
                            }} 
                            className='icon' />
                        <div className='w-[30px] h-[30px] rounded-full bg-accent' />
                        <p className='text-[12px] min-w-[50px] truncate'>{user.username}</p>
                        
                        {openMessage && (
                            <div className='flex flex-col gap-2 w-[300px] bg-primary absolute text-secondary top-11 border-1 border-secondary/80 shadow-lg shadow-secondary rounded-[5px] z-10'>
                                <p className='!text-[15px] m-1'>Notifications</p>
                                
                                {messageList && messageList.map((message, index) => (
                                    <div 
                                        key={message._id}
                                        className='flex w-full border-t-1 border-secondary/30 p-2 cursor-pointer hover:bg-secondary/5 z-10'>
                                        <p><span className='font-bold text-accent'>{`${message.sender}`}</span> want to share <span className='font-bold'>[{message.boardName}]</span> with you</p>
                                        
                                        <div className='flex items-center ml-auto gap-2'>
                                            <Check 
                                                onClick={() => handleMessageResponse('accept', message, index)}
                                                className='w-[20px] h-[20px] rounded-[2px] text-secondary/30 hover:bg-green-500 hover:text-secondary'/>
                                            <X 
                                                onClick={() => handleMessageResponse('reject', message, index)}
                                                className='w-[20px] h-[20px] rounded-[2px] text-secondary/30 hover:bg-red-500 hover:text-secondary'/>
                                        </div>
                                        
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        
                    </div>
                )
                :
                (
                    <div 
                        onClick={() => navigate('/login')} 
                        title='Login' 
                        className='flex ml-auto items-center hover:bg-accent px-1 rounded-[5px] cursor-pointer text-[14px]'
                        >Login<LogIn className='ml-1 icon'/></div>
                )
            }
            
            
        </div>
    )
}