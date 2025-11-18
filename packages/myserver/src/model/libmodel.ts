import { Model } from "saessak";

const now = new Date().toISOString();

export default {
  run: () => `[${now}에 로드된 libmodel]`, // 여기 수정하시고 http://localhost:8080/model/mymodel 들어와보십셔.
} as Model ;