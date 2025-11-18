import { Model } from "saessak";
import vender from "../lib/vender";

export default {
    run: () => `some other model: ${vender()}`
} as Model;
