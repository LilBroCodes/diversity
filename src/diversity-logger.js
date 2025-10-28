class Logger {
    static format(s) {
        return `[Diversity ${DiversityGlobals.getVersion()}] ${s}`;
    }

    static log(s) {
        console.log(this.format(s));
    }

    static info(s) {
        console.info(this.format(s));
    }

    static warn(s) {
        console.warn(this.format(s));
    }

    static debug(s) {
        console.debug(this.format(s));
    }

    static error(s) {
        console.error(this.format(s));
    }
}