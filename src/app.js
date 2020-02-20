import React from "react";
import Presentational from "./presentational";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from "./axios";
import Friends from "./friends";
import { Chat } from "./chat";

export class App extends React.Component {
    constructor() {
        super();
        this.state = {
            id: "",
            first: "",
            last: "",
            imageurl: "",
            bio: "",
            uploaderIsVisible: false
        };
        this.showModal = this.showModal.bind(this);
        this.setPresentational = this.setPresentational.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(resp => {
                console.log(
                    "this is the current user id in app: ",
                    resp.data[0].id
                );
                this.setState({
                    id: resp.data[0].id,
                    first: resp.data[0].first,
                    last: resp.data[0].last,
                    imageurl: resp.data[0].url,
                    bio: resp.data[0].bio
                });
            })
            .catch(err => console.log(err));
    }

    showModal() {
        if (this.state.uploaderIsVisible == false) {
            this.setState({
                uploaderIsVisible: true
            });
        } else {
            this.setState({
                uploaderIsVisible: false
            });
        }
    }

    setPresentational(imageurl) {
        this.setState({
            imageurl: imageurl
        });
    }

    setBio(bio) {
        this.setState({
            bio: bio
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div id="app">
                    <header>
                        <p className="logo">
                            <Link to="/">THE CREATORS NETWORK</Link>
                        </p>
                        <Link to="/findpeople">Find People </Link>
                        <Link to="/friendlist">Friends</Link>
                        <Link to="/chat">Chat</Link>
                        <br />
                        <a href="/logout" className="logout">
                            Log out
                        </a>
                        <Presentational
                            first={this.state.first}
                            last={this.state.last}
                            imageurl={this.state.imageurl}
                            showModal={this.showModal}
                        />
                    </header>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imageurl={this.state.imageurl}
                                showModal={this.showModal}
                                bio={this.state.bio}
                                setBio={this.setBio}
                                id={this.state.id}
                            />
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={props => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                                id={this.state.id}
                            />
                        )}
                    />
                    <Route path="/friendlist" render={() => <Friends />} />
                    <Route path="/chat" render={() => <Chat />} />
                    <Route path="/findpeople" render={() => <FindPeople />} />
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            setPresentational={this.setPresentational}
                            showModal={this.showModal}
                        />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
