class DiversityGlobals {
    static VERSION = "0.1";
    static BRANCH = "beta";
    static EVENT_PREFIX = "diversity@$ver$";

    static getVersion() {
        return `${this.BRANCH}-${this.VERSION}`
    }

    static getEventPrefix() {
        return this.EVENT_PREFIX.replace("$ver", this.getVersion());
    }
}