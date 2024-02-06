import { useSocket } from "@/context/socket"
import { cloneDeep } from "lodash"

const { useState } = require("react")

const usePlayer=(myId, roomId)=>{
    const socket=useSocket()
    const [players, setPlayers]=useState({})
    const playersCopy=cloneDeep(players)       // we don't want shallow copy

    const playerHighlighted = playersCopy[myId]
    delete playersCopy[myId]

    const nonHighlighted= playersCopy

    const toggleAudio = () =>{
        console.log("audio toggled")
        setPlayers((prev)=>{
            const copy=cloneDeep(prev)
            copy[myId].muted = !copy[myId].muted
            return {...copy}
        })

        socket.emit('user-toggle-audio',myId,roomId)
    }
    const toggleVideo = () =>{
        console.log("video toggled")
        setPlayers((prev)=>{
            const copy=cloneDeep(prev)
            copy[myId].playing = !copy[myId].playing
            return {...copy}
        })

        socket.emit('user-toggle-video',myId,roomId)
    }
    return {players, setPlayers, playerHighlighted, nonHighlighted, toggleAudio, toggleVideo}
}

export default usePlayer;