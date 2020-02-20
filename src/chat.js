import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export function Chat() {
    const chatMessages = useSelector(
        state => state && state.chatMessages 
    );

    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("My amazing chat message", e.target.value);
            e.target.value = "";
        }
    };

    const elemRef = useRef();

    useEffect(
        () => {
            elemRef.current.scrollTop =
                elemRef.current.scrollHeight - elemRef.current.clientHeight;
        },
        [chatMessages]
    );

    return (
        <div className="wrapper">
            <div>
                <h1 className="h1-title">Chat Room</h1>
                <div className="chat-messages" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((cm, index) => {
                            return (
                                <div key={index} className="chats">
                                    <img src={cm.url} />
                                    <div className="cm-vert">
                                        <p>
                                            {cm.first} {cm.last}
                                        </p>
                                        <p>{cm.message}</p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <textarea
                    placeholder="Add your message here"
                    onKeyDown={keyCheck}
                />
            </div>
        </div>
    );
}
