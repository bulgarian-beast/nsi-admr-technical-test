/**
**  Author: Sofian Belahouel
**  Filename:
**  File description: This file contains all the functions that allow us to
**  Create Time: 2025-03-16 19:04:41
**  Modified by: Sofian Belahouel
**  Modified time: 2025-03-16 19:04:53
**/

const mongoose = require("mongoose");
const relation = require("../constants/relation_type.js");

const ContactSchema = new mongoose.Schema(
    {
        patientID: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
            min: 3,
            max: 255
        },
        lastName: {
            type: String,
            required: true,
            min: 3,
            max: 255
        },
        relation: {
            type: String,
            required: true,
            enum: relation.ALLOWED_ENTRIES,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("ContactSchema", ContactSchema, "ContactSchema");
