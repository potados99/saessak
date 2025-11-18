import { Model } from "saessak";

export default {
    run: async () => {
        const vender = (await import("../lib/vender")).default;
        const tools = (await import("../lib/tools")).default;

        return `some other model. vender: ${vender()}, tools: ${tools()}`;
    },
} as Model;

