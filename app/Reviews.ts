import { aW } from "@fullcalendar/core/internal-common";

export interface reviewI {
    date: string,
    imageSrc: string,
    description: string,
    testimony: string,
    id: number,
    ID: number,
    UpdatesMade: reviewUpdatesI[]
    rating: number;
    maxReviewRating: number;
    name: string;
    tags: string[];

    set Description(testimony: string);
    set Rating(rating: number);
}

interface reviewUpdatesI {
    date: string;
    testimony: string;
    rating: number;
    tags: string[];
    name: string;
}

export class Review implements reviewI {
    date: string = "";
    imageSrc: string = "../images/icons/star-svgrepo-com.svg";
    rating: number = 0;
    description: string = "";
    testimony: string;
    id: number;
    private updatesMade: reviewUpdatesI[] = [];
    maxReviewRating: number = 5;
    name: string;
    tags: string[];
    reviewButton;

    constructor(rating: number, description: string, name: string, tags: string[], _date?: string, id?: number) {
        // Get the current date
        const currentDate = new Date();

        // Extract year, month, and day components
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        const day = String(currentDate.getDate()).padStart(2, '0');

        // Format the date in yyyy/mm/dd format
        const formattedDate = `${year}/${month}/${day}`;
        console.log(formattedDate)

        this.name = name;
        this.tags = tags;
        this.date = _date || formattedDate;
        this.rating = rating;
        this.description = description;
        this.id = id || Date.now();

        this.updatesMade.push({ date: new Date().toISOString(), testimony: description, rating: rating, name: name, tags: tags });
    }


    get Date(): string {
        return this.date;
    }

    get ImageSrc(): string {
        return this.ImageSrc;
    }

    get Description(): string {
        return this.description;
    }

    get ID(): number {
        return this.id;
    }

    get UpdatesMade() {
        return this.updatesMade;
    }

    set updateImage(src: string) {
        this.imageSrc = src;
    }

    set updateDescription(description: string) {
        this.description = description;
    }

    set updateDate(date: string) {
        this.date = date;
    }

    set Rating(rating: number) {
        this.rating = rating;
    }

}


class ReviewsView {
    reviewsArr: reviewI[] = [];
    renderingContainer: HTMLElement;
    reviewButton: HTMLElement;
    reviewForm: HTMLFormElement = document.getElementById('reviewForm') as HTMLFormElement;
    updateFormCallback;

    // Get the modal
    modal = document.getElementById("reviewModal");
    // Get the button that opens the modal
    btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    span = document.getElementsByClassName("close")[0] as HTMLElement;


    constructor(container: HTMLElement) {
        this.renderingContainer = container;
        this.reviewButton = document.getElementById('reviews-main-content-writeAReview-button');

        // When the user clicks on the button, open the modal
        this.reviewButton.addEventListener('click', () => {
            console.log('review');
            this.modal.style.display = "block"
        });

        // When the user clicks on <span> (x), close the modal
        this.span.addEventListener('click', () => {
            this.modal.style.display = "none";
        });

        // When the user clicks anywhere outside of the modal, close it
        window.addEventListener('click', event => {
            if (event.target == this.modal) {
                this.modal.style.display = "none";
            }
        })

        //send review form to controller
        this.reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let form = new FormData(this.reviewForm);
            this.updateFormCallback(form);
            this.reviewForm.reset();
        })

    }

    start(updateFormCallback) {
        this.drawReviews();
        this.updateFormCallback = updateFormCallback;
    }


    drawReviews() {
        this.reviewsArr.sort((a, b) => { return a.rating - b.rating });

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
                } else {
                    container.insertAdjacentHTML('beforeend', `<img id="${review.ID}${i}" class="reviewRatingNotChosen" src="../images/icons/star-svgrepo-com.svg" alt="Rating: ${review.rating}" />`);
                }
            }
        }
    }

    deleteReview(id: number) {
        for (let i = 0; i < this.reviewsArr.length; i++) {
            if (this.reviewsArr[i].ID == id) {
                console.log('Deleted: ' + this.reviewsArr.splice(i, 1));
                //FIXME - add in method for updating database that a review is deleted
            }
        }
    }

    updateReview(id: number, update: { rating: number, testimony: string }) {
        for (let i = 0; i < this.reviewsArr.length; i++) {
            if (this.reviewsArr[i].ID == id) {
                if (update.testimony) {
                    this.reviewsArr[i].Description = update.testimony;
                }

                if (update.rating) {
                    this.reviewsArr[i].Rating = update.rating;
                }
                //FIXME - add in method for updating database that a review has changed
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
    reviewsArr: reviewI[] = [];
    view: ReviewsView = null;

    constructor(view: ReviewsView) {
        this.view = view
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

    async updateForm(form: FormData) {
        let rating, description, tags, name;
        console.log('form', form);

        rating = Number.parseInt(form.get('rating') as string);
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
        } else {
            console.log('Failed to submit form.');
            alert("Form submission unsuccessful. Server unable to save to database. Please try again later.");
        }
    }

}

const reviewView = new ReviewsView(document.getElementById('reviews-main-content-list-of-reviews'));
const reviewController = new ReviewsController(reviewView);