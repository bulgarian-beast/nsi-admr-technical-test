/**
** Author: Sofian Belahouel
** Filename:
** File description: This file contains all the functions that allow us to
** Create Time: 2025-03-16 17:47:55
** Modified by: Sofian Belahouel
** Modified time: 2025-03-16 17:47:56
**/

const express = require("express");
const v1Router = require("../api/v1/router.js");

function initExpressApp(rabbitChannel) {
    const app = express();

    app.use(express.json());
    app.use("/api/v1", (req, res, next) => {
        req.rabbitChannel = rabbitChannel;
        next();
    }, v1Router);
    app.get("/alive", (req, res) => res.sendStatus(200));
    return app;
}

exports.initExpressApp = initExpressApp;