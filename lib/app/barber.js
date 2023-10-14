(() => {
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];
    const modalContent = document.getElementById("modal-content");
    span.onclick = function () {
        modal.style.display = "none";
    };
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
    async function parseJson() {
        console.log("anything");
        let barbersArray = await (await fetch("../barbers.json")).json();
        let barbersArrayContainer = document.getElementById("barbers-main-content-inner-container");
        for (let i = 0; i < barbersArray.length; i++) {
            barbersArrayContainer.insertAdjacentHTML("beforeend", `<div class="barbersCardElement" id='card${i}'>
      <img class ="cardElementImg" src= "${barbersArray[i].img}">
      <div class="cardElementName">${barbersArray[i].name}</div>
      <div class="cardElementBio">${barbersArray[i].bio}</div>
      <div class="cardElementScheduleAppointment">${barbersArray[i].scheduleAppointment}</div>
      <div class="cardElementContactInfo" id="${i}">${barbersArray[i].contact}</div>
      <div class="socialMediaBtnContainer" id="socialMediaBtnContainer${i}"></div>
      </div>`);
            let socialMediaBtnContainer = document.getElementById("socialMediaBtnContainer" + i);
            for (let j = 0; j < barbersArray[i].socialMediaLinks.length; j++) {
                socialMediaBtnContainer.insertAdjacentHTML("beforeend", `<div class="socialMediaButton"> <a href="${barbersArray[i].socialMediaLinks[j]}"><img class="buttonImg" src="${barbersArray[i].buttonImg[j]}"/></a></div>`);
            }
            let card = document.getElementById("card" + i);
            card.addEventListener("click", (e) => {
                const clickedElement = e.target;
                if (socialMediaBtnContainer.contains(clickedElement)) {
                    return;
                }
                modalContent.innerHTML = "";
                modal.style.display = "block";
                modalContent.insertAdjacentHTML("beforeend", `<div class="barbersInfoExpanded" id='cardA${i}'>
            <div id="barberInfoContainer">
              <img class ="cardElementImgExpanded" src= "${barbersArray[i].img}">
              <div class="cardElementNameExpanded">${barbersArray[i].name}</div>
              <div class="cardElementBioExpanded">${barbersArray[i].bio}</div>
              <div class="cardElementScheduleAppointmentExpanded">${barbersArray[i].scheduleAppointment}</div>
              <div class="cardElementContactInfoExpanded" id="${i}">${barbersArray[i].contact}</div>
            </div>
            <h2 id="barberHaircutsTitle">Haircuts</h2>
            <div class="barberHairCutsImgs" id="barberHairCutsImgsContainer">
            </div>
          </div>`);
                let hairCutsContainer = document.getElementById("barberHairCutsImgsContainer");
                for (let j = 0; j < barbersArray[i].barberCuts.length; j++) {
                    hairCutsContainer.insertAdjacentHTML("beforeend", `<img class="barberCuts" z-index src='${barbersArray[i].barberCuts[j]}' alt='barber haircut image'/>`);
                }
            });
        }
    }
    parseJson();
})();
export {};
//# sourceMappingURL=barber.js.map