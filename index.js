const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");

const cookieSession = require("cookie-session");
const s3 = require("./s3");
const config = require("./config");

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2897152
    }
});

app.use(compression()); 
app.use(express.static("public"));
app.use(express.json());

const cookieSessionMiddleware = cookieSession({
    secret:
        process.env.NODE_ENV == "production"
            ? process.env.SESS_SECRET
            : require("./secrets").sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static("public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/newuser", (req, res) => {
    hash(req.body.password)
        .then(hash => {
            db.addUser(req.body.first, req.body.last, req.body.email, hash)
                .then(id => {
                    req.session.userId = id;
                    res.json({
                        data: id,
                        success: true
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        success: false
                    });
                });
        })
        .catch(e => console.log(e));
});

app.post("/login", (req, res) => {
    db.getHash(req.body.email)
        .then(result => {
            compare(req.body.password, result[0].password)
                .then(match => {
                    if (match) {
                        req.session.userId = result[0].id;
                        req.session.loggedIn = true;
                        res.json({
                            data: result,
                            success: true
                        });
                    } else {
                        res.json({
                            success: false
                        });
                    }
                })
                .catch(e => {
                    console.log(e);
                    res.json({
                        success: false
                    });
                });
        })
        .catch(e => {
            console.log(e);
        });
});

app.get("/user", (req, res) => {
    db.getUserInfo(req.session.userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => console.log(err));
});

app.get("/users/:id", (req, res) => {
    if (req.params.id != req.session.userId) {
        db.getUserInfo(req.params.id)
            .then(result => {
                res.json(result);
            })
            .catch(err => console.log(err));
    } else {
        res.json();
    }
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const url = config.s3Url + filename;
    db.insertUserImage(req.session.userId, url)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log("uploading error", err);
        });
});

app.post("/bio", (req, res) => {
    db.insertBio(req.session.userId, req.body.bio)
        .then(bio => {
            res.json(bio);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/findusers/:search", (req, res) => {
    db.getSearchUsers(req.params.search)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/findusers", (req, res) => {
    db.getLastUsers(req.session.userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/friends/:otherId", (req, res) => {
    let buttonBehaviour = [
        {
            text: "",
            func: ""
        }
    ];
    db.getFriendshipStatus(req.params.otherId, req.session.userId)
        .then(result => {
            if (result.length == 0) {
                buttonBehaviour[0].text = "Send Friend Request";
                buttonBehaviour[0].func = "addfriend";
                res.json(buttonBehaviour);
            } else {
                if (result[0].accepted == true) {
                    buttonBehaviour[0].text = "Unfriend";
                    buttonBehaviour[0].func = "unfriend";
                    res.json(buttonBehaviour);
                } else {
                    if (result[0].sender_id == req.session.userId) {
                        buttonBehaviour[0].text = "Cancel Friend Request";
                        buttonBehaviour[0].func = "addfriend";
                        res.json(buttonBehaviour);
                    } else {
                        buttonBehaviour[0].text = "Accept Friend Request";
                        buttonBehaviour[0].func = "acceptfriend";
                        res.json(buttonBehaviour);
                    }
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/addfriend/:otherId", (req, res) => {
    let buttonBehaviour = [
        {
            text: "",
            func: ""
        }
    ];
    db.addRelationship(req.params.otherId, req.session.userId, false)
        .then(result => {
            console.log("Inserting a new relationship results in: ", result);
            buttonBehaviour[0].text = "Cancel Friend Request";
            buttonBehaviour[0].func = "cancelfriend";
            res.json(buttonBehaviour);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/cancelfriend/:otherId", (req, res) => {
    let buttonBehaviour = [
        {
            text: "",
            func: ""
        }
    ];
    db.cancelRelationship(req.params.otherId, req.session.userId)
        .then(result => {
            buttonBehaviour[0].text = "Send Friend Request";
            buttonBehaviour[0].func = "addfriend";
            res.json(buttonBehaviour);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/acceptfriend/:otherId", (req, res) => {
    let buttonBehaviour = [
        {
            text: "",
            func: ""
        }
    ];
    db.acceptRelationship(req.params.otherId, req.session.userId, true)
        .then(result => {
            console.log("Accepting a relationship results in: ", result);
            buttonBehaviour[0].text = "Unfriend";
            buttonBehaviour[0].func = "unfriend";
            res.json(buttonBehaviour);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/unfriend/:otherId", (req, res) => {
    let buttonBehaviour = [
        {
            text: "",
            func: ""
        }
    ];
    db.cancelRelationship(req.params.otherId, req.session.userId)
        .then(result => {
            console.log("Unfriending a relationship results in: ", result);
            buttonBehaviour[0].text = "Send Friend Request";
            buttonBehaviour[0].func = "addfriend";
            res.json(buttonBehaviour);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/friends-wannabes", (req, res) => {
    db.getFriendsWannabes(req.session.userId)
        .then(result => {
            console.log("this is the list of friends and wannabes: ", result);
            res.json(result);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/friendship/:id", (req, res) => {
    db.getFriendshipStatus(req.params.id, req.session.userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => console.log(err));
});

app.post("/addposting", (req, res) => {
    db.getUserInfo(req.session.userId)
        .then(userData => {
            let url = userData[0].url;
            db.addPosting(
                req.body.posting,
                req.session.userId,
                req.body.otherId
            )
                .then(result => {
                    result[0].url = url;
                    res.json(result);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

app.get("/posts/:otherId", (req, res) => {
    db.getUserInfo(req.session.userId)
        .then(userData => {
            let url = userData[0].url;
            db.getPosts(req.params.otherId)
                .then(result => {
                    result[0].url = url;
                    res.json(result);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

io.on("connection", function(socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    let userId = socket.request.session.userId;
    socket.on("My amazing chat message", msg => {
        db.getUserInfo(userId)
            .then(userData => {
                let url = userData[0].url;
                let first = userData[0].first;
                let last = userData[0].last;
                db.addChatMessage(userId, msg)
                    .then(data => {
                        data[0].url = url;
                        data[0].first = first;
                        data[0].last = last;
                        io.sockets.emit("chatMessage", data);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
        io.sockets.emit("message from server", msg);
    });

    db.getLastTenChatMessages().then(data => {
        io.sockets.emit("chatMessages", data.reverse());
    });
});
