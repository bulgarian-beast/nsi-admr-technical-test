/**
**  ULTIMSOFT LABORATORY'S : HOPE THE FUTURE
**  Author: Sofian Belahouel
**  Filename:
**  File description: This file contains all the functions that allow us to
**  Create Time: 2025-03-16 18:03:03
**  Modified by: Sofian Belahouel
**  Modified time: 2025-03-16 18:10:36
**/

const mongoose = require("mongoose");
const { initRabbitMQChannel } = require("./src/controllers/init_rabbitmq.js");
const { contactChannelEventHandler } = require("./src/controllers/contact/event_handler.js");

async function main() {
    const channel = await initRabbitMQChannel();

    await mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo/prod?authSource=${process.env.MONGO_INITDB_DATABASE}`);
    channel.consume(process.env.RABBITMQ_QUEUE_NAME_RELATION_CONTACT,
        (msg) => contactChannelEventHandler(msg, channel),
        { noAck: false },
    );
    return 0;
}

main().then((_) => 0);
