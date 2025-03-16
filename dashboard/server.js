/**
** Author: Sofian Belahouel
** Filename:
** File description: This file contains all the functions that allow us to
** Create Time: 2025-03-16 15:26:48
** Modified by: Sofian Belahouel
** Modified time: 2025-03-16 15:28:47
**/

const { initExpressApp } = require("./src/controllers/init_express_app.js");
const { initRabbitMQChannel } = require("./src/controllers/init_rabbitmq.js");

async function main() {
    const app = initExpressApp(await initRabbitMQChannel());

    app.listen(process.env.CONTAINER_INTERNAL_PORT, () => {
        console.log(`Server listen on http://127.0.0.1:${process.env.CONTAINER_INTERNAL_PORT}`);
        console.log(`Healthcheck at http://127.0.0.1:${process.env.CONTAINER_INTERNAL_PORT}/alive`);
    });
    return 0;
}

main().then((_) => 0);
