const ctabtn = document.getElementById("ctabtn");var url = "https://cdn.glitch.global/c86dbe1c-2f75-41bb-9643-e6c9bbe91492/";var photos = [  "033",  "032",  "036",  "042",  "037",  "041",  "047",  "050",  "001",  "002",  "003",  "004",  "005",  "006",  "007",  "008",  "051",  "052",  "056",  "059",  "062",  "064",  "065",  "067",  "010",  "011",  "012",  "013",  "014",  "018",  "019",  "020",  "021",  "022",  "023",  "025",  "024",  "026"]function getphotos() {  let i = 0;  var gallery = document.getElementById("gallery");  photos.forEach((element) => {    var newPhoto = document.createElement("img");    newPhoto.classList.add("photo");    newPhoto.src = url + photos[i] + ".jpg";    gallery.appendChild(newPhoto);    i++;  })}getphotos();