const totalTime = Date.now();
const ts = require("typescript");
const { Buffer } = require("buffer");
const { formatWithOptions } = require("util");
const { writeFileSync, readFileSync } = require("fs");
const { resolve, dirname } = require("path");

function readTsConfig(path) {
  const { config } = ts.readConfigFile(
    resolve(path, "tsconfig.json"),
    ts.sys.readFile
  );

  return config;
}

let options = {
  colors: true,
};

function logf(format, ...args) {
  console.log(formatWithOptions(options, format, ...args));
}

const reset = "\x1b[0m";
const bold = (str) => style("\x1b[1m", str);
const bgReverse = (str) => style("\x1b[7m", str);
const bgOrange = (str) => style("\x1b[43m", str);
const bgRed = (str) => style("\x1b[41m", str);
const fgWhite = (str) => style("\x1b[37m", str);
const fgOrange = (str) => style("\x1b[33m", str);
const fgBlack = (str) => style("\x1b[30m", str);
const startNewLine = (str) => `\n${str}`;
const endNewLine = (str) => `${str}\n`;

const padding = (str, value) => {
  const padding = " ".repeat(value);
  return `${padding}${str}${padding}`;
};

const style = (style, str) => `${style}${str}${reset}`;

const heading = (str) => startNewLine(fgBlack(bgOrange(padding(str, 1))));
const subHeading = (str) => endNewLine(bgReverse(padding(str, 1)));
const errorHeading = (str) => fgWhite(bgRed(padding(str, 1)));

function emitTypes() {
  const name = "types";

  logf("%s %s", heading("EMITTING"), subHeading(name));

  const typeEmitTime = Date.now();
  const basePath = process.cwd();
  const config = readTsConfig(basePath);

  const { options, fileNames, projectReferences, errors } =
    ts.parseJsonConfigFileContent(config, ts.sys, basePath);

  if (errors.length !== 0) {
    return {
      name,
      code: 1,
      errors: errors.map((e) => ({
        text: e,
      })),
    };
  }

  const program = ts.createIncrementalProgram({
    options: {
      ...options,
      tsBuildInfoFile: "./tsconfig.tsbuildinfo",
      // Needs to be true as we are using esbuild to bundle the code
      // esbuild compiles the files independently
      isolatedModules: true,
    },
    rootNames: fileNames,
    projectReferences,
    host: ts.createIncrementalCompilerHost(options),
  });

  const diagnostics = ts.getPreEmitDiagnostics(program);

  const diagnosticErrors = diagnostics.map((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start
      );

      const errorPath = diagnostic.file.fileName.substring(basePath.length);

      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText);

      return {
        text: `${errorPath} (${line + 1},${character + 1}): ${message}`,
      };
    }

    return {
      text: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    };
  });

  if (diagnosticErrors.length !== 0) {
    return { name, code: 1, errors: diagnosticErrors };
  }

  const fileDiagnostics = [];

  const { declarationDir, tsBuildInfoFile } = program.getCompilerOptions();

  program.emit(undefined, (fileName, data, writeByteOrderMark) => {
    // Do not log information about tsbuildinfofile
    if (fileName !== tsBuildInfoFile) {
      fileDiagnostics.push({
        fileName: fileName.substring(declarationDir.length + 1),
        size: Buffer.byteLength(data),
      });
    }

    ts.sys.writeFile(fileName, data, writeByteOrderMark);
  });

  const totalSize = fileDiagnostics.reduce((acc, emitted) => {
    return (acc += emitted.size);
  }, 0);

  const declarationPath = declarationDir.substring(process.cwd().length + 1);

  logf(
    `  %s${" ".repeat(21 - declarationPath.length)}%s\t%s`,
    declarationPath,
    totalSize > 1000 ? `${(totalSize / 1000).toFixed(1)}kb` : `${totalSize}b`,
    "100.0%"
  );

  fileDiagnostics
    .sort((a, b) => (a.size < b.size ? 1 : -1))
    .forEach(({ fileName, size }, i) => {
      const whitespaces = 18 - fileName.length;
      const percentage = ((size / totalSize) * 100).toFixed(1);
      logf(
        `  %s %s${" ".repeat(whitespaces)}%s\t%s%`,
        i === fileDiagnostics.length - 1 ? " └" : " ├",
        fileName,
        `${size < 100 ? ` ${size}` : size}b`,
        `${" ".repeat(Math.ceil(4 / percentage.length))}${percentage}`
      );
    });

  logf("\n> created in: %O ms", Date.now() - typeEmitTime);

  return { name, code: 0, errors: [] };
}

const readPkgJson = () => {
  const pkgJsonPath = resolve(process.cwd(), "package.json");
  return JSON.parse(readFileSync(pkgJsonPath));
};

const pkg = readPkgJson();

logf(
  "%s %s (%s)",
  startNewLine(bold("BUILDING")),
  pkg.name,
  fgOrange(pkg.version)
);

const cjs = {
  name: "cjs",
  setup(build) {
    build.onEnd(() => {
      writeFileSync(
        resolve(process.cwd(), `${dirname(pkg.main)}/package.json`),
        JSON.stringify({ type: "commonjs" }, null, 2)
      );
    });
  },
};

function exec() {
  const { build, analyzeMetafile } = require("esbuild");

  const errorLogger = {
    name: "esbuild-error-logger",
    setup(build) {
      build.onEnd((result) => {
        if (result.errors.length !== 0) {
          logf(
            "%s %s",
            heading("BUNDLING"),
            subHeading(build.initialOptions.format)
          );

          logf(
            "%s (%s) %s",
            errorHeading("BUNDLING FAILED"),
            build.initialOptions.format,
            endNewLine(
              startNewLine(
                result.errors
                  .map((err, i) => `${i + 1}. ${err.text}\n`)
                  .join("")
              )
            )
          );
        }
      });
    },
  };

  const buildOptions = [
    {
      outdir: dirname(pkg.main),
      format: "cjs",
      plugins: [errorLogger, cjs],
    },
    {
      outdir: dirname(pkg.module),
      format: "esm",
      plugins: [errorLogger],
    },
  ];

  let result = { name: "build", code: 0, errors: [] };

  if ((result = emitTypes()).code !== 0) {
    return Promise.reject(result);
  }

  return Promise.all(
    buildOptions.map(({ outdir, format, plugins }) => {
      const buildStart = new Date();

      return build({
        entryPoints: ["./src/index.ts"],
        metafile: true,
        bundle: true,
        outdir,
        platform: "node",
        logLevel: "silent",
        format,
        plugins,
      })
        .then((result) => analyzeMetafile(result.metafile))
        .then((result) => {
          logf("%s %s %s", heading("BUNDLING"), subHeading(format), result);
          logf("> created in: %O ms", Date.now() - buildStart);
        });
    })
  );
}

function handleError(result) {
  logf(
    "%s in %o ms \n%s",
    errorHeading("BUILD FAILED"),
    Date.now() - totalTime,
    startNewLine(result.errors.map((e, i) => `${i + 1}. ${e.text}\n`).join(""))
  );
  process.exit(1);
}

exec()
  .then(() => {
    logf("%s in %O ms", startNewLine(bold("FINISHED")), Date.now() - totalTime);
    process.exit(0);
  })
  .catch(handleError);
