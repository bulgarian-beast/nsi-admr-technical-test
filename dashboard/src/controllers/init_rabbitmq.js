/**
**  Author: Sofian Belahouel
**  Filename:
**  File description: This file contains all the functions that allow us to
**  Create Time: 2025-03-16 17:46:31
**  Modified by: Sofian Belahouel
**  Modified time: 2025-03-16 17:46:35
**/

const amqp = require("amqplib");

async function initRabbitMQChannel() {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}`);
    const channel = await connection.createChannel();

    await channel.assertQueue(process.env.RABBITMQ_QUEUE_NAME_RELATION_CONTACT, { durable: true });
    return channel;
}

exports.initRabbitMQChannel = initRabbitMQChannel;