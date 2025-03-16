/**
** Author: Sofian Belahouel
** Filename:
** File description: This file contains all the functions that allow us to
** Create Time: 2025-03-16 15:26:48
** Modified by: Sofian Belahouel
** Modified time: 2025-03-16 15:28:47
**/

const express = require("express");
const v1Router = require("./api/v1/router.js");

const app = express();

app.use(express.json());

app.use("/api/v1", v1Router);

app.get("/alive", (req, res) => {
    return res.sendStatus(200);
});

app.listen(process.env.CONTAINER_INTERNAL_PORT, () => {
    console.log(`Server listen on http://127.0.0.1:${process.env.CONTAINER_INTERNAL_PORT}`);
    console.log(`Healthcheck at http://127.0.0.1:${process.env.CONTAINER_INTERNAL_PORT}/alive`);
});