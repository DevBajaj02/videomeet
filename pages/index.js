import {v4 as uuidv4} from "uuid";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdOutlinePersonPin } from "react-icons/md";
import { TbVideoPlus } from "react-icons/tb";

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
  return (
    <div className=" items-center justify-center h-screen flex-col mt-10">
      <div className="justify-center flex  mb-16">
        <MdOutlinePersonPin size={120} color="#CEC3A0"/>
      </div>
      <h1 className="text-6xl text-center font-serif mb-5">Sammukh</h1>

      <div className="w-8/12 min-h-96 mx-auto p-2 rounded-3xl text-white flex flex-col items-center">
        <div className="flex flex-col gap-5 sm:flex-row items-center mt-6 w-full pl-20 ">
          <input
            placeholder="Enter Room code"
            value={roomId}
            onChange={(e) => setRoomId(e?.target.value)}
            className="text-black text-lg pl-5 h-14 rounded-lg  w-10/12 "
          />
          <button
            onClick={joinRoom}
            className={`bg-buttonPrimary py-2 px-1 w-24 h-12 rounded-2xl ${!roomId ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!roomId}
          >
            Join Room
          </button>
        </div>
        <div className="flex items-center mt-5 mb-3">
  <div className="border-t border-gray-300 flex-grow h-px"></div>
  <span className="mx-3 text-xl">or</span>
  <div className="border-t border-gray-300 flex-grow h-px"></div>
</div>
        <button onClick={createAndJoin} className="bg-buttonPrimary  w-96 mt-5 h-14 py-1 px-1  rounded-2xl flex  items-center justify-center gap-3 ">
          <p className="text-2xl ">New Room</p>
          <TbVideoPlus size={35} className="mt-1"/>
        </button>
      </div>
    </div>
  );
}
