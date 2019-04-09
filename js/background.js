(function () {
    var nowLrc = [];
    var aLength = 0;
    var L = {
        getFun: function (url_id) {
            if(!url_id) {url_id = '138291285'}
            var f = fetch('https://api.bzqll.com/music/netease/songList?key=579621905&id=' + url_id)
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {
                    var aplayerAudios = [];
                    data.data.songs.forEach(item => {
                        var audio = {
                            name: item.name,
                            artist: item.singer,
                            url: (item.url + '&br=999000'),
                            cover: item.pic,
                            lrc: item.lrc
                        }
                        aplayerAudios.push(audio);
                        aLength++;
                    });

                    const ap = new APlayer({
                        container: document.getElementById('aplayer'),
                        fixed: true,
                        autoplay: true,
                        lrcType: 3,
                        volume: 0.2,
                        audio: aplayerAudios
                    });
                })
                .catch(function (err) {
                    console.error(err);
                })

            return f;
        },
        watchLrc: function () {
            /**
             * lineNo
             */
            var lastTimeValue = outLrc.outLineNo;
            Object.defineProperty(outLrc, 'outLineNo', {
                get: function () {
                    return outLineNo;
                },
                set: function (value) {
                    outLineNo = value;
                    if (lastTimeValue != outLineNo) {
                        lastTimeValue = outLineNo;
                        L.mySend('lineNo',outLineNo)
                    }
                }
            });
            /**
             * lrc
             */
            var lastTimeValue = outLrc.lrc;
            Object.defineProperty(outLrc, 'lrc', {
                get: function () {
                    return lrc;
                },
                set: function (value) {
                    lrc = value;
                    if (lastTimeValue != lrc) {
                        lastTimeValue = lrc;
                        nowLrc = lrc;
                        L.mySend('nowLrc',nowLrc)
                    }
                }
            });
        },
        mySend: function (name, data=[]) {
            chrome.tabs.query({ active: true, currentWindow: true },
                function (tabs) {
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            name: name,
                            data: data
                        },
                        function (response) {
                            
                        });
                }
            );
        }
    } //L end

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse){
            if (request.name == "opened"){
                L.getFun(request.data).then((res) => {
                    L.watchLrc()
                })
                sendResponse({ name: "opened" });
            }
            if (request.name == "cleared"){
                if(document.getElementById('aplayer')){
                    document.getElementById('aplayer').remove();
                }
                sendResponse({ name: "cleared" });
            }
            if (request.name == "getLrc"){
                sendResponse({ name: "nowLrc", data: nowLrc });
            }
            if (request.name == "started"){
                outAudio.play();
                sendResponse({ name: "started" });
            }
            if (request.name == "paused"){
                outAudio.pause();
                sendResponse({ name: "paused" });
            }
            if (request.name == "upped"){
                var i = outAudio.volume;
                i = i + 0.1 > 1 ? i : i + 0.1;
                outAudio.volume = i;
                sendResponse({ name: "upped" });
            }
            if (request.name == "downed"){
                var i = outAudio.volume;
                i = i - 0.1 < 0 ? i : i - 0.1;
                outAudio.volume = i;
                sendResponse({ name: "downed" });
            }
            if (request.name == "sed"){
                var i = nowIndex;
                i = i - 1 < 0 ? i : i - 1;
                if(i != nowIndex)
                    outSwitch(i)
                sendResponse({ name: "sed" });
            }
            if (request.name == "xed"){
                var i = nowIndex;
                i = i + 1 > aLength ? i : i + 1;
                if(i != nowIndex)
                    outSwitch(i)
                sendResponse({ name: "xed" });
            }
            if (request.name == "ded"){
                if(outA.loop == "one") {
                    outA.loop = "all";
                    sendResponse({ name: "dmd" });
                } else {
                    outA.loop = "one";
                    sendResponse({ name: "ded" });
                }
            }
            if (request.name == "sjed"){
                
                sendResponse({ name: "sjed" });
            }
            if (request.name == "state"){
                var res = null;
                if(nowAudio){
                    res = nowAudio;
                } else{
                    res = false;
                }
                sendResponse({ name: "state", data: res})
            }
        }
    );
})()