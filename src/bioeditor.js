import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdited: false,
            isSaved: false,
            bio: this.props.bio
        };
        this.showTextarea = this.showTextarea.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showTextareaSaved = this.showTextareaSaved.bind(this);
        this.addBio = this.addBio.bind(this);
    }

    showTextarea() {
        this.setState({
            isEdited: true
        });
    }

    showTextareaSaved() {
        this.setState({
            isSaved: true
        });
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log(this.state)
        );
    }

    addBio(e) {
        e.preventDefault();
        axios
            .post("/bio", this.state)
            .then(resp => {
                console.log(
                    "resp from server upload /bio: ",
                    resp.data.rows[0].bio
                );
                this.showTextareaSaved();
                this.setState({
                    isEdited: false
                });
                this.props.setBio(resp.data.rows[0].bio);
            })
            .catch(function(err) {
                console.log("err in post /bio: ", err);
            });
    }

    addBioDefault(e) {
        e.preventDefault();
        return;
    }

    render() {
        return this.state.isEdited ? (
            <div className="bioeditor">
                <form>
                    <textarea
                        rows="10"
                        cols="30"
                        name="bio"
                        placeholder="bio"
                        onChange={this.handleChange}
                        defaultValue={this.props.bio}
                    />
                    <br />
                    {this.state.bio ? (
                        <button onClick={this.addBio}>Save</button>
                    ) : (
                        <button onClick={this.addBioDefault}>Save</button>
                    )}
                </form>
            </div>
        ) : this.props.bio != null ? (
            <div className="bioeditor">
                <p>{this.props.bio}</p>
                <br />
                <a onClick={this.showTextarea} className="edit">
                    Edit
                </a>
            </div>
        ) : (
            <div className="bioeditor">
                <a onClick={this.showTextarea}>Add your bio now</a>
            </div>
        );
    }
}
