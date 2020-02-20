import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend
} from "./actions";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(friends => {
                return friends.accepted == true;
            })
    );
    const wannabes = useSelector(
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(friends => {
                return friends.accepted == false;
            })
    );
    const acceptData = useSelector(state => state.acceptData);

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    return (
        <div className="wrapper">
            <div>
                <h1>These people want to be your friends</h1>
                <div className="fw-wrapper">
                    {wannabes &&
                        wannabes.map((fw, index) => {
                            return (
                                <div key={index} className="fw">
                                    <Link to={`/user/${fw.id}`} target="_blank">
                                        <img src={fw.url} />
                                    </Link>
                                    <div className="fw-vert">
                                        <p>
                                            {fw.first} {fw.last}
                                        </p>

                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    acceptFriendRequest(fw.id)
                                                )
                                            }
                                        >
                                            Accept Friend Request
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <h1>These people are currently your friends</h1>
                <div className="fw-wrapper">
                    {friends &&
                        friends.map((fw, index) => {
                            return (
                                <div key={index} className="fw">
                                    <Link to={`/user/${fw.id}`} target="_blank">
                                        <img src={fw.url} />
                                    </Link>
                                    <div className="fw-vert">
                                        <p>
                                            {fw.first} {fw.last}
                                        </p>

                                        <button
                                            onClick={() =>
                                                dispatch(unfriend(fw.id))
                                            }
                                        >
                                            End Friendship
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
