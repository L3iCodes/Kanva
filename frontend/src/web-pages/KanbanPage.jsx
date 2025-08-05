import { useEffect, useReducer, useState } from "react";
import { board_reducer } from "../reducers/board_reducer";
import Board from "../components/Board"
import { useParams } from 'react-router-dom';

export default function KanbanPage(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;
    console.log(BACKEND_URL)
    const { id } = useParams()
    const [board, dispatch] = useReducer(board_reducer, null)  

    // Retrieve board data
    useEffect(() => {
      fetch(`${BACKEND_URL}/kanban/${id}`, {

      })
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: 'INIT',
          payload: data.board
        })
      })
    }, [id])

    // Update board data in the db
    useEffect(() => {
      if (!board) return;
      console.log('BOARD UPDATE')

      fetch(`${BACKEND_URL}/update-board/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(board)
      }).then(res => {
        if (!res.ok){
          console.log(`Error updating board ${id}`)
        }
      })
    }, [board])

    return(
        <>
            <div className="pageWrapper !h-full !w-full text-secondary">
                {board && (
                  <Board board={board} dispatch={dispatch}/>
                )}
            </div>
        </>
    )
}