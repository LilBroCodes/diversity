class DiversityNetworking {
    static BTF_PREFIX = 'dnInternal$BTF$';
    static FTB_PREFIX = 'dnInternal$FTB$';

    static returnGetResult(data) {
        if (DiversityBackend.broadcastMethod == null) {
            Logger.error("[DiversityNetworking] DiversityBackend.broadcastMethod is null! Someone removed the jank save call. PUT IT BACK.");
            return;
        } else if (typeof DiversityBackend.broadcastMethod !== "function") {
            Logger.error(`[DiversityNetworking] DiversityBackend.broadcastMethod isn't a function, but a ${typeof DiversityBackend.broadcastMethod}.`);
            return;
        }

        let realData = null;
        if (typeof data == "object") {
            realData = [];
            for (const [key, value] of Object.entries(data)) {
                realData.push([key, value]);
            }
        }

        DiversityBackend.broadcastMethod(DiversityNetworking.BTF_PREFIX + "getResult", realData == null ? data : realData, false);
    }

    static async getInternal(data) {
        try {
            // Expect format: "url=https://example.com;headers=key1:val1,key2:val2"
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

    static registerEvents() {
        DiversityBackend.registerEvent(this.FTB_PREFIX + "getInternal", this.getInternal);
    }
}
