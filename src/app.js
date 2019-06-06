let ap = null;
//new Song(name, artist, cover, file)
let songA = new Song("Sure", "Emarosa", "assets/emarosa.jpg", "songs/1.mp3")
let songB = new Song("Mujer Amante", "Rata Blanca", "assets/Old_Town_Road_cover.jpg", "songs/2.mp3")
let songC = new Song("Leyenda del Hada y del Mago", "Rata Blanca", "assets/virtualscape.jpg", "songs/3.mp3")

function start(){
    ap = new AudioPlayer({
        gui:{
            totalTime: {value: "0:00", DOMElement: document.querySelector(".totalTime")},
            currentTime: {value: "0:00", DOMElement: document.querySelector(".currentTime")},
            progressBar: {value: "0:00", DOMElement: document.querySelector(".progressBar")},
            artistName: {value: null, DOMElement: document.querySelector(".artistName")},
            songName: {value: null, DOMElement: document.querySelector(".songName")},
            albumCover: {value: null, DOMElement: document.querySelector("#player")}
        },
        buttons:{
            playPause: document.querySelector(".play"),
            volume: document.querySelector(".volume"),
            back: document.querySelector(".previous"),
            next: document.querySelector(".next"),
            queue: document.querySelector(".queue")
        },
        songs:[songA, songB, songC]
    }
    );
}