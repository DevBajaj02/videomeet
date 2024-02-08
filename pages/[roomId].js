import { useSocket } from "@/context/socket"
import { useEffect, useState } from "react";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import Player from "@/component/Player";
import Bottom from "@/component/Bottom";
import usePlayer from "@/hooks/usePlayer";
import { useRouter } from "next/router";
import { clone, cloneDeep } from "lodash";
const Room = () => {
    const socket = useSocket();
    const {roomId} = useRouter().query;
    const { peer, myId } = usePeer();
    const { stream } = useMediaStream();
    const {players, setPlayers, playerHighlighted, nonHighlighted, toggleAudio, toggleVideo, leaveRoom} = usePlayer(myId, roomId, peer);

    const [users,setUsers]=useState([])

    useEffect(()=>{
        if(!socket || !peer || !stream) return;
        const handleUserConnected =(newUser)=>{
            console.log(`user connected in room with userId ${newUser}`)
            const call = peer.call(newUser, stream)

            call.on('stream',(incomingStream)=>{
                console.log(`incoming stream from ${newUser}`)
                setPlayers((prev)=>({
                    ...prev,
                    [newUser]:{
                        url: incomingStream,
                        muted: false,
                        playing: true
                    }
                }))

                // here, storing the new users and their id, motive was to use it further, like disconnecting call
                setUsers((prev)=>({
                    ...prev, 
                    [newUser]: call
                }))
            })
        }
        socket.on('user-connected',handleUserConnected)
        return ()=>{
            socket.off('user-connected',handleUserConnected)
        }
    } ,[socket, peer, stream, setPlayers])    


    useEffect(()=>{
        if(!socket) return;
        const handleToggleAudio=(userId)=>{
            console.log(`user with id ${userId} toggled audio`)
            setPlayers((prev)=>{
                const copy=cloneDeep(prev)
                copy[userId].muted = !copy[userId].muted
                return {...copy}
            })
        }
        const handleToggleVideo=(userId)=>{
            console.log(`useqr with id ${userId} toggled video`)
            setPlayers((prev)=>{
                const copy=cloneDeep(prev)
                copy[userId].playing = !copy[userId].playing
                return {...copy}
            })
        }
        const handleUserLeave=(userId)=>{
            console.log(`user ${userId} leaving the room`);
            // here we are closing the call ######
            // close function working on "users", as it being "call" object
            users[userId]?.close()

            // also, removing that from players, to reflect the changes in UI, to remove that player's components
            const playersCopy=cloneDeep(players);
            delete playersCopy[userId];
            setPlayers(playersCopy);
        }
        socket.on('user-toggle-audio',handleToggleAudio)
        socket.on('user-toggle-video',handleToggleVideo)
        socket.on('user-leave',handleUserLeave)
        return()=>{
            socket.off('user-toggle-audio',handleToggleAudio)
            socket.off('user-toggle-video',handleToggleVideo)
            socket.off('user-leave',handleUserLeave)
        }
    },[socket, setPlayers])
    useEffect(()=>{
        if(!peer || !stream) return;
        peer.on('call',(call)=>{
            const {peer: callerId} = call;
            call.answer(stream)
            call.on('stream',(incomingStream)=>{
                console.log(`incoming stream from ${callerId}`)
                setPlayers((prev)=>({
                    ...prev,
                    [callerId]:{
                        url: incomingStream,
                        muted: false,
                        playing: true
                    }
                }))
                // here, storing the new users and their id, motive was to use it further, like disconnecting call
                setUsers((prev)=>({
                    ...prev, 
                    [callerId]: call
                }))
            })
        })
    },[peer, stream])

    useEffect(()=>{
        if(!stream || !myId) return;
        console.log(`setting my stream ${myId}`)
        setPlayers((prev)=>({
            ...prev,
            [myId]:{
                url: stream,
                muted: false,
                playing: true
            }
        }))
    },[myId, setPlayers, stream])
    return(
        <>
            <div className="absolute w-9/12 left-0 right-0 mx-auto top-20 bottom-50px h-calc(100vh - 20px - 100px)">
                {playerHighlighted && (<Player url={playerHighlighted.url} muted={playerHighlighted.muted} playing={playerHighlighted.playing} playerId={myId} isActive/>)}
            </div>

            <div className="absolute flex flex-col overflow-y-auto w-200px h-calc(100vh - 20px) right-20 top-20">
                {Object.keys(nonHighlighted).map((playerId) => {
                    const { url, muted, playing } = nonHighlighted[playerId];
                    return <Player key={playerId} url={url} muted={muted} playing={playing} playerId={myId} isActive={false} />;
                })}
            </div>

            <Bottom muted={playerHighlighted?.muted} playing={playerHighlighted?.playing} toggleAudio={toggleAudio} toggleVideo={toggleVideo} leaveRoom={leaveRoom}/>
        </>
    )


}

export default Room;