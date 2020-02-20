import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [search, setSearch] = useState("");
    const [people, setPeople] = useState([]);

    useEffect(
        () => {
            let ignore = false;
            (async () => {
                const { data } = await axios.get("/findusers/" + search);
                if (!ignore) {
                    setPeople(data);
                }
            })();
            return () => {
                ignore = true;
            };
        },
        [search]
    );

    useEffect(() => {
        axios.get("/findusers").then(resp => {
            setPeople(resp.data);
        });
    }, []);

    const onSearchChange = e => {
        setSearch(e.target.value);
    };

    return (
        <div className="wrapper">
            <div>
                <h1 className="h1-title">Find People</h1>
                <p>Checkout who just joined The Creators Network!</p>
                <br />
                <input onChange={onSearchChange} defaultValue={search} />
                {people.map(user => (
                    <div key={user.id} className="people">
                        <Link to={`/user/${user.id}`} target="_blank">
                            <img className="users" src={user.url} />
                        </Link>
                        <p>
                            {user.first} {user.last}
                        </p>
                        <br />
                        <br />
                    </div>
                ))}
            </div>
        </div>
    );
}
