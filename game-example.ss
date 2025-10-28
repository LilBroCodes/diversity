stage {
    let uname = null;
    let SERVER_URL = "https://diversity-connector.alwaysdata.net/";
    let newestId = 0;
    when started {
        while(!Diversity.L);
        // wait for diversity
        uname = ask("Enter your username:");
        if(uname == null || uname == "") {
            uname = "Anon" + Math.floor(Math.random() * 1000);
        }
        Terminal.writeForSeconds("Logged in as: " + uname, 99999);
    }
    when started {
        while(uname == null) {
            
        }
        // wait for login
        while(true) {
            Networking.get(SERVER_URL + "?newestId=" + newestId, "");
            wait(1);
        }
    }
    when started {
        while(uname == null) {
            
        }
        // wait for login
        while(true) {
            if(isKeyPressed("enter")) {
                let msg = ask("Enter message:");
                if(msg != null && msg != "") {
                    let payload = uname + ":" + msg;
                    Networking.post(SERVER_URL, "Content-Type:text/plain", payload);
                }
                wait(0.1);
            }
        }
    }
    
    actor Diversity {
        let PREFIX = "diversity@beta-0.1$";
        let L = false;
        function call(n, p) {
            broadcastData(PREFIX + n, p);
        }
        function registerDynamicEvent(n, p, c) {
            call("!register", "eventName=" + n + ";handler=(" + p + ")=>{" + c + "}");
        }
        function checkLoaded() {
            call("checkIsLoaded", "");
        }
        function log(s) {
            call("log", s);
        }
        when stage.started {
            checkLoaded();
            setPosition(-128, -60);
            say("Diversity is loading or not installed. Please wait, or install diversity. If you do not know what that is, you can leave this project as it will not work without it.");
        }
        when stage.dataReceived("diversity$version") {
            log("Diversity loaded with version '" + event.data + "'");
            L = true;
            say();
        }
    }
    
    actor Networking {
        let FTB_PREFIX = "dnInternal$FTB$";
        let g = [  ];
        let p = [  ];
        function get(u, h) {
            Diversity.call(FTB_PREFIX + "getInternal", "url=" + u + ";headers=" + h);
        }
        function post(u, h, b) {
            Diversity.call(FTB_PREFIX + "postInternal", "url=" + u + ";headers=" + h + ";body=" + b);
        }
        function callListMethods(l, d) {
            let i = 0;
            while(i < l.length) {
                let h = l[i];
                h(d);
                i = i + 1;
            }
        }
        when stage.dataReceived("dnInternal$BTF$getResult") {
            Networking.callListMethods(g, event.data);
        }
        when stage.dataReceived("dnInternal$BTF$postResult") {
            Networking.callListMethods(p, event.data);
        }
    }
    
    actor NetworkManager {
        function recieve(data) {
            let body = "";
            let i = 0;
            while(i < data.length) {
                let pair = data[i];
                if(pair[0] == "body") {
                    body = pair[1];
                }
                i = i + 1;
            }
            if(body != null && body != "") {
                let msgs = body.split("|");
                let e = 0;
                while(e < msgs.length) {
                    let m = msgs[e];
                    e = e + 1;
                    if(m == "") {
                        continue
                    }
                    // format: id:username:msg
                    // parts is not usable because of internal stuff
                    // username is reserved for the actual LSC username
                    let prts = m.split(":", 3);
                    if(prts.length < 3) {
                        continue
                    }
                    let id = +prts[0];
                    let nm = prts[1];
                    let msg = prts[2];
                    Terminal.writeForSeconds(nm + ": " + msg, 99999);
                    if(id > newestId) {
                        newestId = id;
                    }
                }
            }
        }
        when stage.started {
            Networking.g.push(recieve);
        }
    }
}