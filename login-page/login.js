// document.getElementById("SP").addEventListener("change", function () {
//   let passwordField = document.getElementById("password");
//   if (this.checked) {
//     passwordField.type = "text";
//   } else {
//     passwordField.type = "password";
//   }
// });
function show(){
    let show = document.getElementById("password")
    if (show.type == "password"){
        show.type = "text"
    }
    else{
        show.type = "password"
    }
}