import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    (new Date(Date.now()).getMinutes() < 10 ? "0" : "") +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        return () => socket.removeListener("receive_message");
    }, [socket]);

    return (
        <div className="chatWindow">
            <div className="chatHeader">
                <p>
                    User: <i>{username}</i>
                    <br />
                    Room: <i>{room}</i>
                </p>
            </div>

            <div className="chatBody">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent, index) => {
                        return (
                            <div
                                key={index}
                                className={
                                    username === messageContent.author
                                        ? "message you"
                                        : "message other"
                                }
                            >
                                <div>
                                    <div className="message-content">
                                        <div className="message-initials">
                                            {messageContent.author.charAt(0)}
                                        </div>
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p className="time">
                                            {messageContent.time}
                                        </p>
                                        <p className="author">
                                            {messageContent.author}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ScrollToBottom>
            </div>

            <div className="chatFooter">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Type your message here"
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyUp={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#8594;</button>
            </div>
        </div>
    );
}

export default Chat;
