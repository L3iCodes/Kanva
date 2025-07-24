import Board from "../components/Board"

const sampleData = {
  id: 123,
  owner: 1001,
  title: 'Vysta - A Movie Website App',
  desc: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae dolore deleniti facere voluptatem reiciendis officiis asperiores optio repellat.',
  sections: {
    'To-Do': [
      {
        task_name: 'Research and Planning',
        checklist: [
          { sub_task: 'Gather requirements', done: false  },
          { sub_task: 'Analyze competitors', done: false  }
        ]
      },
      {
        task_name: 'Design UI Wireframes',
        checklist: [
          { sub_task: 'Sketch homepage', done: false  },
          { sub_task: 'Sketch movie detail page', done: false  }
        ]
      },
      {
        task_name: 'Define Tech Stack',
        checklist: [
          { sub_task: 'Choose frontend framework' },
          { sub_task: 'Select database', done: false  }
        ]
      },
      {
        task_name: 'Set up GitHub Repository',
        checklist: [
          { sub_task: 'Create repo' },
          { sub_task: 'Add collaborators', done: false  }
        ]
      }
    ],
    'In Progress': [
      {
        task_name: 'Build Navbar Component',
        checklist: [
          { sub_task: 'Add logo and nav links', done: false  },
          { sub_task: 'Make it responsive', done: false  }
        ]
      },
      {
        task_name: 'Implement Movie API Integration',
        checklist: [
          { sub_task: 'Fetch movie data', done: false  },
          { sub_task: 'Handle loading state', done: false  }
        ]
      },
      {
        task_name: 'Create Login Page',
        checklist: [
          { sub_task: 'Email/password fields', done: false  },
          { sub_task: 'Form validation', done: false  }
        ]
      },
      {
        task_name: 'Setup Routing',
        checklist: [
          { sub_task: 'Install React Router', done: false  },
          { sub_task: 'Define routes', done: false  }
        ]
      }
    ],
    'Done': [
      {
        task_name: 'Create Project Plan',
        checklist: [
          { sub_task: 'Define milestones', done: false  },
          { sub_task: 'Assign deadlines', done: false  }
        ]
      },
      {
        task_name: 'Install Node.js & VS Code',
        checklist: [
          { sub_task: 'Install Node.js', done: false  },
          { sub_task: 'Install VS Code extensions', done: false  }
        ]
      },
      {
        task_name: 'Set Up Tailwind CSS',
        checklist: [
          { sub_task: 'Install Tailwind', done: false  },
          { sub_task: 'Configure tailwind.config.js', done: false  }
        ]
      },
      {
        task_name: 'Create App Skeleton',
        checklist: [
          { sub_task: 'Set up basic layout', done: false },
          { sub_task: 'Add page wrapper', done: false}
        ]
      }
    ]
  }
};

export default function KanbanPage(){
    
    Object.entries(sampleData.sections).map(([section, main_tasks]) => {
        console.log(`SECTION: ${section}`);

        main_tasks.map(task => {
            console.log(`  Task: ${task.task_name}`);

            task.checklist.map((subtask) => {
                console.log(`       SubTask: ${subtask.sub_task}`)
            })
        })
        
    });
        
    return(
        <>
            <div className="pageWrapper !h-full text-secondary !overflow-hidden">
                <Board details={sampleData} />
            </div>
        </>
    )
}