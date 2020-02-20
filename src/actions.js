import axios from "./axios";

export function getCuteAnimals() {
    return axios.get("/cute-animals.json").then(({ data }) => {
        return {
            type: "GET_ANIMALS",
            cuteAnimals: data
        };
    });
}

export function receiveFriendsWannabes() {
    return axios.get("/friends-wannabes").then(({ data }) => {
        return {
            type: "GET_FRIENDS_WANNABES",
            friendsWannabes: data
        };
    });
}

export function acceptFriendRequest(otherId) {
    return axios.post("/acceptfriend/" + otherId).then(resp => {
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            otherId
        };
    });
}

export function unfriend(otherId) {
    return axios.post("/unfriend/" + otherId).then(resp => {
        return {
            type: "UNFRIEND",
            otherId
        };
    });
}

export function chatMessages(msgs) {
    return {
        type: "GET_LAST_CHAT_MESSAGES",
        chatMessages: msgs
    };
}

export function chatMessage(msg) {
    return {
        type: "ADD_CHAT_MESSAGE",
        chatMessage: msg
    };
}
