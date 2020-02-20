import React from "react";
import Presentational from "./presentational";
import FriendButton from "./friendbutton";
import Posts from "./posts";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            imageurl: "",
            bio: "",
            showPost: false,
            posts: []
        };
        this.setPosts = this.setPosts.bind(this);
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios
            .get("/users/" + id)
            .then(resp => {
                if (resp.data.length != 0) {
                    this.setState({
                        first: resp.data[0].first,
                        last: resp.data[0].last,
                        imageurl: resp.data[0].url,
                        bio: resp.data[0].bio
                    });
                } else {
                    this.props.history.push("/");
                }
            })
            .catch(err => console.log(err));
        axios
            .get("/friendship/" + id)
            .then(resp => {
                if (resp.data[0].accepted) {
                    this.setState({
                        showPost: true
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });

        axios
            .get("/posts/" + id)
            .then(resp => {
                this.setState({
                    posts: resp.data
                });
            })
            .catch(err => console.log(err));
    }

    setPosts(post) {
        this.setState({
            posts: [post, ...this.state.posts]
        });
    }

    render() {
        return (
            <div>
                <div id="profile">
                    <div className="profile-pic">
                        <Presentational imageurl={this.state.imageurl} />
                    </div>

                    <div className="profile-bio">
                        <h1>
                            {this.state.first} {this.state.last}
                        </h1>
                        <p>{this.state.bio}</p>
                        <FriendButton otherId={this.props.match.params.id} />
                    </div>
                </div>
                <div className="posts">
                    {this.state.showPost && (
                        <Posts
                            otherId={this.props.match.params.id}
                            setPosts={this.setPosts}
                        />
                    )}
                </div>
                <div className="wall-post-wrapper">
                    <div className="wall-post">
                        {this.state.posts.map(pt => (
                            <div key={pt.id} className="individual-post">
                                <img
                                    src={pt.url}
                                    className="small-profile-pic"
                                />
                                <p>{pt.post}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

