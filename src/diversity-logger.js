class Logger {
    static registerEvents() {
        DiversityBackend.registerEvent("debug", this.debug);
        DiversityBackend.registerEvent("info", this.info);
        DiversityBackend.registerEvent("log", this.log);
        DiversityBackend.registerEvent("warn", this.warn);
        DiversityBackend.registerEvent("error", this.error);
    }

    static format(s) {
        return `[Diversity ${DiversityGlobals.getVersion()}] ${s}`;
    }

    static log(s) {
        console.log(Logger.format(s));
    }

    static info(s) {
        console.info(Logger.format(s));
    }

    static warn(s) {
        console.warn(Logger.format(s));
    }

    static debug(s) {
        console.debug(Logger.format(s));
    }

    static error(s) {
        console.error(Logger.format(s));
    }
}