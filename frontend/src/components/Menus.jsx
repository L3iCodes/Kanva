import { PanelLeftClose, Pen, Trash } from 'lucide-react'

export default function SectionMenu(){
    return(
        <div className="flex flex-col gap-2 items-start absolute right-[-140px] z-10 top-8 w-[200px] p-2 bg-primary rounded-[5px] shadow-lg shadow-secondary/30 text-secondary text-[12px]">
            <button className="flex items-center gap-2 hover:bg-accent w-full">
                <PanelLeftClose className='w-[18px]'/>
                Collapse
            </button>
            <button className="flex items-center gap-2 hover:bg-accent w-full">
                <Pen className='w-[18px]'/>
                Rename
            </button>
            <button className="flex items-center gap-2 hover:bg-accent w-full">
                <Trash className='w-[18px]'/>
                Delete
            </button>
        </div>
    )
}
