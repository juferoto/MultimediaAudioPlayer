class AudioPlayer {

    constructor(params) {

        this._songs = [];
        this._queue = [];
        this.player = new Audio();
        
        //let src = "songs/1.mp3";

        this._gui = {
            progressBar: { value: null, DOMElement: null },
            artistName: { value: null, DOMElement: null },
            songName: { value: null, DOMElement: null },
            currentTime: { value: null, DOMElement: null },
            totalTime: { value: null, DOMElement: null },
            albumCover: { value: null, DOMElement: null }
        };

        if (params.hasOwnProperty("songs")) {
            //console.log(params.songs)
            this._songs = params.songs;
            this._queue = this._songs;
            this._loadSong(this._songs[0]);
        }

        if (params.hasOwnProperty("gui")) {
            var { progressBar, artistName, songName, currentTime, totalTime, albumCover } = params.gui;
            this._initGUI(progressBar, artistName, songName, currentTime, totalTime, albumCover);
        }

        this._buttons = {
            queue: null,
            volume: null,
            back: null,
            playPause: null,
            next: null,
            add: null
        }

        if (params.hasOwnProperty("buttons")) {
            var { queue, volume, back, playPause, next, add } = params.buttons;
            this._initButtons(queue, volume, back, playPause, next, add);
        }

    }

    _loadSong(song) {
        this.player.src = song.file;
        this.player.onloadedmetadata = () => {
            this.gui = {
                totalTime: { value: this.player.duration, DOMElement: this.gui.totalTime.DOMElement },
                currentTime: { value: 0, DOMElement: this.gui.currentTime.DOMElement }
            }
        }
        this.player.ontimeupdate = () => {
            //console.log(this.player.currentTime);
            this.gui = {
                currentTime: { value: this.player.currentTime, DOMElement: this.gui.currentTime.DOMElement }
            }
            var [totalTime, currentTime] = [this.gui.totalTime.value, this.gui.currentTime.value];
            var progress = (currentTime / totalTime) * 100;
            let pBar = this.gui.progressBar.DOMElement.querySelector("div");
            pBar.style.width = `${progress}%`;
        }
    }

    _initGUI(...params) {
        this.gui = {
            progressBar: params[0] || { value: null, DOMElement: null },
            artistName: params[1] || { value: null, DOMElement: null },
            songName: params[2] || { value: null, DOMElement: null },
            currentTime: params[3] || { value: null, DOMElement: null },
            totalTime: params[4] || { value: null, DOMElement: null },
            albumCover: params[5] || { value: null, DOMElement: null }
        };
    }

    _initButtons(...params) {
        this.buttons = {
            queue: params[0] || null,
            volume: params[1] || null,
            back: params[2] || null,
            playPause: params[3] || null,
            next: params[4] || null,
            add: params[5] || null
        };
    }

    _addClickEvent(element, callback) {
        if (element instanceof HTMLElement) {
            element.onclick = callback;
        } else {
            if (element.hasOwnProperty("DOMElement")) {
                element = element.DOMElement;
                if (element instanceof HTMLElement) {
                    element.onclick = callback;
                }
            }
        }
    }

    _toggleIcon(el, aClass, bClass) {
        let i = el.querySelector("i");
        if (i.classList.contains(aClass)) {
            var [a, b] = [aClass, bClass];
        } else {
            var [b, a] = [aClass, bClass];
        }
        i.classList.remove(a);
        i.classList.add(b);
    }

    _assignValues(toAssign, elements, actions = []) {
        const keys = Object.keys(elements);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (elements[key] != null) {
                toAssign[key] = elements[key];
                if (Object.keys(actions).length > 0) {
                    if (actions.hasOwnProperty(key)) {
                        this._addClickEvent(toAssign[key], actions[key]);
                    }
                }
            }
        }
    }

    set buttons(btns) {
        let actions = {
            playPause: () => {
                if (this.player.paused) {
                    this.player.play();
                } else {
                    this.player.pause();
                }
                this._toggleIcon(this.buttons.playPause, "fa-play", "fa-pause");
            },
            queue: () => {
                /*if (this.gui.songName.DOMElement.style.visibility == "hidden")
                    this.gui.songName.DOMElement.style.visibility = "visible";
                else
                    this.gui.songName.DOMElement.style.visibility = "hidden";*/
                //_loadList() TODO
                /*Create this kind of elements
                <div class="infoPlaylist">
                    <div class="songName">Sure</div>
                    <div class="artistName">Emarosa</div>
                </div>
                 */
            },
            volume: () => {
                this.player.volume = (this.player.volume != 0) ? 0 : 1
                this._toggleIcon(this.buttons.volume, "fa-volume-up", "fa-volume-mute");

            },
            back: () => {
                this._playTrack(-1, null);                
            },
            next: () => {
                this._playTrack(1, null);                
            },
            add: () => false,

        }
        this._assignValues(this._buttons, btns, actions);
    }

    _playTrack(location, fileName) 
    {
        this.player.pause();
        let i = this.buttons.playPause.querySelector("i");
        i.classList.remove("fa-pause");
        i.classList.add("fa-play");
        let position;
        if (fileName == null)
            position = this._songs.findIndex(element => this.player.src.includes(element.file));
        else
            position = this._songs.findIndex(element => this.player.src.includes(fileName));
        if (location > 0 && position == this._songs.length-1) {
            position = -1;
        } else if (location < 0 && position == 0) {
            position = this._songs.length;
        }
        let songObj = this._songs[position+location];
        this._loadSong(songObj);
        this.gui.artistName.DOMElement.innerHTML = songObj.artist;
        this.gui.songName.DOMElement.innerHTML = songObj.name;
        this.gui.albumCover.DOMElement.style.backgroundImage = `url('${songObj.cover}')`;
    }

    get buttons() {
        return this._buttons;
    }

    _showTime(sec){
        var sign = sec < 0 ? "-" : "";
        var min = Math.floor(sec/60)
        sec = Math.round(Math.abs(sec) % 60);
        return sign + min + ":" + (sec < 10 ? "0" + sec : sec)
    }

    set gui(elments) {
        let actions = {
            progressBar: (e) => {
                let x = e.offsetX;
                let w = this.gui.progressBar.DOMElement.offsetWidth;
                let newCurrentTime = this.gui.totalTime.value * (x/w);
                this.player.currentTime = newCurrentTime;
                this.gui = {
                    currentTime: {value: newCurrentTime, DOMElement: this.gui.currentTime.DOMElement}
                }
            }
        }        
        
        this._assignValues(this._gui, elments, actions);
        this._updateBasigGUIElement(this.gui.totalTime);
        this._updateBasigGUIElement(this.gui.currentTime);
    }

    _updateBasigGUIElement(el) {
        if (el.DOMElement instanceof HTMLElement) {
            el.DOMElement.innerHTML = this._showTime(el.value);
        }
    }

    get gui() {
        return this._gui;
    }
}