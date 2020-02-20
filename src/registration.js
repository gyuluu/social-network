import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.newUser = this.newUser.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log(this.state)
        );
    }

    newUser(e) {
        e.preventDefault();
        axios
            .post("/newuser", this.state)
            .then(resp => {
                if (resp.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(function(err) {
                console.log("err in post /newuser: ", err);
                this.setState({
                    error: true
                });
            });
    }

    render() {
        return (
            <div className="registration">
                {this.state.error && <div>Adding a new user failed.</div>}
                <form>
                    <input
                        name="first"
                        placeholder="first"
                        onChange={this.handleChange} 
                    />
                    <input
                        name="last"
                        placeholder="last"
                        onChange={this.handleChange} 
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        onChange={this.handleChange} 
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={this.handleChange} 
                    />
                    <button onClick={this.newUser}>Submit</button>
                    <br />
                    <p>
                        If you are already a user, please{" "}
                        <Link to="/login">log in</Link>
                    </p>
                </form>
            </div>
        );
    }
}
