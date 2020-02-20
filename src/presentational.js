import React from "react";

export default function Presentational({ imageurl, showModal }) {
    console.log("imageurl: ", imageurl);
    imageurl = imageurl || "/default.png";
    return (
        <div className="profile-img-wrapper">
            <img
                className="small-profile-pic"
                onClick={showModal}
                src={imageurl}
            />
        </div>
    );
}
