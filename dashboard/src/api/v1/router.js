/**
** Author: Sofian Belahouel
** Filename:
** File description: This file contains all the functions that allow us to
** Create Time: 2025-03-16 15:28:25
** Modified by: Sofian Belahouel
** Modified time: 2025-03-16 15:28:33
**/

const router = require("express").Router();
const { check, validationResult } = require('express-validator');
const relationType = require("./constants/relation_type.js");
const regex = require("./constants/regex.js");

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: errors.array().map(err => ({
                field: err.param,
                code: err.msg.code,
                message: err.msg.message
            })),
        });
    }
    next();
}

router.post("/register-contact", [
    check('email').trim().escape().isEmail().normalizeEmail()
        .withMessage({ code: "ERROR_REGISTER_EMAIL", message: "Invalid email format" }),
    check("patientID").trim().escape().matches(regex.digitOnly)
        .withMessage({ code: "ERROR_REGISTER_PATIENT_ID", message: "Patient ID must contain only digits" }),
    check("lastName").trim().escape().isLength({ min: 3, max: 255 })
        .withMessage({ code: "ERROR_REGISTER_LAST_NAME", message: "Last name must be between 3 and 255 characters" }),
    check("firstName").trim().escape().isLength({ min: 3, max: 255 })
        .withMessage({ code: "ERROR_REGISTER_FIRST_NAME", message: "First name must be between 3 and 255 characters" }),
    check("relation").trim().escape().isIn(relationType.ALLOWED_ENTRIES)
        .withMessage({ code: "ERROR_REGISTER_RELATION", message: `Relation must be one of: ${relationType.ALLOWED_ENTRIES.join(", ")}` }),
    handleValidationErrors
], async (req, res) => {
    const message = {
        action: "INSERT_ONE",
        data: {
            patientID: req.body.patientID,
            email: req.body.email,
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            relation: req.body.relation,
        },
        timestamp: new Date().toISOString(),
    };

    try {
        req.rabbitChannel.sendToQueue(
            process.env.RABBITMQ_QUEUE_NAME_RELATION_CONTACT,
            Buffer.from(JSON.stringify(message)),
            { persistent: true },
        );
        console.log("Message sent to RabbitMQ:", message);
        return res.status(200).json({
            status: "success",
            message: "Contact registered successfully and message sent to queue",
            data: message
        });
    } catch (error) {
        console.error("RabbitMQ Send Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Our services are restarting please try again later",
            error: {
                "code": "ERROR_RABBIT_UNAVAILABLE",
            }
        });
    }
});

module.exports = router;
