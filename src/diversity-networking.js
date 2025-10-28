class DiversityNetworking {
    static BTF_PREFIX = 'dnInternal$BTF$';
    static FTB_PREFIX = 'dnInternal$FTB$';

    // --- GET result handling ---
    static returnGetResult(data) {
        if (!DiversityBackend.broadcastMethod || typeof DiversityBackend.broadcastMethod !== "function") {
            Logger.error("[DiversityNetworking] broadcastMethod is not valid!");
            return;
        }

        let realData = null;
        if (typeof data === "object") {
            realData = Object.entries(data);
        }

        DiversityBackend.broadcastMethod(DiversityNetworking.BTF_PREFIX + "getResult", realData ?? data, false);
    }

    // --- POST result handling ---
    static returnPostResult(data) {
        if (!DiversityBackend.broadcastMethod || typeof DiversityBackend.broadcastMethod !== "function") {
            Logger.error("[DiversityNetworking] broadcastMethod is not valid!");
            return;
        }

        let realData = null;
        if (typeof data === "object") {
            realData = Object.entries(data);
        }

        DiversityBackend.broadcastMethod(DiversityNetworking.BTF_PREFIX + "postResult", realData ?? data, false);
    }

    // --- GET request ---
    static async getInternal(data) {
        try {
            const parts = Object.fromEntries(
                data.split(";").map(pair => {
                    const [key, ...rest] = pair.split("=");
                    return [key.trim(), rest.join("=").trim()];
                })
            );

            const { url, headers } = parts;

            if (!url) throw new Error("Missing URL in getInternal request.");

            let headerObj = {};
            if (headers) {
                headers.split(",").forEach(h => {
                    const [k, ...v] = h.split(":");
                    if (k && v.length > 0) {
                        headerObj[k.trim()] = v.join(":").trim();
                    }
                });
            }

            const response = await fetch(url, { method: "GET", headers: headerObj });
            const text = await response.text();

            DiversityNetworking.returnGetResult({ success: true, status: response.status, body: text });
        } catch (err) {
            Logger.error("[DiversityNetworking] Error in getInternal:", err);
            DiversityNetworking.returnGetResult({ success: false, error: err.message });
        }
    }

    // --- POST request ---
    static async postInternal(data) {
        try {
            // Expect format: "url=https://example.com;headers=key:val,...;body={...}"
            const parts = Object.fromEntries(
                data.split(";").map(pair => {
                    const [key, ...rest] = pair.split("=");
                    return [key.trim(), rest.join("=").trim()];
                })
            );

            const { url, headers, body } = parts;

            if (!url) throw new Error("Missing URL in postInternal request.");

            let headerObj = {};
            if (headers) {
                headers.split(",").forEach(h => {
                    const [k, ...v] = h.split(":");
                    if (k && v.length > 0) {
                        headerObj[k.trim()] = v.join(":").trim();
                    }
                });
            }

            const response = await fetch(url, {
                method: "POST",
                headers: headerObj,
                body: body ?? null
            });
            const text = await response.text();

            DiversityNetworking.returnPostResult({ success: true, status: response.status, body: text });
        } catch (err) {
            Logger.error("[DiversityNetworking] Error in postInternal:", err);
            DiversityNetworking.returnPostResult({ success: false, error: err.message });
        }
    }

    // --- Event registration ---
    static registerEvents() {
        DiversityBackend.registerEvent(this.FTB_PREFIX + "getInternal", this.getInternal);
        DiversityBackend.registerEvent(this.FTB_PREFIX + "postInternal", this.postInternal);
    }
}
