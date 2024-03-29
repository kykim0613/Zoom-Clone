const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;
let nickname;

const addMessage = (message) => {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

const handleNicknameSubmit = (event) => {
    event.preventDefault();
    const input = room.querySelector("#name input");
    nickname = input.value;
    socket.emit("nickname", nickname)
    input.value = "";
}

const handleMessageSubmit = (event) => {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
        addMessage(`${nickname}: ${value}`);
    });
    input.value = "";
}

const showRoom = () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room: ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

const handleRoomSubmit = (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} joined!`);
})

socket.on("bye", (left) => {
    addMessage(`${left} left!`);
})

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    if(rooms.length === 0) {
        roomList.innerHTML = "";
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li")
        li.innerText = room;
        roomList.append(li)
    })
});



// ⬇⬇⬇ used web sockets! ⬇⬇⬇

// const messageList = document.querySelector("ul");
// const nickForm = document.querySelector("#nick");
// const messageForm = document.querySelector("#message");

// const socket = new WebSocket(`ws://${window.location.host}`)


// const makeMessage = (type, payload) => {
//     const msg = {type, payload};
//     return JSON.stringify(msg);
// }
// socket.addEventListener("open", () => {
//     console.log("Connected to Server")
// })

// socket.addEventListener("message", (message) => {
//     const li = document.createElement("li");
//     li.innerText = message.data;
//     messageList.append(li);
// })

// socket.addEventListener("close", () => {
//     console.log("Disconnected from Server ")
// })

// const handleSubmit = (event) => {
//     event.preventDefault();
//     const input = messageForm.querySelector("input");
//     socket.send(makeMessage("new_message", input.value));
//     input.value="";
// }

// const handleNickSubmit = (event) => {
//     event.preventDefault();
//     const input = nickForm.querySelector("input");
//     socket.send(makeMessage("nickname", input.value));
//     input.value="";
// }

// messageForm.addEventListener("submit", handleSubmit);
// nickForm.addEventListener("submit", handleNickSubmit);