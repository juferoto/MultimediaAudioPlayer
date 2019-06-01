let ap = null;
let songA = new Song("Sure", "Emarosa", "assets/emarosa.jpg", "songs/1.mp3") //new Song(name, artist, cover, file)
let songB = new Song("Mujer Amante", "Rata Blanca", "assets/Old_Town_Road_cover.jpg", "songs/2.mp3")
let songC = new Song("Leyenda del Hada y del Mago", "Rata Blanca", "assets/virtualscape.jpg", "songs/3.mp3")

function start(){
    ap = new AudioPlayer({
        gui:{
            totalTime: {value: "0:00", DOMElement: document.querySelector(".totalTime")},
            currentTime: {value: "0:00", DOMElement: document.querySelector(".currentTime")},
            progressBar: {value: "0:00", DOMElement: document.querySelector(".progressBar")},
        },
        buttons:{
            playPause: document.querySelector(".play"),
            volume: document.querySelector(".volume"),
            next: document.querySelector(".next")
        },
        songs:[songA, songB, songC]
    }
    );
}