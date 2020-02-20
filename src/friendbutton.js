import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ otherId }) {
    const [button, setButton] = useState([]);

    useEffect(() => {
        axios.get("/friends/" + otherId).then(resp => {
            setButton(resp.data);
        });
    }, []);

    const funcObj = {
        addfriend: function(e) {
            e.preventDefault();
            axios.post("/addfriend/" + otherId).then(resp => {
                setButton(resp.data);
            });
        },
        cancelfriend: function(e) {
            e.preventDefault();
            axios.post("/cancelfriend/" + otherId).then(resp => {
                setButton(resp.data);
            });
        },
        acceptfriend: function(e) {
            e.preventDefault();
            axios.post("/acceptfriend/" + otherId).then(resp => {
                setButton(resp.data);
            });
        },
        unfriend: function(e) {
            e.preventDefault();
            axios.post("/unfriend/" + otherId).then(resp => {
                setButton(resp.data);
            });
        }
    };

    return (
        <div>
            {button.map(btn => (
                <button key={btn.text} onClick={funcObj[btn.func]}>
                    {btn.text}
                </button>
            ))}
        </div>
    );
}
