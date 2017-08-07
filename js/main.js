window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audio = document.getElementById('audio');
var ctx = new AudioContext();
var vm = new Vue({
    el: '#app',
    data: {
        musicList: [
            './mp3/CCTV新闻联播.mp3',
            './mp3/FC《马戏团》.mp3',
            './mp3/Just Blue.mp3',
            './mp3/许镜清 - 云宫迅音.mp3',
            './mp3/大圣歌.mp3',
            './mp3/死机之歌.mp3',
            './mp3/渔舟唱晚.mp3',
            './mp3/纤夫的爱.mp3',
            './mp3/葫芦金刚.mp3',
            './mp3/那些花儿.mp3',
            './mp3/我想念你一如独自撸管的悲伤.mp3'
        ],
        currentMusic: 0,
        isPlay: 0,
        showList: 0
    },
    methods: {
        setPlay: function (index) {
            var musicList = this.musicList
            this.currentMusic = index
            if (index < 0 || index > musicList.length) {
                console.log('没有该歌曲!');
            }
            audio.setAttribute('src', musicList[index]);
        },
        play: function () {
            audio.play();
            this.isPlay = 1;
        },
        pause: function () {
            audio.pause();
            this.isPlay = 0;
        },
        playAndPause: function () {
            this.isPlay = !this.isPlay;
            if (this.isPlay) {
                this.play();
            } else {
                this.pause();
            }
        },
        next: function () {
          this.handleEnded();
        },
        prev: function () {
            if (this.currentMusic === 0) {
                this.currentMusic = this.musicList.length - 1;
            } else {
                this.currentMusic--;
            }
        },
        handleEnded: function () {
            if (this.currentMusic === this.musicList.length - 1) {
                this.currentMusic = 0;
            } else {
                this.currentMusic++;
            }
        },
        clickMusic: function (index) {
            this.currentMusic = index;
        }
    },
    watch:{
        'currentMusic': function (index) {
            this.setPlay(index);
            this.play();
        }
    },
    filters: {
        getMp3Name: function (value) {
            return value.replace(/.\/mp3\//, '')
        }
    },
    created: function () {
        console.log('mounted')
        this.setPlay(this.currentMusic)
    }
})

window.onload = function () {
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
};