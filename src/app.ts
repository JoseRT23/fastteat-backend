import server from './server';

(async() => {
    main();
})();

async function main() {
    await server.start();
}
