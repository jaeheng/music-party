window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
window.onload = function () {
    var i = 0;
    var list = [
        './mp3/许镜清 - 天府乐.mp3',
        './mp3/Dj Titon - 死机之歌.mp3',
        './mp3/John Williams - Twentieth Century Fox Fanfare with CinemaScope Extension.mp3',
        './mp3/许镜清 - 云宫迅音.mp3',
        './mp3/MetroGnome - Ringtone (MetroGnome Remix).mp3',
        './mp3/Space - Just Blue.mp3',
        './mp3/胡伟立 - 市集.mp3',
        './mp3/胡伟立 - 偷功.mp3',
        './mp3/卢冠廷 - 賭神.mp3',
        './mp3/群星 - 渔舟唱晚 (cut版).mp3',
        './mp3/文武贝 - 新闻联播片尾曲-文武贝重新制作.mp3',
        './mp3/武聆音雄 - 天龙八部间奏曲.mp3',
        './mp3/中国人民解放军军乐团 - 运动员进行曲.mp3'
    ];
    var audio = document.getElementById('audio');
    audio.setAttribute('src', list[i]);
    audio.onended = function () {
        i++;
        if (list[i]) {
            this.setAttribute('src', list[i]);
        } else {
            i = 0;
            this.setAttribute('src', list[i]);
        }
    };
    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    var canvas = document.getElementById('canvas'),
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        twidth = 5,
        meterWidth = 1,
        capHeight = 1,
        capStyle = '#fff',
        meterNum = 1000,
        capYPositionArray = [];
    ctx = canvas.getContext('2d');
    var gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, '#46A3FF');

    function renderFrame() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        var step = Math.round(array.length / meterNum);
        analyser.getByteFrequencyData(array);
        ctx.clearRect(0, 0, cwidth, cheight);
        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value);
            }
            ctx.fillStyle = capStyle;
            if (value < capYPositionArray[i]) {
                ctx.fillRect(i * twidth, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            } else {
                ctx.fillRect(i * twidth, cheight - value, meterWidth, capHeight);
                capYPositionArray[i] = value;
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(i * twidth, cheight - value + capHeight, meterWidth, cheight);
        }
        requestAnimationFrame(renderFrame);
    }

    renderFrame();
    var parse = document.getElementById('parse');
    parse.addEventListener('click', function () {
        if (this.getAttribute('class') === 'parse') {
            audio.pause();
            parse.setAttribute('class', 'play')
        } else {
            audio.play();
            parse.setAttribute('class', 'parse')
        }
    });

    var prev = document.getElementById('prev');
    prev.addEventListener('click', function () {
        i--;
        if (list[i]) {
            audio.setAttribute('src', list[i]);
        } else {
            i = list.length - 1;
            audio.setAttribute('src', list[i]);
        }
    });

    var next = document.getElementById('next');
    next.addEventListener('click', function () {
        audio.onended()
    })
};