"use strict";

const express = require("express");
const app = express();


app.locals.projectName = "Gravity-Simulator";
app.locals.rootDir = "content";

app.use(express.static(__dirname + "/"));

app.listen(8000);