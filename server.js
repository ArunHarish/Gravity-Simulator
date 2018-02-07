"use strict";

const express = require("express");
const app = express();
const path = require("path");

app.locals.projectName = "Gravity-Simulator";
app.locals.rootDir = "content";

app.use(
    express.static(
        path.join(__dirname, "/static/")
    )
);

app.listen(8000);