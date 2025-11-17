import { Saessak } from "saessak";

console.log('앱 루트 evaluate됨!');

async function bootstrap() {
    Saessak.init();
    await Saessak.createServer(8080);
}

bootstrap();