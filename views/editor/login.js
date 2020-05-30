var pass = document.querySelector("#pass");
var user = document.querySelector("#user");

function onSubmit() {
    pass = md5(pass.value);
    user = md5(user.value);
    window.location = `${window.location.href}?user=${user}&pass=${pass}`
}