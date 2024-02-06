import { Server } from "socket.io";

const SocketHandler=(req,res)=>{
    if(res.socket.server.io){
        console.log("server already connected");
    } else{
        const io = new Server(res.socket.server);
        res.socket.server.io=io
    
        io.on('connection',(socket)=>{
            console.log('server is connected');
            socket.on('join-room',(roomId, userId)=>{
                console.log(`new user ${userId} joined room ${roomId}`)
                socket.join(roomId)
                // broadcast the message to other users in the room that a user connected
                socket.broadcast.to(roomId).emit('user-connected',userId)
            })
        })
    }
    res.end();
}

export default SocketHandler;