import { parse } from "path";
(() => {
  // Get the modal
  const modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0] as HTMLElement;

  const modalContent = document.getElementById("modal-content");

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  async function parseJson() {
    console.log("anything");

    let barbersArray = await (await fetch("../barbers.json")).json();

    let barbersArrayContainer = document.getElementById(
      "barbers-main-content-inner-container"
    );

    for (let i = 0; i < barbersArray.length; i++) {
      barbersArrayContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="barbersCardElement" id='card${i}'>
      <img class ="cardElementImg" src= "${barbersArray[i].img}">
      <div class="cardElementName">${barbersArray[i].name}</div>
      <div class="cardElementBio">${barbersArray[i].bio}</div>
      <div class="cardElementScheduleAppointment">${barbersArray[i].scheduleAppointment}</div>
      <div class="cardElementContactInfo" id="${i}">${barbersArray[i].contact}</div>
      <div class="socialMediaBtnContainer" id="socialMediaBtnContainer${i}"></div>
      </div>`
      );

      let socialMediaBtnContainer = document.getElementById(
        "socialMediaBtnContainer" + i
      );

      for (let j = 0; j < barbersArray[i].socialMediaLinks.length; j++) {
        // `<div>${barbersArray[i].socialMediaLinks[j]}</div>`
        socialMediaBtnContainer.insertAdjacentHTML(
          "beforeend",
          `<div class="socialMediaButton"> <a href="${barbersArray[i].socialMediaLinks[j]}"><img class="buttonImg" src="${barbersArray[i].buttonImg[j]}"/></a></div>`
        );
      }

      //write code for when user clicks on a card
      let card = document.getElementById("card" + i);

      //logic of card click
      card.addEventListener("click", (e) => {
        const clickedElement = e.target as Node;
        if (socialMediaBtnContainer.contains(clickedElement)) {
          return;
        }

        modalContent.innerHTML = "";
        //create a modal dialog
        // When the user clicks on the button, open the modal
        modal.style.display = "block";
        //add data for that barber in the modal
        modalContent.insertAdjacentHTML(
          "beforeend",
          `<div class="barbersInfoExpanded" id='cardA${i}'>
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
          </div>`
        );

        let hairCutsContainer = document.getElementById("barberHairCutsImgsContainer");

        for (let j = 0; j < barbersArray[i].barberCuts.length; j++) {
          hairCutsContainer.insertAdjacentHTML(
            "beforeend",
            `<img class="barberCuts" z-index src='${barbersArray[i].barberCuts[j]}' alt='barber haircut image'/>`
          );
        }
      });
    }
  }
  parseJson();
})();
// pull barber info from database
// loop thru barber info array
// create div container with img of barber 5 smallers div containers describing
//  barbers name, bio, apt scheduling, contact info, and social media links
// two imgs that will act as reference links next to 5th div
