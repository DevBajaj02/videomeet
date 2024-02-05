import {v4 as uuidv4} from "uuid";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter()
  const [roomId, setRoomId] = useState('');

  const createAndJoin=()=>{
    const roomId = uuidv4()
    router.push(`/${roomId}`)
  }
  
  const joinRoom =()=>{
    if(roomId) router.push(`/${roomId}`)
    else { 
        alert("Provide a valid Room Id") 
    }
  }
  // useEffect(()=>{
  //   socket?.on("connect",()=>{
  //     console.log(socket.id);
  //   })
  // },[socket])
  return (<>
  <div className="w-4/12 mx-auto p-2 border border-white rounded mt-8 text-white flex flex-col items-center">
    <h1 className="text-xl text-center">Welcome to Vid Meet</h1>
    <div className="flex flex-col items-center mt-3 w-full">
      <input placeholder="Enter Room Id" value={roomId} onChange={(e)=>setRoomId(e?.target.value)} className="text-black text-lg p-1 rounded w-9/12 mb-3"/>
      <button  onClick={joinRoom} className="bg-buttonPrimary py-2 px-4 rounded">Join Room</button>
    </div>
    <span className="my-3 text-xl">OR</span>
    <button onClick={createAndJoin}  className="bg-buttonPrimary py-2 px-4 rounded">New Room</button>
    </div>
    </>
  )
}
