const textarea = document.querySelector("textarea");
const deck = document.querySelector("#deck");
const slides = [
    '#Have Some Fun! 🎉\nFork this project and experiment with the real-time logic.',
    '#Clever Libraries 🛠\nPowered by Express.js, Socket.io, Showdown and some sweet Vanilla JS',
];

// Borrowed from http://atodorov.org/blog/2013/01/28/remove-query-string-with-javascript-and-html5/
var uri = window.location.toString();
if (uri.indexOf("?") > 0) {
    var clean_uri = uri.substring(0, uri.indexOf("?"));
    window.history.replaceState({}, document.title, clean_uri);
}

function sendUpdateSlideRequest(markdown) {
    const { protocol } = window.location;
    const url = `${protocol}/api/updateSlide?markdown=${encodeURIComponent(markdown)}`;
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    xhttp.send();
}

function updateDeck() {
    deck.innerHTML = "";
    slides.forEach((markdown) => {
        const slideNode = document.createElement("p");
        slideNode.innerText = markdown;
        slideNode.onclick = () => {
            sendUpdateSlideRequest(markdown);
        }
        deck.appendChild(slideNode);
    })
}

function handleSubmit() {
    if (textarea.value.length > 0) {
        slides.unshift(textarea.value);
        updateDeck();
        sendUpdateSlideRequest(textarea.value);
    }
    textarea.value = "";
}

(() => {
    updateDeck();
})();