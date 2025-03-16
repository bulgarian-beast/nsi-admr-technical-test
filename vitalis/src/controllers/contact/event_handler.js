/**
** Author: Sofian Belahouel
** Filename:
** File description: This file contains all the functions that allow us to
** Create Time: 2025-03-16 19:10:25
** Modified by: Sofian Belahouel
** Modified time: 2025-03-16 19:10:27
**/

const contact = require("../../models/contact.js");

async function contactInsertOne(data) {
    let patientExist = true; // Additionally: Check if data.patientID exist

    try {
        if (patientExist) {
            await contact.insertOne(data); // Data validation is done in the model definition
            console.log("Contact inserted successfully:", data);
            // Additionally, we can send a new message to another RabbitMQ queue.
            // This new message will contain information for a mailer microservice connected to RabbitMQ,
            // which will send a welcome email to the target email and provide a registration link.

            // Additionally, find the patient and send him an email to inform him that a new contact has been linked to his account.
        }
    } catch (error) {
        console.error("Database Error - Failed to insert contact:", error);
        throw error;
    }
}

async function contactChannelEventHandler(msg, channel) {
    const content = msg ? msg.content.toString() : undefined;
    const parsed = content ? JSON.parse(content) : undefined;
    let actions = {
        "INSERT_ONE": contactInsertOne,
        // Additional actions, ex:UPDATE, DELETE, can be added here.
    }

    if (parsed !== undefined
        && parsed.data !== undefined
        && Object.keys(actions).includes(parsed.action)) {
        try {
            await actions[parsed.action](parsed.data);
            return channel.ack(msg);
        } catch (error) {
            channel.nack(msg, false, true); // Something went wrong: should keep the message for later
            console.log(error);
            throw error;
        }
    }
    channel.nack(msg, false, false); // Message is not valid, should not keep the message
}

exports.contactChannelEventHandler = contactChannelEventHandler;