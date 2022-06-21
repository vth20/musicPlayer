const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUSICPLAYER_vth20'

const player = $('.player')
const singer = $('header h4')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const cd = $('.cd')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const volumeValue = $('#volume')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const volumeMute = $('#volume_mute')
const volumeMax = $('#volume_max')
const playlist = $('.playlist')

const app = {
    volumeCurrent: 0,
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMute: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    arrayRandomSong: [],
    handleArrayRandomSong: function() {
        let newIndex
        const check = () => {
            if(
                this.arrayRandomSong.includes(newIndex)
                &&
                this.arrayRandomSong.length <= this.songs.length
                ||
                newIndex === this.currentIndex
            ){
                if(this.arrayRandomSong.length == this.songs.length) {
                    this.arrayRandomSong = []
                }
                return true;
            }
        }
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (check())
        this.arrayRandomSong.push(newIndex)
        return newIndex
    },

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    setTitle: function() {
        const title = `${this.songs[this.currentIndex].name} - ${this.songs[this.currentIndex].singer} | Bài hát, lyric`
        document.title = title;
    },

    loadConfig: function() {
        this.isRandom = (this.config.isRandom) || false;
        randomBtn.classList.toggle("active", this.isRandom)

        this.isRepeat = (this.config.isRepeat) || false;
        repeatBtn.classList.toggle("active", this.isRepeat)

        this.currentIndex = (this.config.currentIndex) || 0;
        this.volumeCurrent = (this.config.volumeCurrent) || 80;
    },
    songs: [
        {
            name: 'Paris',
            singer: 'The Chainsmokers',
            path: './assets/audio/The Chainsmokers - Paris (Lyric).mp3',
            image: './assets/images/paris.jpg',
            length: '03:48'
        },
        {
            name: 'Symphony',
            singer: 'Clean Bandit',
            path: './assets/audio/Clean Bandit - Symphony (feat. Zara Larsson) _Official Video_.mp3',
            image: './assets/images/symphony.jpg',
            length: '04:06'
        },
        {
            name: 'Shape of You',
            singer: 'Ed Sheeran',
            path: './assets/audio/Ed Sheeran - Shape of You (Official Music Video).mp3',
            image: './assets/images/shapeofyou.jpg',
            length: '04:23'
        },
        {
            name: 'Monsters',
            singer: 'Katie Sky',
            path: './assets/audio/Katie Sky - Monsters (Official Audio _ Out Now at iTunes).mp3',
            image: './assets/images/monster.jpg',
            length: '03:48'
        },
        {
            name: 'LSD',
            singer: 'Genius ft. Sia, Diplo, Labrinth',
            path: './assets/audio/LSD - Genius ft. Sia, Diplo, Labrinth.mp3',
            image: './assets/images/genius.jpg',
            length: '03:42'
        },
        {
            name: 'R. City',
            singer: 'Locked Away ft. Adam Levine',
            path: './assets/audio/R. City - Locked Away ft. Adam Levine.mp3',
            image: './assets/images/lockaway.jpg',
            length: '04:25'
        },
        {
            name: 'Treat You Better',
            singer: 'Shawn Mendes',
            path: './assets/audio/Shawn Mendes - Treat You Better.mp3',
            image: './assets/images/treatyoubetter.jpg',
            length: '04:16'
        },
        {
            name: 'Something Just Like This',
            singer: 'The Chainsmokers',
            path: './assets/audio/The Chainsmokers _ Coldplay - Something Just Like This (Extended Radio Edit).mp3',
            image: './assets/images/stjlt.jpg',
            length: '06:36'
        },
        {
            name: 'Rockabye',
            singer: 'Clean Bandit',
            path: './assets/audio/Clean Bandit - Rockabye (feat. Sean Paul _ Anne-Marie) _Official Video_.mp3',
            image: './assets/images/rockabye.jpg',
            length: '04:13'
        },
        {
            name: 'Closer',
            singer: 'The Chainsmokers',
            path: './assets/audio/The Chainsmokers - Closer (Lyric) ft. Halsey.mp3',
            image: './assets/images/closer.jpg',
            length: '04:21'
        }
    ],
    render: function() {
        this.setTitle()
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index=${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                    <div class="gifAudio" style="background-image: url('./assets/images/icon/icon-playing.gif')"></div>
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newWidth = cdWidth - scrollTop
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        }

        playBtn.onclick = () => {
            (_this.isPlaying) ? audio.pause() : audio.play()
        }

        audio.onplay = () => {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()

            _this.gifPlaying()
            _this.setConfig('currentIndex', _this.currentIndex);
        }

        audio.onpause = () => {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
            _this.gifPlaying()
        }

        audio.ontimeupdate = () => {
            if(audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100
                progress.value = progressPercent
            }
            _this.timeAudio()
        }

        progress.oninput = () => { // progress.value = (e.target.value)
            const seekTime = progress.value * audio.duration / 100;
            audio.currentTime = seekTime;
            audio.play()
        }

        volumeValue.oninput = () => {
            if(volumeValue.value == 0) {
                _this.isMute = true;
            }
            else {
                _this.volumeCurrent = Number.parseInt(volumeValue.value);
                _this.isMute = false;
            }
            _this.setConfig('volumeCurrent', _this.volumeCurrent)
            _this.volumeSetting()
        }

        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }],
        {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }

        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        // Turn on/ of random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle("active", _this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)
        }

        //xu ly next song khi audio ended
        audio.onended = function() {
            nextBtn.click()
        }
        //xu ly khi repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active", _this.isRepeat)
            _this.playRepeatSong()
            _this.setConfig('isRepeat', _this.isRepeat)
        }

        volumeMute.onclick = function() {
            _this.isMute = false;
            _this.volumeSetting();
        }

        volumeMax.onclick = function() {
            _this.isMute = true;
            _this.volumeSetting();
        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.option');
            if(songNode || optionNode) {
                if(songNode && !optionNode) {
                    _this.currentIndex = Number.parseInt(songNode.dataset.index);
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                else {
                    console.log("vth20");
                }
            }
        }
    },
    loadCurrentSong: function() {
        singer.textContent = this.currentSong.singer
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        this.scrollActiveSong()
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex = this.handleArrayRandomSong()
        // do {
        //     newIndex = Math.floor(Math.random() * this.songs.length)
        // } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    playRepeatSong: function() {
        audio.loop = this.isRepeat;
    },
    volumeSetting: function() {
        if(this.isMute || this.volumeCurrent == 0) {
            volumeValue.value = 0;
            audio.muted = true;
            volumeMax.classList.remove('active')
            volumeMute.classList.add('active')
        }
        else {
            volumeValue.value = this.volumeCurrent
            audio.volume = this.volumeCurrent / 100;
            audio.muted = false;
            volumeMax.classList.add('active')
            volumeMute.classList.remove('active')
        }
    },
    scrollActiveSong: function() {
        const songIndex = this.currentIndex;
        window.scrollTo(0, 200+songIndex*86)
    },
    gifPlaying: function() {
        const gif = $$('.gifAudio');
        const index = this.currentIndex;
        (audio.paused) ? (gif[index].classList.remove('active')) : (gif[index].classList.add('active'))
    },
    timeAudio: function() {
        const TIME_AUDIO = $('.timeupdate_wrapper')

        const minutesCurrent = Math.floor(audio.currentTime / 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
        const secondsCurrent = Math.floor(audio.currentTime % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})

        TIME_AUDIO.innerHTML = `${minutesCurrent}:${(secondsCurrent)} / ${this.songs[this.currentIndex].length}`
    },
    start: function() {
        this.loadConfig()
        this.volumeSetting()
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
    }
}

app.start()
