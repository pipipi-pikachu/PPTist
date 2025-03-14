"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const load_1 = __importDefault(require("@commitlint/load"));
const lint_1 = __importDefault(require("@commitlint/lint"));
const read_1 = __importDefault(require("@commitlint/read"));
const lodash_isfunction_1 = __importDefault(require("lodash.isfunction"));
const resolve_from_1 = __importDefault(require("resolve-from"));
const resolve_global_1 = __importDefault(require("resolve-global"));
const yargs_1 = __importDefault(require("yargs"));
const util_1 = __importDefault(require("util"));
const cli_error_1 = require("./cli-error");
const pkg = require('../package');
const gitDefaultCommentChar = '#';
const cli = yargs_1.default
    .options({
    color: {
        alias: 'c',
        default: true,
        description: 'toggle colored output',
        type: 'boolean',
    },
    config: {
        alias: 'g',
        description: 'path to the config file',
        type: 'string',
    },
    'print-config': {
        type: 'boolean',
        default: false,
        description: 'print resolved config',
    },
    cwd: {
        alias: 'd',
        default: process.cwd(),
        defaultDescription: '(Working Directory)',
        description: 'directory to execute in',
        type: 'string',
    },
    edit: {
        alias: 'e',
        description: 'read last commit message from the specified file or fallbacks to ./.git/COMMIT_EDITMSG',
        type: 'string',
    },
    env: {
        alias: 'E',
        description: 'check message in the file at path given by environment variable value',
        type: 'string',
    },
    extends: {
        alias: 'x',
        description: 'array of shareable configurations to extend',
        type: 'array',
    },
    'help-url': {
        alias: 'H',
        type: 'string',
        description: 'help url in error message',
    },
    from: {
        alias: 'f',
        description: 'lower end of the commit range to lint; applies if edit=false',
        type: 'string',
    },
    'git-log-args': {
        description: "additional git log arguments as space separated string, example '--first-parent --cherry-pick'",
        type: 'string',
    },
    format: {
        alias: 'o',
        description: 'output format of the results',
        type: 'string',
    },
    'parser-preset': {
        alias: 'p',
        description: 'configuration preset to use for conventional-commits-parser',
        type: 'string',
    },
    quiet: {
        alias: 'q',
        default: false,
        description: 'toggle console output',
        type: 'boolean',
    },
    to: {
        alias: 't',
        description: 'upper end of the commit range to lint; applies if edit=false',
        type: 'string',
    },
    verbose: {
        alias: 'V',
        type: 'boolean',
        description: 'enable verbose output for reports without problems',
    },
    strict: {
        alias: 's',
        type: 'boolean',
        description: 'enable strict mode; result code 2 for warnings, 3 for errors',
    },
})
    .version('version', 'display version information', `${pkg.name}@${pkg.version}`)
    .alias('v', 'version')
    .help('help')
    .alias('h', 'help')
    .usage(`${pkg.name}@${pkg.version} - ${pkg.description}\n`)
    .usage(`[input] reads from stdin if --edit, --env, --from and --to are omitted`)
    .strict();
