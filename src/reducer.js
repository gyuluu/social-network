export default function reducer(state = {}, action) {
    if (action.type === "GET_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes
        };
    }
    if (action.type === "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map(fw => {
                if (fw.id === action.otherId) {
                    return {
                        ...fw,
                        accepted: true
                    };
                } else {
                    return {
                        ...fw
                    };
                }
            })
        };
    }
    if (action.type === "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                fw => fw.id != action.otherId
            )
        };
    }
    if (action.type === "GET_LAST_CHAT_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }
    if (action.type === "ADD_CHAT_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.chatMessage[0]]
        };
    }
    return state;
}
