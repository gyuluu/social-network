import React, { useState, useEffect } from "react";
import Presentational from "./presentational";
import BioEditor from "./bioeditor";

export default function Profile({
    first,
    last,
    bio,
    imageurl,
    showModal,
    setBio
}) {
    return (
        <div>
            <div id="profile">
                <Presentational
                    first={first}
                    last={last}
                    imageurl={imageurl}
                    showModal={showModal}
                />
                <div className="profile-bio">
                    <h1>
                        {first} {last}
                    </h1>
                    <BioEditor bio={bio} setBio={setBio} />
                </div>
            </div>
        </div>
    );
}

