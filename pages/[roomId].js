import { useSocket } from "@/context/socket"
import { useEffect } from "react";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import Player from "@/component/Player"
import usePlayer from "@/hooks/usePlayer";
const Room = () => {
    const socket = useSocket();
    const { peer, myId } = usePeer();
    const { stream } = useMediaStream();
    const {players, setPlayers, playerHighlighted, nonHighlighted} = usePlayer(myId);
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
            })
        }
        socket.on('user-connected',handleUserConnected)
        return ()=>{
            socket.off('user-connected',handleUserConnected)
        }
    } ,[socket, peer, stream, setPlayers])    

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

            
        </>
    )


}

export default Room;