    actor Diversity {
        let PREFIX = "diversity@beta-0.1$";
        let isLoaded = false;

        function call(name, paramString) {
            stage.broadcastData(PREFIX + name, paramString);
        }
        
        function registerDynamicEvent(eventName, paramString, code) {
            call("!register", "eventName=" + eventName + ";handler=(" + paramString + ")=>{" + code + "}");
        }

        function checkLoaded() {
            call("checkIsLoaded", "");
        }

        function log(s) {
            call("log", s);
        }

        when stage.started {
            checkLoaded();
            setPosition(-128, -60)
            say("Diversity is loading or not installed. Please wait, or install diversity. If you do not know what that is, you can leave this project as it will not work without it.")
        }

        when stage.dataReceived("diversity$version") {
            log("Diversity loaded with version '" + event.data + "'");
            isLoaded = true;
            say()
        }
    }

    actor Networking {
        let FTB_PREFIX = "dnInternal$FTB$";
        let getResultHandlers = [ ];
        let postResultHandlers = [ ];

        function get(url, headers) {
            Diversity.call(FTB_PREFIX + "getInternal", "url=" + url + ";headers=" + headers);
        }

        function post(url, headers, body) {
            Diversity.call(FTB_PREFIX + "postInternal", "url=" + url + ";headers=" + headers + ";body=" + body);
        }

        function callListMethods(ls, data) {
            let i = 0;
            while(i < ls.length) {
                let h = ls[i];
                h(data);
                i = i + 1;
            }
        }

        when stage.dataReceived("dnInternal$BTF$getResult") {
            Networking.callListMethods(getResultHandlers, event.data);
        }

        when stage.dataReceived("dnInternal$BTF$postResult") {
            Networking.callListMethods(postResultHandlers, event.data);
        }
    }