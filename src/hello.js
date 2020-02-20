import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";

export default function Hello() {
    return (
        <div className="welcome">
            <div className="welcome-center">
                <h1>THE CREATORS NETWORK</h1>
                <h2>
                    Join the largest community of artists dedicated to creative
                    excellence.
                </h2>
                <div className="welcome-wrapper">
                    <img src="/default.png" />
                    <HashRouter>
                        <div>
                            <Route exact path="/" component={Registration} />
                            <Route exact path="/login" component={Login} />
                        </div>
                    </HashRouter>
                </div>
            </div>
        </div>
    );
}
