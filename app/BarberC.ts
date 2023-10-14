import { log } from "console";

class Barber {
    private id: number = 0;
    private name: string = "";
    private img: string = "";
    private bio: string = "";
    private scheduleAppointment: string = "";
    private contact: string = "";
    private socialMedia: {
        socialMediaLinks: string[],
        socialMediaButtonImg: string[]
    } = {
            socialMediaLinks: [],
            socialMediaButtonImg: []
        }
    private barberCuts: string[] = [];
    constructor(id: number, name: string, img: string, bio: string, scheduleAppointment: string, contact: string, socialMedia: { socialMediaLinks: string[], socialMediaButtonImg: [] }, barberCuts: string[]) {
        this.id = id;
        this.name = name;
        this.img = img;
        this.bio = bio;
        this.scheduleAppointment = scheduleAppointment;
        this.contact = contact;
        this.socialMedia = socialMedia;
        this.barberCuts = barberCuts;
    }
}



interface barberI {
    id: number,
    name: string,
    img: string,
    bio: string,
    scheduleAppointment: string,
    contact: string,
    socialMediaLinks: string[],
    buttonImg: string[],
    barberCuts: string[]
}

interface socialMediaLinksI {
    img: string,
    socialMediaLink: string
}


let currentBarber: barberI;
const form_profile_img_update = document.getElementById("form_profileImg") as HTMLFormElement;
const updateBarberImg = document.getElementById("barberIMG_upload") as HTMLInputElement;

const barberImg = document.getElementById("barberIMG") as HTMLImageElement;
const barberName = document.getElementById("barberName");
const barberBio = document.getElementById("barberBio");
const scheduleAppointment = document.getElementById("scheduleAppointment");
const barberContact = document.getElementById("contact");
const socialMediaContainer = document.getElementById("socialMediaLinksContainer");
const barberCutsContainer = document.getElementById("barberCutsContainer");

const updateName = document.getElementById("updateName") as HTMLInputElement;
const updateBio = document.getElementById("updateBio") as HTMLInputElement;
const updateAppointment = document.getElementById("updateAppointment") as HTMLInputElement;
const updateContact = document.getElementById("updateContact") as HTMLInputElement;


let socialMediaLinks: socialMediaLinksI[] = [];
const currnetAddedLinks = document.getElementById("currentAddedLinks");
const updatedSocialMediaLink = document.getElementById("socialMediaLink") as HTMLInputElement;
const addSocialMediaLink = document.getElementById("addSocialMediaLink");
const clearSocialMediaLinks = document.getElementById("removeSocialMediaLinks");

let selectedSocialMediaLink: string = null;
let selectedSocialmediaIcon: string = null;
const facebookBtn = document.getElementById("facebook") as HTMLButtonElement;
const twitterBtn = document.getElementById("twitter") as HTMLButtonElement;
const linkedInBtn = document.getElementById("linkedin") as HTMLButtonElement;
const instagramBtn = document.getElementById("instagram") as HTMLButtonElement;

const settingsButton = document.getElementById("settings-button");
const closeSettingsButton = document.getElementById("closeSettings");
let settingsMenuShow = false;

settingsButton.addEventListener("click", () => {
    if (settingsMenuShow) {
        document.getElementById("update-profile-img-container").style.display = "none";
        document.getElementById("update-profile-img-container").style.animation = "1s ease-in-out 0s 1 normal none running disappear"
        settingsMenuShow = false;
    } else {
        document.getElementById("update-profile-img-container").style.display = "flex";
        document.getElementById("update-profile-img-container").style.animation = "1s ease-in-out 0s 1 normal none running appear"
        settingsMenuShow = true;
    }
});

closeSettingsButton.addEventListener("click", () => {
    document.getElementById("update-profile-img-container").style.display = 'none';
})

facebookBtn.onclick = function () {
    selectedSocialMediaLink = facebookBtn.value;
    updatedSocialMediaLink.value = selectedSocialMediaLink;
    selectedSocialmediaIcon = "../images/icons/facebook-color-svgrepo-com.svg"
}

twitterBtn.onclick = function () {
    selectedSocialMediaLink = twitterBtn.value;
    updatedSocialMediaLink.value = selectedSocialMediaLink;
    selectedSocialmediaIcon = "../images/icons/twitter-svgrepo-com.svg"
}

linkedInBtn.onclick = function () {
    selectedSocialMediaLink = linkedInBtn.value;
    updatedSocialMediaLink.value = selectedSocialMediaLink;
    selectedSocialmediaIcon = "../images/icons/linkedin-svgrepo-com.svg"
}

