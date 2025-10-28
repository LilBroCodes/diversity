class DiversityBackend {
    static registry = {};
    static broadcastMethod = null;

    static registerEvent(eventName, handler) {
        this.registry[eventName] = handler;
        Logger.log(`Mapped event '${eventName}' to handler '${handler.name || "anonymous"}'`);
    }

    static _handleDynamicRegistration(data) {
        try {
            // Expect format: "eventName=name;handler=()=>{ ... }"
            const parts = Object.fromEntries(
                data.split(";").map(pair => {
                    const [key, ...rest] = pair.split("=");
                    return [key.trim(), rest.join("=").trim()];
                })
            );

            const { eventName, handler } = parts;

            if (!eventName || !handler) {
                Logger.warn("Dynamic registration failed: missing eventName or handler.");
                return false;
            }

            const fn = eval(`(${handler})`);

            if (typeof fn !== "function") {
                Logger.warn(`Dynamic registration failed: handler is not a function.`);
                return false;
            }

            this.registerEvent(eventName, fn);

            Logger.info(`Dynamically registered new event '${eventName}'`);
            return true;
        } catch (err) {
            Logger.error(`Dynamic registration error: ${err}`);
            return false;
        }
    }


    static routeEvent(channel, data) {
        const prefix = DiversityGlobals.getEventPrefix();

        if (!channel.startsWith(prefix)) return false;

        const eventName = channel.slice(prefix.length);

        if (eventName === "!register") {
            return this._handleDynamicRegistration(data);
        }

        const handler = this.registry[eventName];
        if (!handler) {
            Logger.warn(`No handler registered for event '${eventName}'`);
            return false;
        }

        try {
            return handler(data);
        } catch (err) {
            Logger.error(`Error in event '${eventName}': ${err}`);
        }
    }

    static jankSaveBroadcastMethod(method) {
        if (typeof method !== "function") {
            Logger.error("Attempted to save a non-function broadcast method!");
            return;
        }

        this.broadcastMethod = method;
        Logger.log("Saved broadcast method:", method.name || "<anonymous>");
    }

    static registerDefaults() {
        Logger.log(`Registering default events for '${DiversityGlobals.getEventPrefix()}'...`);

        this.registerEvent("checkIsLoaded", () => {
            if (this.broadcastMethod != null && typeof this.broadcastMethod == "function") this.broadcastMethod("diversity$version", DiversityGlobals.getVersion(), false);
        })

        DiversityNetworking.registerEvents();
        Logger.registerEvents();

        const count = Object.keys(this.registry).length;
        Logger.log(`Registered ${count} event${count !== 1 ? "s" : ""}.`);
    }
}
