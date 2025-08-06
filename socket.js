import {Server} from 'socket.io'

export const initializeSocket=(server)=>{
    const io=new Server(server,{cors:{origin:'http://localhost:3000'}})
    io.on('connection',(socket)=>{
        const userSockets=new Map()
        socket.on('user_connected',(userId)=>{
            userSockets.set(userId, socket.id);

            io.emit('user_connected',socket.id)
            socket.emit('user_connected',   Array.from(userSockets.keys()))
        })
        socket.on('send_message',(data)=>{
            
        })
        socket.on("disconnect", () => {
			let disconnectedUserId;
			for (const [userId, socketId] of userSockets.entries()) {
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					break;
				}
			}
			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
    })
}