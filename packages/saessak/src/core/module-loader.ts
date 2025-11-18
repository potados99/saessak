import path from "path";
import { readdir } from "fs/promises";
import { Saessak } from "./saessak";
import { watch } from "chokidar";
import { pathToFileURL } from "url";
import chalk from "chalk";

/**
 * 주어진 경로에서 모듈을 긁어 import하고, 필요하다면 소스코드의 변경을 감지해 최신으로 유지해주는 친구입니다.
 *
 * 로드할 모듈의 타입은 T로 지정하고, 그 모듈들이 살고 있는 디렉토리는 moduleDir로 지정합니다.
 */
export default class ModuleLoader<T> {
  constructor(private readonly moduleDir: string) {}

  private modules: Record<string, T> = {};

  /**
   * moduleDir 아래에 있는 모듈들을 모두 로드합니다.
   * 이렇게 로드된 모듈들은 (지원되는 경우) HMR의 대상이 됩니다.
   */
  async load() {
    // 프로젝트의 특정 디렉토리(moduleDir) 아래에 있는 실제 소스코드 파일들을 로드(import)해야 합니다.
    // 만약 프로젝트가 현재 개발 모드로 실행되어 HMR이 지원되는 상태라면, src 디렉토리 아래에서 .ts 파일들을 바로 읽어옵니다.
    // 그러나 만약 프로젝트가 빌드된 dist에서 실행되고 있다면 dist 디렉토리 아래에서 .js 파일들을 읽어옵니다.
    //
    // 이를 하나의 경로로 맞출 수가 없었습니다.
    // 이 부분은 로더나 트랜스파일러가 어찌 도와줄 수 없는, 프레임워크의 소스 코드가 직접 처리하는 동적 임포트 구문인지라,
    // 상황(개발 모드인지 빌드 모드인지)에 따라 다른 경로를 사용해야 합니다.
    const moduleDirPath = path
      .join(
        Saessak.projectRootPath, // 절대경로일 것으로 상정합니다.
        this.moduleDir
      )
      .replace(
        "/src/",
        process.env.NODE_ENV === "development" ? "/src/" : "/dist/"
      );
    const allModulePaths = (await readdir(moduleDirPath))
      .filter((filename) =>
        filename.endsWith(
          process.env.NODE_ENV === "development" ? ".ts" : ".js"
        )
      )
      .map((filename) => path.join(moduleDirPath, filename));

    for (const modulePath of allModulePaths) {
      await this.loadModule(pathToFileURL(modulePath).href);
    }
  }

  async startWatching() {
    const watcher = watch(Saessak.projectRootPath, {
      ignored: (path, stats) =>
        (!!stats?.isFile() &&
          !path.endsWith(".ts") &&
          !path.endsWith(".json")) ||
        path.endsWith("src/index.ts"),
      persistent: true,
      ignoreInitial: true,
    });
    watcher.on("all", async (_, filePath) => {
      // 개발 모드에서는 .ts 파일만, 프로덕션에서는 .js 파일만 로드
      const expectedExt =
        process.env.NODE_ENV === "development" ? ".ts" : ".js";
      if (path.extname(filePath) !== expectedExt) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`${chalk.green("!!!무지성 리로드 트리거!!!")}`);
      await this.load();
      // console.log(`모듈 변경 감지: ${filePath}`);
      // await this.loadModule(pathToFileURL(filePath).href);
    });
  }

  private async loadModule(moduleUrlString: string) {
    console.log(`모듈을 임포트합니다: ${moduleUrlString}`);

    /** @ts-ignore */
    const module: T = (await import(moduleUrlString)).default;
    const moduleName = path.basename(moduleUrlString).replace(/\.[^/.]+$/, "");

    this.modules[moduleName] = module;
  }

  /**
   * 주어진 모듈 이름으로 모듈을 찾습니다.
   * 얘가 가져오는 모듈은 load에서 로드한 모듈들 중 하나입니다.
   */
  findModule(name: string): T | undefined {
    return this.modules[name];
  }
}