main(cli.argv).catch((err) => {
    setTimeout(() => {
        if (err.type === pkg.name) {
            process.exit(err.error_code);
        }
        throw err;
    }, 0);
});
async function stdin() {
    var _a, e_1, _b, _c;
    let result = '';
    if (process.stdin.isTTY) {
        return result;
    }
    process.stdin.setEncoding('utf8');
    try {
        for (var _d = true, _e = __asyncValues(process.stdin), _f; _f = await _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const chunk = _c;
            result += chunk;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
async function resolveArgs(args) {
    return typeof args.then === 'function' ? await args : args;
}
async function main(args) {
    var _a;
    const options = await resolveArgs(args);
    if (typeof options.edit === 'undefined') {
        options.edit = false;
    }
    const raw = options._;
    const flags = normalizeFlags(options);
    if (flags['print-config']) {
        const loaded = await (0, load_1.default)(getSeed(flags), {
            cwd: flags.cwd,
            file: flags.config,
        });
        console.log(util_1.default.inspect(loaded, false, null, options.color));
        return;
    }
    const fromStdin = checkFromStdin(raw, flags);
    const input = await (fromStdin
        ? stdin()
        : (0, read_1.default)({
            to: flags.to,
            from: flags.from,
            edit: flags.edit,
            cwd: flags.cwd,
            gitLogArgs: flags['git-log-args'],
        }));
    const messages = (Array.isArray(input) ? input : [input])
        .filter((message) => typeof message === 'string')
        .filter((message) => message.trim() !== '')
        .filter(Boolean);
    if (messages.length === 0 && !checkFromRepository(flags)) {
        const err = new cli_error_1.CliError('[input] is required: supply via stdin, or --env or --edit or --from and --to', pkg.name);
        yargs_1.default.showHelp('log');
        console.log(err.message);
        throw err;
    }
    const loaded = await (0, load_1.default)(getSeed(flags), {
        cwd: flags.cwd,
        file: flags.config,
    });
    const parserOpts = selectParserOpts(loaded.parserPreset);
    const opts = {
        parserOpts: {},
        plugins: {},
        ignores: [],
        defaultIgnores: true,
    };
    if (parserOpts) {
        opts.parserOpts = parserOpts;
    }
    if (loaded.plugins) {
        opts.plugins = loaded.plugins;
    }
    if (loaded.ignores) {
        opts.ignores = loaded.ignores;
    }
    if (loaded.defaultIgnores === false) {
        opts.defaultIgnores = false;
    }
    const format = loadFormatter(loaded, flags);
    // If reading from `.git/COMMIT_EDIT_MSG`, strip comments using
    // core.commentChar from git configuration, falling back to '#'.
    if (flags.edit) {
        try {
            const { stdout } = await (0, execa_1.default)('git', ['config', 'core.commentChar']);
            opts.parserOpts.commentChar = stdout.trim() || gitDefaultCommentChar;
        }
        catch (e) {
            const execaError = e;
            // git config returns exit code 1 when the setting is unset,
            // don't warn in this case.
            if (!execaError.failed || execaError.exitCode !== 1) {
                console.warn('Could not determine core.commentChar git configuration', e);
            }
            opts.parserOpts.commentChar = gitDefaultCommentChar;
        }
    }
    const results = await Promise.all(messages.map((message) => (0, lint_1.default)(message, loaded.rules, opts)));
    if (Object.keys(loaded.rules).length === 0) {
        let input = '';
        if (results.length !== 0) {
            input = results[0].input;
        }
        results.splice(0, results.length, {
            valid: false,
            errors: [
                {
                    level: 2,
                    valid: false,
                    name: 'empty-rules',
                    message: [
                        'Please add rules to your `commitlint.config.js`',
                        '    - Getting started guide: https://commitlint.js.org/#/?id=getting-started',
                        '    - Example config: https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/index.js',
                    ].join('\n'),
                },
            ],
            warnings: [],
            input,
        });
    }
    const report = results.reduce((info, result) => {
        info.valid = result.valid ? info.valid : false;
        info.errorCount += result.errors.length;
        info.warningCount += result.warnings.length;
        info.results.push(result);
        return info;
    }, {
        valid: true,
        errorCount: 0,
        warningCount: 0,
        results: [],
    });
    const helpUrl = ((_a = flags['help-url']) === null || _a === void 0 ? void 0 : _a.trim()) || loaded.helpUrl;
    const output = format(report, {
        color: flags.color,
        verbose: flags.verbose,
        helpUrl,
    });
    if (!flags.quiet && output !== '') {
        console.log(output);
    }
    if (flags.strict) {
        if (report.errorCount > 0) {
            throw new cli_error_1.CliError(output, pkg.name, 3);
        }
        if (report.warningCount > 0) {
            throw new cli_error_1.CliError(output, pkg.name, 2);
        }
    }
    if (!report.valid) {
        throw new cli_error_1.CliError(output, pkg.name);
    }
}
function checkFromStdin(input, flags) {
    return input.length === 0 && !checkFromRepository(flags);
}
function checkFromRepository(flags) {
    return checkFromHistory(flags) || checkFromEdit(flags);
}
function checkFromEdit(flags) {
    return Boolean(flags.edit) || Boolean(flags.env);
}
function checkFromHistory(flags) {
    return typeof flags.from === 'string' || typeof flags.to === 'string';
}
function normalizeFlags(flags) {
    const edit = getEditValue(flags);
    return Object.assign(Object.assign({}, flags), { edit });
}
function getEditValue(flags) {
    if (flags.env) {
        if (!(flags.env in process.env)) {
            throw new Error(`Received '${flags.env}' as value for -E | --env, but environment variable '${flags.env}' is not available globally`);
        }
        return process.env[flags.env];
    }
    const { edit } = flags;
    // If the edit flag is set but empty (i.e '-e') we default
    // to .git/COMMIT_EDITMSG
    if (edit === '') {
        return true;
    }
    if (typeof edit === 'boolean') {
        return edit;
    }
    // The recommended method to specify -e with husky was `commitlint -e $HUSKY_GIT_PARAMS`
    // This does not work properly with win32 systems, where env variable declarations
    // use a different syntax
    // See https://github.com/conventional-changelog/commitlint/issues/103 for details
    // This has been superceded by the `-E GIT_PARAMS` / `-E HUSKY_GIT_PARAMS`
    const isGitParams = edit === '$GIT_PARAMS' || edit === '%GIT_PARAMS%';
    const isHuskyParams = edit === '$HUSKY_GIT_PARAMS' || edit === '%HUSKY_GIT_PARAMS%';
    if (isGitParams || isHuskyParams) {
        console.warn(`Using environment variable syntax (${edit}) in -e |\
--edit is deprecated. Use '{-E|--env} HUSKY_GIT_PARAMS instead'`);
        if (isGitParams && 'GIT_PARAMS' in process.env) {
            return process.env.GIT_PARAMS;
        }
        if ('HUSKY_GIT_PARAMS' in process.env) {
            return process.env.HUSKY_GIT_PARAMS;
        }
        throw new Error(`Received ${edit} as value for -e | --edit, but GIT_PARAMS or HUSKY_GIT_PARAMS are not available globally.`);
    }
    return edit;
}
function getSeed(flags) {
    const n = (flags.extends || []).filter((i) => typeof i === 'string');
    return n.length > 0
        ? { extends: n, parserPreset: flags['parser-preset'] }
        : { parserPreset: flags['parser-preset'] };
}
function selectParserOpts(parserPreset) {
    if (typeof parserPreset !== 'object') {
        return undefined;
    }
    if (typeof parserPreset.parserOpts !== 'object') {
        return undefined;
    }
    return parserPreset.parserOpts;
}
function loadFormatter(config, flags) {
    const moduleName = flags.format || config.formatter || '@commitlint/format';
    const modulePath = resolve_from_1.default.silent(__dirname, moduleName) ||
        resolve_from_1.default.silent(flags.cwd, moduleName) ||
        resolve_global_1.default.silent(moduleName);
    if (modulePath) {
        const moduleInstance = require(modulePath);
        if ((0, lodash_isfunction_1.default)(moduleInstance.default)) {
            return moduleInstance.default;
        }
        return moduleInstance;
    }
    throw new Error(`Using format ${moduleName}, but cannot find the module.`);
}
// Catch unhandled rejections globally
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at: Promise ', promise, ' reason: ', reason);
    throw reason;
});
//# sourceMappingURL=cli.js.map