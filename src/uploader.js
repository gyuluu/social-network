import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.file = e.target.files[0];
    }

    handleClick(e) {
        e.preventDefault();
        console.log("this: ", this);
        var formData = new FormData();
        formData.append("file", this.file);
        axios
            .post("/upload", formData)
            .then(resp => {
                this.props.setPresentational(resp.data.rows[0].url);
                this.props.showModal();
            })
            .catch(function(err) {
                console.log("err in post /upload: ", err);
            });
    }

    render() {
        return (
            <div className="modal">
                <div className="modal-popup">
                    <a className="xx" onClick={this.props.showModal}>
                        X
                    </a>
                    <h3>Add a new profile picture:</h3>
                    <form>
                        <input
                            onChange={this.handleChange}
                            type="file"
                            name="file"
                            accept="image/*"
                            id="file-upload"
                        />
                        <button onClick={this.handleClick}>Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}
