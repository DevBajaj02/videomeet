
export default function Home() {
 
  useEffect(()=>{
    socket?.on("connect",()=>{
      console.log(socket.id);
    })
  },[socket])
  return (
    <h1>Welcome</h1>
  )
}
