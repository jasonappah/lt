var pass = document.querySelector("#pass");
var user = document.querySelector("#user");
var msg = document.querySelector("#msg");
var nameShown = false

let url = new URL(window.location)
let params = new URLSearchParams(document.location.search.substring(1));
let spMsg = params.get("msg")
if (spMsg) {
    msg.innerHTML = spMsg
} else {
    // Borrowed from http://atodorov.org/blog/2013/01/28/remove-query-string-with-javascript-and-html5/
    var uri = window.location.toString();
    if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
        msg.innerHTML = "Login unsuccessful. Maybe you need to sign up?"
    }
}

function onLogin() {
    pass = md5(pass.value);
    user = md5(user.value);
    window.location = `${window.location.href}?user=${user}&pass=${pass}`
}

function onSubmitHandler() {
    if (nameShown == false) {
        document.querySelector("#name-field").removeAttribute("class")
        console.log("removed cls attr")
        nameShown = true;
    } else {
        console.log("doing other things")
        pass = md5(pass.value);
        user = encodeURIComponent(user.value);
        name = encodeURIComponent(document.querySelector("#name-field").value);
        var urlRedirect = `${window.location.protocol}//${window.location.host}/api/newUser?user=${user}&pass=${pass}&name=${name}`
        console.log(urlRedirect);
        window.location = urlRedirect;
        console.log("ok, how tf did we get here but you didn't run the previous line")
    }
}

function onSubmit() {
    onSubmitHandler();
}
pass.addEventListener('keydown', function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        onLogin();
    }
});