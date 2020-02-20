import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function Posts({ otherId, setPosts }) {
    const [post, setPost] = useState(false);
    const [posting, setPosting] = useState();
    const showPost = function() {
        setPost(true);
    };

    let handleChange = e => {
        setPosting(e.target.value);
    };

    let addPosting = e => {
        e.preventDefault();
        let postData = {
            posting: posting,
            otherId: otherId
        };
        axios
            .post("/addposting", postData)
            .then(resp => {
                setPosts(resp.data[0]);
                setPost(false);
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            {post ? (
                <form>
                    <textarea
                        rows="10"
                        cols="30"
                        name="post"
                        onChange={handleChange}
                        placeholder="Add new post"
                    />
                    <br />
                    <button className="submit-post" onClick={addPosting}>
                        Submit Post
                    </button>
                </form>
            ) : (
                <div className="addpost" onClick={showPost}>
                    Add a new post
                </div>
            )}
        </div>
    );
}
