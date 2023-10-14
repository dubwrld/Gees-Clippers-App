(async () => {
    const events = [];
    let form = document.getElementById('new-event-form');
    let imgInput = document.getElementById('imageUpload');
    let descriptionInput = document.getElementById('index-create-events-listing-description');
    let titleInput = document.getElementById('index-create-events-listing-title');
    let accountCreationForm = document.getElementById("account-creation-form");
    let logout = document.getElementById("logout");
    logout.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "http://localhost:8080";
    });
    accountCreationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(accountCreationForm);
        let name, username, password, accountType;
        name = formData.get("name");
        username = formData.get("username");
        password = formData.get("password");
        accountType = formData.get("accountType");
        console.log(`name: ${name} username:${username} password:${password} accountType:${accountType}`);
        accountCreationForm.reset();
        try {
            const response = await fetch("/account-creation", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    username: username,
                    password: password,
                    accountType: accountType
                })
            });
            if (response.ok) {
                console.log("Account Created");
                alert("Account Created.");
            }
            else {
                console.log("Failed to create account.");
            }
        }
        catch (error) {
            console.log(error);
            alert("Error saving account.");
        }
    });
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        form.reset();
        try {
            const response = await fetch('/upload-event', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                console.log("Image uploaded successfully");
                alert("Event Created.");
            }
        }
        catch (error) {
            console.log(error);
        }
    });
})();
const displayReviewsBtn = document.getElementById("displayReviewsButton");
let reviewsDisplayed = false;
const reviewsDisplayContainer = document.getElementById("reviews_display_container");
displayReviewsBtn.addEventListener("click", () => {
    if (reviewsDisplayed) {
        displayReviewsBtn.innerText = "Show Reviews";
        reviewsDisplayContainer.style.display = "none";
        reviewsDisplayed = false;
    }
    else {
        displayReviewsBtn.innerText = "Hide Reviews";
        reviewsDisplayContainer.style.display = "block";
        reviewsDisplayed = true;
    }
});
async function displayReviews() {
    const slider_value_display = document.getElementById("slider_value");
    const slider = document.getElementById("reviews_filter");
    let slider_value = Number.parseInt(slider.value);
    let reviewsContainer = document.getElementById("reviewsDisplay");
    let avgReview = document.getElementById("avgReviewRating");
    let avgRating = 0;
    let reviews;
    slider_value_display.innerHTML = slider.value;
    slider.oninput = function () {
        if (slider.value == "6") {
            slider_value_display.innerHTML = "All";
        }
        else {
            slider_value_display.innerHTML = slider.value;
        }
        slider_value = Number.parseInt(slider.value);
        reviewsContainer.innerHTML = "";
        drawReviews(reviews);
    };
    async function getReviews() {
        reviews = await ((await fetch("../reviews.json")).json());
        drawReviews(reviews);
        getAvgReviewRating(reviews);
    }
    getReviews();
    function getAvgReviewRating(reviewsArr) {
        reviewsArr.forEach((review) => {
            avgRating += review.rating;
        });
        let rating = Math.round(avgRating / reviewsArr.length * 10) / 10;
        avgReview.innerHTML = `Average rating: ${rating} <img id="rating_star" src="../images/icons/star-svgrepo-com.svg"/>`;
        let star = document.getElementById("rating_star");
        if (rating <= 2) {
            star.style.filter = "invert(1) brightness(42%) sepia(100%) saturate(405%) hue-rotate(300deg)";
        }
        else if (rating >= 4) {
            star.style.filter = "invert(1) brightness(52%) sepia(100%) saturate(405%) hue-rotate(440deg)";
        }
        else {
            star.style.filter = "invert(1) brightness(80%) sepia(100%) saturate(365%);";
        }
    }
    function drawReviews(reviewsArr) {
        reviewsContainer.innerHTML = " ";
        reviewsArr.sort((a, b) => { return a.rating - b.rating; });
        for (let i = 0; i < reviewsArr.length; i++) {
            let review = reviewsArr[i];
            if (review.rating > slider_value) {
                continue;
            }
            reviewsContainer.insertAdjacentHTML('afterbegin', `
            <div class="flex-menu"> 
            <div class="reviewCard" id="card${review.id}">
             <div class="flex-edit-menu">
              <div class="editIconContainer" id="${review.id}"> <img id="editIcon${review.id}" class="editIcon" src="../images/icons/edit-3-svgrepo-com.svg" alt="Edit Icon"/> </div>
              <div class="reviewDate item-b">Date: ${review.date}</div> 
             </div>
             <div class="reviewRatingContainer" id="rating${review.id}">Rating: ${review.rating} </div>
             <div class="reviewName">Name: ${review.name}</div>
             <div class="reviewDescription" id="description${review.id}">Description: ${review.testimony}</div> 
            </div>
            <div id="menu${review.id}" class="menu"> <div id="close${review.id}" class="closeMenuBtn"><img src="../images/icons/close-circle-svgrepo-com.svg"  alt="Close button"/></div> <button id="delete${review.id}" class="btn-delete">Delete</button> </div>
            </div>`);
            let deleteReview = document.getElementById(`delete${review.id}`);
            deleteReview.addEventListener("click", async () => {
                try {
                    const response = await fetch('/delete-review', {
                        method: 'DELETE',
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify({
                            id: review.id
                        })
                    });
                    console.log("Deleting review:", review.id);
                    if (response.ok) {
                        console.log("Review Deleted", review.id);
                        window.location.reload();
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
            const editIcon = document.getElementById(`editIcon${review.id}`);
            const menu = document.getElementById(`menu${review.id}`);
            const closeIcon = document.getElementById(`close${review.id}`);
            editIcon.addEventListener("click", () => {
                menu.style.display = "block";
            });
            closeIcon.addEventListener("click", () => {
                menu.style.display = "none";
            });
            let container = document.getElementById(`rating${review.id}`);
            for (let i = 0; i < 5; i++) {
                if (i < review.rating) {
                    container.insertAdjacentHTML('beforeend', `<img id="${review.id}${i}" class="reviewRating" src="../images/icons/star-svgrepo-com.svg" alt="Rating: ${review.rating}" />`);
                    if (review.rating <= 2) {
                        document.getElementById(`${review.id}${i}`).style.filter = "invert(1) brightness(42%) sepia(100%) saturate(405%) hue-rotate(300deg)";
                    }
                    else if (review.rating >= 4) {
                        document.getElementById(`${review.id}${i}`).style.filter = "invert(1) brightness(52%) sepia(100%) saturate(405%) hue-rotate(440deg)";
                    }
                }
                else {
                    container.insertAdjacentHTML('beforeend', `<img id="${review.id}${i}" class="reviewRatingNotChosen" src="../images/icons/star-svgrepo-com.svg" alt="Rating: ${review.rating}" />`);
                }
            }
        }
    }
}
;
function displayEvents() {
    let events;
    const eventsContainer = document.getElementById("eventsDisplay");
    const eventsDisplayContainer = document.getElementById("events_display_container");
    let eventsDisplayed = false;
    const eventsDisplayBtn = document.getElementById("displayEventsButton");
    eventsDisplayBtn.addEventListener("click", () => {
        if (eventsDisplayed) {
            eventsDisplayBtn.innerText = "Show Events";
            eventsDisplayed = false;
            eventsDisplayContainer.style.display = "none";
        }
        else {
            eventsDisplayBtn.innerText = "Hide Events";
            eventsDisplayed = true;
            eventsDisplayContainer.style.display = "block";
        }
    });
    async function getEvents() {
        events = await ((await fetch("../events.json")).json());
        drawEvents(events);
    }
    getEvents();
    function drawEvents(events) {
        eventsContainer.innerHTML = " ";
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            eventsContainer.insertAdjacentHTML("beforeend", `
             <div class="flex-menu"> 
              <div id="card${event.id}" class="event-card">
               <div class="flex-edit-menu">
                <div class="editIconContainer" id="${event.id}"> <img id="editIcon${event.id}" class="editIcon" src="../images/icons/edit-3-svgrepo-com.svg" alt="Edit Icon"/> </div>
                <div id="title${event.id}" class="item-b">${event.title}</div>
               </div>
               <img id="img${event.id}" class="eventImg" src="${event.imageSrc}" alt="Event Image"/>
               <div id="description${event.id}">${event.description}</div>
              </div>
              <div id="menu${event.id}" class="menu"> <div id="close${event.id}" class="closeMenuBtn"><img src="../images/icons/close-circle-svgrepo-com.svg"  alt="Close button"/> </div> <button id="delete${event.id}" class="btn-delete">Delete</button>  <button id="edit${event.id}" class="btn">Edit</button> </div>
             </div>
            `);
            const editIcon = document.getElementById(`editIcon${event.id}`);
            const menu = document.getElementById(`menu${event.id}`);
            const closeIcon = document.getElementById(`close${event.id}`);
            editIcon.addEventListener("click", () => {
                menu.style.display = "flex";
            });
            closeIcon.addEventListener("click", () => {
                menu.style.display = "none";
            });
            const deleteBtn = document.getElementById(`delete${event.id}`);
            deleteBtn.addEventListener("click", async () => {
                try {
                    const response = await fetch('/delete-event', {
                        method: 'DELETE',
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify({
                            id: event.id
                        })
                    });
                    console.log("Deleting event:", event.id);
                    if (response.ok) {
                        console.log("Event Deleted", event.id);
                        window.location.reload();
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
            const editBtn = document.getElementById(`edit${event.id}`);
            editBtn.addEventListener("click", () => {
                alert('Not implemented.');
            });
        }
    }
}
function displayAccounts() {
    let accounts;
    let barbers;
    const accountsContainer = document.getElementById("accountsDisplay");
    const accountsDisplayContainer = document.getElementById("accounts_display_container");
    let accountsDisplayed = false;
    const accountsDisplayBtn = document.getElementById("displayAccountsButton");
    accountsDisplayContainer.style.display = "none";
    accountsDisplayBtn.addEventListener("click", () => {
        if (accountsDisplayed) {
            accountsDisplayBtn.innerText = "Show Accounts";
            accountsDisplayed = false;
            accountsDisplayContainer.style.display = "none";
        }
        else {
            accountsDisplayBtn.innerText = "Hide Accounts";
            accountsDisplayed = true;
            accountsDisplayContainer.style.display = "block";
        }
    });
    async function getAccounts() {
        accounts = await ((await fetch("../accounts.json")).json());
        barbers = await ((await fetch("../barbers.json")).json());
        drawAccounts(accounts, barbers);
    }
    getAccounts();
    function drawAccounts(accounts, barbers) {
        for (let i = 0; i < accounts.length; i++) {
            let account = accounts[i];
            accountsContainer.insertAdjacentHTML("beforeend", `
        <div class="flex-menu">
              <div id="card${account.id}" class="event-card">
               <div class="flex-edit-menu">
                <div class="editIconContainer" id="${account.id}"> <img id="editIconAccount${account.id}" class="editIcon" src="../images/icons/edit-3-svgrepo-com.svg" alt="Edit Icon"/> </div>
                <div id="title${account.id}" class="item-b">Username: ${account.login}</div>
               </div>
               <div>Account-Type: ${account.accountType}</div>
              </div>
              <div id="menuAccount${account.id}" class="menu"> <div id="closeAccount${account.id}" class="closeMenuBtn"><img src="../images/icons/close-circle-svgrepo-com.svg"  alt="Close button"/> </div> <button id="delete${account.id}" class="btn-delete">Delete</button> </div>
             </div>
        `);
            if (account.accountType == "barber") {
                let container = document.getElementById(`card${account.id}`);
                let barber = barbers.find((barber) => {
                    return account.id == barber.id;
                });
                container.insertAdjacentHTML("beforeend", `<div>${barber.name}</div>`);
                if (barber.img) {
                    container.insertAdjacentHTML("beforeend", `<img class="eventImg" src="${barber.img}" alt="barber image"/>`);
                }
            }
            const editIcon = document.getElementById(`editIconAccount${account.id}`);
            const menu = document.getElementById(`menuAccount${account.id}`);
            const closeIcon = document.getElementById(`closeAccount${account.id}`);
            editIcon.addEventListener("click", () => {
                menu.style.display = "flex";
            });
            closeIcon.addEventListener("click", () => {
                menu.style.display = "none";
            });
            const deleteBtn = document.getElementById(`delete${account.id}`);
            deleteBtn.addEventListener("click", async () => {
                alert("Deleting accounts can have unintended consequences. This action cannot be reversed.");
                let deleteRequest = prompt(`Type: ${account.login} to delete.`);
                if (account.login != deleteRequest) {
                    alert("Account not deleted.");
                    return;
                }
                const acc = {
                    id: account.id,
                    username: account.login
                };
                try {
                    const response = await fetch('/delete-account', {
                        method: 'DELETE',
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify({
                            id: account.id
                        })
                    });
                    console.log("Deleting account: ", account.id);
                    if (response.ok) {
                        console.log("Account Deleted: ", acc.id);
                        window.location.reload();
                        alert("Account deleted");
                        console.log("Account Deleted: ", acc.id);
                        alert("Account Deleted: " + acc.username);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
        }
    }
}
displayReviews();
displayEvents();
displayAccounts();
export {};
//# sourceMappingURL=adminPanel.js.map