import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

const readPkgJson = () => {
  const pkgJsonPath = resolve(process.cwd(), "package.json");
  return JSON.parse(readFileSync(pkgJsonPath));
};

const logInfo = (pkg) => {
  const { info: log } = console;
  log(`\n[building]: ${pkg.name} (${pkg.version})`);
};

const createCommonJsPackageJson = (pkg) => ({
  name: "cjs-pkg-json",
  buildEnd() {
    const dir = dirname(pkg.main);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(
      resolve(process.cwd(), `${dir}/package.json`),
      JSON.stringify({ type: "commonjs" }, null, 2)
    );
  },
});

const pkg = readPkgJson();

logInfo(pkg);

export default [
  {
    input: "dist/index.js",
    output: [
      {
        dir: dirname(pkg.main),
        format: "cjs",
      },
      {
        dir: dirname(pkg.module),
        format: "es",
      },
    ],
    plugins: [createCommonJsPackageJson(pkg)],
  },
];
