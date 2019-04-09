(function () {
    var L = {
        setLrc: function (aLrc) {
            document.body.innerHTML += '<div id="myLrc" style="height:32px;width:max-content;user-select:none;color:rgb(102,102,102);font-size:12px;font-family:Arial,Helvetica,sans-serif;overflow:hidden;position:fixed;top:100px;right:10px;margin:0px;display:block;text-align:center;z-index:99999;"><div id="lrcBody" style="transition:all 0.3s;cursor:default;"></div></div>';
            var LrcBody = document.getElementById('lrcBody');
            for (var i = 0; i < aLrc.length; i++) {
                LrcBody.innerHTML += '<p style="height:16px;font-size:12px;line-height:16px;margin:0px;padding:0px;">' + aLrc[i][1] + '</p>'
            }
        },
        updateLrc: function (newLrc) {
            if(document.getElementById('myLrc')) {
                document.getElementById('myLrc').remove();
            }
            L.setLrc(newLrc);
            L.dragLrc();
        },
        dragLrc: function () {
            var myLrc = document.getElementById('myLrc');
            var x = 0;
            var y = 0;
            var l = 0;
            var t = 0;
            var isDown = false;
            myLrc.onmousedown = function(e) {
                x = e.clientX;
                y = e.clientY;
                l = myLrc.offsetLeft;
                t = myLrc.offsetTop;
                isDown = true;
                myLrc.style.background = 'rgba(255,255,255,0.9)';
            }
            window.onmousemove = function(e) {
                if (isDown == false) {
                    return;
                }
                var nx = e.clientX;
                var ny = e.clientY;
                var nl = nx - (x - l);
                var nt = ny - (y - t);
                myLrc.style.left = nl + 'px';
                myLrc.style.top = nt + 'px';
            }
            myLrc.onmouseup = function() {
                isDown = false;
                myLrc.style.background = '';
            }
        },
        lineHight: function (no) {
            try{
                var lrcBody = document.getElementById('lrcBody');
                if (no > 0) {
                    lrcBody.children[no - 1].style['font-weight'] = '';
                }
                lrcBody.children[no].style['font-weight'] = 'bold';
                tranY = (0 - (no * 16)) + 'px';
                lrcBody.style.transform = 'translateY(' + tranY + ')';
            } catch(err) {

            }   
        },
        mySend: function (name, data = []) {
            chrome.extension.sendMessage({ name: name, data: data },
                function (response) {
                    if (response && response.name == 'nowLrc') {
                        L.updateLrc(response.data);
                    }
                    if (response && response.name == 'state') {
                        L.mySend('reStatus',response.data)
                    }
                }
            );
        }
    } //L end

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse){
            if(request.name == 'songListName'){
                console.log(request.name)
                // L.mySend('theSongListName',request.data)
                sendResponse({ name: 'songListName' })
            }
            if (request.name == "open"){
                L.mySend('opened', request.data)
                sendResponse({ name: 'open', data: '打开了音乐' });
            }
            if (request.name == "lrc"){
                L.mySend('getLrc')
                sendResponse({ name: 'lrc', data: '显示了歌词' });
            }
            if (request.name == "clear"){
                if (document.getElementById('myLrc')){
                    document.getElementById('myLrc').remove();
                }
                L.mySend('cleared')
                sendResponse({ name: 'clear', data: '重置了音乐' });
            }
            if (request.name == "start"){
                L.mySend('started')
                sendResponse({ name: 'start', data: '播放了音乐' });
            }
            if (request.name == "pause"){
                L.mySend('paused')
                sendResponse({ name: 'pause', data: '暂停了音乐' });
            }
            if (request.name == "up"){
                L.mySend('upped')
                sendResponse({ name: 'up', data: '升高了音量' });
            }
            if (request.name == "down"){
                L.mySend('downed')
                sendResponse({ name: 'down', data: '降低了音量' });
            }
            if (request.name == "s"){
                L.mySend('sed')
                sendResponse({ name: 's', data: '换了上一首' });
            }
            if (request.name == "x"){
                L.mySend('xed')
                sendResponse({ name: 'x', data: '换了下一首' });
            }
            if (request.name == "d"){
                L.mySend('ded')
                sendResponse({ name: 'd', data: '循环了单曲' });
            }
            if (request.name == "sj"){
                L.mySend('sjed')
                sendResponse({ name: 'sj', data: '随机了顺序' });
            }
            if (request.name == "status"){
                L.mySend('state')
                sendResponse({ name: 'status' });
            }
            if(request.name == "nowLrc"){
                L.updateLrc(request.data);
            }
            if (request.name == "lineNo"){
                L.lineHight(request.data)
                sendResponse({ name: '' });
            }

        }
    );
})()