var mover = document.querySelector("#rig");
  
    mover.addEventListener("movingended", function(){
        AFRAME.utils.entity.setComponentProperty(this, "alongpath.curve", "#track2");
        AFRAME.utils.entity.setComponentProperty(this, "alongpath.dur", "20000");
    });

const front = document.getElementById("front");
function tofront() {
  front.scrollIntoView({behavior: "smooth", block: "start", inline: "center"});
}