instagramBtn.onclick = function () {
    selectedSocialMediaLink = instagramBtn.value;
    updatedSocialMediaLink.value = selectedSocialMediaLink;
    selectedSocialmediaIcon = "../images/icons/instagram-svgrepo-com.svg"
}


addSocialMediaLink.addEventListener("click", () => {
    if (!selectedSocialMediaLink) { alert("Select a link"); return; }

    socialMediaLinks.push(
        {
            img: selectedSocialmediaIcon,
            socialMediaLink: updatedSocialMediaLink.value
        }
    );
    currnetAddedLinks.insertAdjacentHTML("beforeend", `<div>${updatedSocialMediaLink.value}</div>`);
    updatedSocialMediaLink.value = "";
});

clearSocialMediaLinks.addEventListener("click", () => {
    currnetAddedLinks.innerHTML = "";
    socialMediaLinks = [];
});

let logout = document.getElementById("logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "http://localhost:8080";
});

async function getBarbers() {
    const existingData = localStorage.getItem('user');

    // Parse the string back to a JSON object
    const account = JSON.parse(existingData);
    console.log(account);

    if (!account) {
        alert("Access Denied");
        window.location.href = "http://localhost:8080";
    }

    if (account.loggedIN) {
        console.log("fetching barbers")
        let barbers = await (await fetch("http://localhost:8080/barbers.json")).json();

        for (let barber of barbers) {

            if (barber.id == account.id) {
                return barber;
            }
        }
    }
    alert("Access Denied");
    window.location.href = "http://localhost:8080";
}

getBarbers().then(e => {
    currentBarber = e;
    console.log("self:", currentBarber);
    if (currentBarber.img) {
        barberImg.src = currentBarber.img;
    }
    barberBio.innerHTML += currentBarber.bio;
    barberContact.innerHTML += currentBarber.contact;
    barberName.innerHTML += currentBarber.name;
    scheduleAppointment.innerHTML += currentBarber.scheduleAppointment;

    for (let i = 0; i < currentBarber.socialMediaLinks.length; i++) {
        socialMediaContainer.insertAdjacentHTML("beforeend", `<a href="${currentBarber.socialMediaLinks[i]}"><img src="${currentBarber.buttonImg[i]}" alt="Link"/></a>`);

        //Items in update form
        currnetAddedLinks.insertAdjacentHTML("beforeend", `<div>${currentBarber.socialMediaLinks[i]}</div>`);
        socialMediaLinks.push(
            {
                img: currentBarber.buttonImg[i],
                socialMediaLink: currentBarber.socialMediaLinks[i]
            }
        );
    }

    console.log("cuts:", currentBarber.barberCuts);

    for (let i = 0; i < currentBarber.barberCuts.length; i++) {
        barberCutsContainer.insertAdjacentHTML("beforeend", `<img src="${currentBarber.barberCuts[i]}" alt="Barber Cuts"/>`);
    }

    updateName.value = currentBarber.name;
    updateBio.value = currentBarber.bio;
    updateContact.value = currentBarber.contact;
    updateAppointment.value = currentBarber.scheduleAppointment;



    form_profile_img_update.addEventListener("submit", async (e) => {
        e.preventDefault();
        let form = new FormData(form_profile_img_update);
        form.append("id", currentBarber.id + "");


        let response = await fetch("/updateProfileImg", {
            method: "POST",
            body: form
        });

        if (response.ok) {
            alert("Upload successful");
            window.location.reload();
            form_profile_img_update.reset();
        } else {
            alert("Failed to save image");
            form_profile_img_update.reset();
        }
    })
});



let edit_profile = document.getElementById("edit_profile");
const modal = document.getElementById("barberAccountModal");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0] as HTMLElement;

const modalContent = document.getElementById("modal-barberAccount-content");

span.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

edit_profile.addEventListener("click", () => {
    modal.style.display = "block";
});

let form = document.getElementById("barberUpdate") as HTMLFormElement;


form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    console.log(`Form:
    ${formData.get("name")}, ${formData.get("bio")}, ${formData.get("scheduleAppointment")}
    , ${formData.get("preferredContact")}
    , ${formData.getAll("socialMediaBTN")}
    , ${socialMediaLinks}
    `);
    console.log(currentBarber.id);


    let data;

    data = {
        id: currentBarber.id,
        name: formData.get("name"),
        bio: formData.get("bio"),
        scheduleAppointment: formData.get("scheduleAppointment"),
        preferredContact: formData.get("preferredContact"),
        socialMediaBTN: formData.get("socialMediaBTN"),
        socialMediaLinks: socialMediaLinks,
        img: ""
    }



    fetch("http://localhost:8080/updateInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
});
