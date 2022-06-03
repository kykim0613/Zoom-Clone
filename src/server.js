import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + '/views');
app.use("/public", express.static(__dirname + '/public'))
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const handleListen = () => console.log(`Listen on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);


const publicRoom = () => {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;

    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

wsServer.on("connection", socket => {
    wsServer.sockets.emit("room_change", publicRoom());
    socket["nickname"] = "Yunki";
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.log((`Socket Event: ${event}`));
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done()
        socket.to(roomName).emit("welcome!", socket.nickname);
        wsServer.sockets.emit("room_change", publicRoom());
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname));
    })
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    })
    socket.on("nickname", nickname => socket["nickname"] = nickname)
})

httpServer.listen(3000, handleListen);














// const sockets = [];

// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Yunki";
//     console.log("Connected to Browser");
//     socket.on("close", () => console.log("Disconnected Client"))
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch(message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket =>
//                     aSocket.send(`${socket.nickname}: ${message.payload}`));
//             case "nickname":
//                 socket["nickname"] = message.payload;
//         }

//     })
// })
