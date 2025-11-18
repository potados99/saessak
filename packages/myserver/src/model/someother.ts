import { Model } from "saessak";

export default {
    run: async () => {
        const vender = (await import("../lib/vender")).default;
        const tools = (await import("../lib/tools")).default;

        return `좀 다른 모델입니다. 다른 라이브러리들을 사용합니다.<br>vender: ${vender()}<br>tools: ${tools()}`;
    },
} as Model;

