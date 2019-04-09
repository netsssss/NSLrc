(function () {
    var L = {
        menu: function (audio = false) {
            if (audio) {
                document.getElementById('name').innerHTML = audio.name;
                document.getElementById('artist').innerHTML = audio.artist;
                document.getElementById('menu').style.display = 'block';
            } else {
                document.getElementById('menu').style.display = 'none';
            }
        },
        mySend: function (name, data = []) {
            chrome.tabs.query({ active: true, currentWindow: true },
                function (tabs) {
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            name: name,
                            data: data
                        },
                        function (response) {
                            if (response.name == 'open') {
                                document.getElementById('show').innerHTML = response.data;
                            }
                            var name = ['lrc', 'clear', 'start', 'pause', 'up', 'down', 's', 'x', 'd', 'sj']
                            if (name.indexOf(response.name) != -1) {
                                document.getElementById('show').innerHTML = response.data;
                            }
                        });
                }
            );
        }
    }	//L end
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.name == "reStatus") {
                L.menu(request.data)
            }
        }
    );
    document.getElementById('sheet').onchange = () => {
        if (!localStorage.getItem('sheets')) {
            localStorage.setItem('sheets', document.getElementById('sheet').value);
        } else {
            if (localStorage.getItem('sheets').split(',').indexOf(document.getElementById('sheet').value) == -1) {
                localStorage.setItem('sheets', localStorage.getItem('sheets') + ',' + document.getElementById('sheet').value);
            }
        }
    }
    document.getElementById('sheet').onclick = () => {
        if(localStorage.getItem('sheets')) {
            var tpl = '', len = localStorage.getItem('sheets').split(',').length;
            for (var i = len; i > (len > 3 ? (len - 3) : 0); i--) {
                tpl += '<input type="button" class="my-btn" style="padding:3px 6px; font-size:10px; border-radius:0;" value="' + localStorage.getItem('sheets').split(',')[(i - 1)] + '"></input><br>';
            }
            document.getElementById('sheets').innerHTML = tpl + '<span style="height:3px; display:block;">';
    
            for (var j = 0; j < (len > 3 ? 3 : len); j++) {
                (function (k) {
                    document.getElementById('sheets').getElementsByTagName('input')[k].onclick = () => {
                        L.mySend('open', document.getElementById('sheets').getElementsByTagName('input')[k].value);
                    }
                })(j)
            }
        }
    }
    document.getElementById('open').onclick = () => {
        L.mySend('open', document.getElementById('sheet').value);
    }
    document.getElementById('lrc').onclick = () => {
        L.mySend('lrc');
    }
    document.getElementById('clear').onclick = () => {
        L.mySend('clear');
    }
    document.getElementById('start').onclick = () => {
        L.mySend('start');
    }
    document.getElementById('pause').onclick = () => {
        L.mySend('pause');
    }
    document.getElementById('up').onclick = () => {
        L.mySend('up');
    }
    document.getElementById('down').onclick = () => {
        L.mySend('down');
    }
    document.getElementById('s').onclick = () => {
        L.mySend('s');
    }
    document.getElementById('x').onclick = () => {
        L.mySend('x');
    }
    document.getElementById('d').onclick = () => {
        L.mySend('d');
    }
    document.getElementById('sj').onclick = () => {
        L.mySend('sj');
    }

    L.mySend('status');
})();
