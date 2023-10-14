export class Review {
    date = "";
    imageSrc = "../images/icons/star-svgrepo-com.svg";
    rating = 0;
    description = "";
    testimony;
    id;
    updatesMade = [];
    maxReviewRating = 5;
    name;
    tags;
    reviewButton;
    constructor(rating, description, name, tags, _date, id) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}/${month}/${day}`;
        console.log(formattedDate);
        this.name = name;
        this.tags = tags;
        this.date = _date || formattedDate;
        this.rating = rating;
        this.description = description;
        this.id = id || Date.now();
        this.updatesMade.push({ date: new Date().toISOString(), testimony: description, rating: rating, name: name, tags: tags });
    }
    get Date() {
        return this.date;
    }
    get ImageSrc() {
        return this.ImageSrc;
    }
    get Description() {
        return this.description;
    }
    get ID() {
        return this.id;
    }
    get UpdatesMade() {
        return this.updatesMade;
    }
    set updateImage(src) {
        this.imageSrc = src;
    }
    set updateDescription(description) {
        this.description = description;
    }
    set updateDate(date) {
        this.date = date;
    }
    set Rating(rating) {
        this.rating = rating;
    }
}
class ReviewsView {
    reviewsArr = [];
    renderingContainer;
    reviewButton;
    reviewForm = document.getElementById('reviewForm');
    updateFormCallback;
    modal = document.getElementById("reviewModal");
    btn = document.getElementById("myBtn");
    span = document.getElementsByClassName("close")[0];
    constructor(container) {
        this.renderingContainer = container;
        this.reviewButton = document.getElementById('reviews-main-content-writeAReview-button');
        this.reviewButton.addEventListener('click', () => {
            console.log('review');
            this.modal.style.display = "block";
        });
        this.span.addEventListener('click', () => {
            this.modal.style.display = "none";
        });
        window.addEventListener('click', event => {
            if (event.target == this.modal) {
                this.modal.style.display = "none";
            }
        });
        this.reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let form = new FormData(this.reviewForm);
            this.updateFormCallback(form);
            this.reviewForm.reset();
        });
    }
    start(updateFormCallback) {
        this.drawReviews();
        this.updateFormCallback = updateFormCallback;
    }
    drawReviews() {
        this.reviewsArr.sort((a, b) => { return a.rating - b.rating; });
        for (let i = 0; i < this.reviewsArr.length; i++) {
            let review = this.reviewsArr[i];
            if (review.rating < 3) {
                continue;
            }
            this.renderingContainer.insertAdjacentHTML('afterbegin', `<div class="reviewCard" id="card${review.ID}"> <div class="reviewDate">${review.date}</div> <div class="reviewRatingContainer" id="rating${review.ID}"></div> <div class="reviewName">${review.name}</div> <div class="reviewDescription" id="description${review.ID}">${review.Description}</div> </div>`);
            let container = document.getElementById(`rating${review.ID}`);
            for (let i = 0; i < review.maxReviewRating; i++) {
                if (i < review.rating) {
                    container.insertAdjacentHTML('beforeend', `<img id="${review.ID}${i}" class="reviewRating" src="../images/icons/star-svgrepo-com.svg" alt="Rating: ${review.rating}" />`);
                }
                else {
                    container.insertAdjacentHTML('beforeend', `<img id="${review.ID}${i}" class="reviewRatingNotChosen" src="../images/icons/star-svgrepo-com.svg" alt="Rating: ${review.rating}" />`);
                }
            }
        }
    }
    deleteReview(id) {
        for (let i = 0; i < this.reviewsArr.length; i++) {
            if (this.reviewsArr[i].ID == id) {
                console.log('Deleted: ' + this.reviewsArr.splice(i, 1));
            }
        }
    }
    updateReview(id, update) {
        for (let i = 0; i < this.reviewsArr.length; i++) {
            if (this.reviewsArr[i].ID == id) {
                if (update.testimony) {
                    this.reviewsArr[i].Description = update.testimony;
                }
                if (update.rating) {
                    this.reviewsArr[i].Rating = update.rating;
                }
                let currentUpdate = {
                    date: new Date().toISOString(),
                    testimony: this.reviewsArr[i].Description,
                    rating: this.reviewsArr[i].Rating,
                    name: this.reviewsArr[i].name,
                    tags: this.reviewsArr[i].tags
                };
                this.reviewsArr[i].UpdatesMade.push(currentUpdate);
            }
        }
    }
}
class ReviewsController {
    reviewsArr = [];
    view = null;
    constructor(view) {
        this.view = view;
        this.populateViewReviewsArray();
    }
    async populateViewReviewsArray() {
        let reviews = await (await fetch('../reviews.json')).json();
        reviews.forEach(review => {
            this.reviewsArr.push(new Review(review.rating, review.testimony, review.name, review.tags, review.date, review.id));
        });
        this.setViewReviews();
        this.view.start(this.updateForm);
    }
    setViewReviews() {
        this.view.reviewsArr = this.reviewsArr;
    }
    async updateForm(form) {
        let rating, description, tags, name;
        console.log('form', form);
        rating = Number.parseInt(form.get('rating'));
        description = `“${form.get("description")}”`;
        tags = form.getAll("tag");
        name = form.get("name");
        console.log(`Rating: ${rating}`);
        console.log(`Description: ${description}`);
        console.log(`Tags: ${tags}`);
        console.log(`Name: ${name}`);
        const response = await fetch("http://localhost:8080/review-form", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                rating: rating,
                description: description,
                tags: tags,
                name: name
            })
        });
        if (response.ok) {
            console.log('Form submitted successfully.');
            alert('Form submitted.');
            location.reload();
        }
        else {
            console.log('Failed to submit form.');
            alert("Form submission unsuccessful. Server unable to save to database. Please try again later.");
        }
    }
}
const reviewView = new ReviewsView(document.getElementById('reviews-main-content-list-of-reviews'));
const reviewController = new ReviewsController(reviewView);
//# sourceMappingURL=Reviews.js.map