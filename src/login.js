import React from "react";
import axios from "./axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.logIn = this.logIn.bind(this);
    }

    handleChange(e) {
        console.log(e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log(this.state)
        );
    }

    logIn(e) {
        e.preventDefault();
        axios
            .post("/login", this.state)
            .then(resp => {
                if (resp.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log("err in post /newuser: ", err);
                this.setState({
                    error: true
                });
            });
    }

    render() {
        return (
            <div className="login">
                <form>
                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        onChange={this.handleChange} //this refers to the current component
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={this.handleChange} //this refers to the current component
                    />
                    <button onClick={this.logIn}>Submit</button>
                    <br />
                </form>
            </div>
        );
    }
}
