import { timeStamp } from "console";
import { create } from "domain";
import { EventSection } from "./EventSection.js";

interface viewToControllerI {
    setViewEvents(): void;
}

class IndexController {
    view: IndexView;
    eventsArr: EventSection[] = [];
    reviewsArr: any[] = [];

    constructor(view: IndexView) {
        this.view = view;
        this.populateViewEventsPanel();
    }

    async populateViewEventsPanel() {
        console.log("Getting events")
        let events = await (await fetch('../events.json')).json();

        events.forEach(event => {
            this.eventsArr.push(new EventSection(event.title, event.imageSrc, event.description));
        });

        console.log("Getting reviews");
        this.reviewsArr = await ((await fetch("../reviews.json")).json());

        this.setViewReviews()
        this.setViewEvents();

        this.view.start(0);
    }

    setViewReviews() {
        this.view.ViewReviewArr = this.reviewsArr;
    }

    setViewEvents() {
        this.view.ViewEventsArr = this.eventsArr;
    }
}

class IndexView {
    private slideShowPos = 0;
    private slideShowBtnPrevious = document.getElementById('index-main-content-events-listing-inner-prev');
    private slideShowBtnNext = document.getElementById('index-main-content-events-listing-inner-next');

    private emailForm = document.getElementById("email-form") as HTMLFormElement;
    private emailHeader = document.getElementById("email-header") as HTMLInputElement;
    private emailBody = document.getElementById("email-body") as HTMLInputElement;
    private emailClientEmail = document.getElementById('email-client-email') as HTMLInputElement;

    private geesHistorySection = document.getElementById("index-main-about-gees-clippers-section");
    private geesHistoryP2 = document.getElementById("index-main-about-gees-clippers-history-p2");
    private geesHistoryP1 = document.getElementById("index-main-about-gees-clippers-history-p1");
    private geesHistoryExpanded = false;
    private geesHistoryContainer = document.getElementById("index-main-about-gees-clippers-history-of-gees-clippers");
    private expansionBtn = document.getElementById("seeMoreBtn");

    private viewEventsArr: EventSection[] = [];
    private viewReviewArr: any[] = [];
    tickerItems: string[] = [
        // "Game 1: Team A vs. Team B - Final Score: 4-2",
        // "Player of the Match: John Doe",
        // "Upcoming Event: Sports Gala on Saturday"
    ]
    // Add more ticker items as needed];
    tickerContainer = document.querySelector('.ticker');

    updateEventsCallback: viewToControllerI;

    constructor() {
        //code for initial page load 

        if (window.innerWidth <= 700) {

            document.documentElement.style
                .setProperty('--my-start-height', this.geesHistoryP1.offsetHeight + "px");

            document.documentElement.style
                .setProperty('--my-end-height', this.geesHistoryP1.offsetHeight + "px");

            this.geesHistoryP2.style.display = "none";

            this.expansionBtn.style.display = "flex";
            this.geesHistoryContainer.style.height = this.geesHistoryP1.offsetHeight + "px";

            document.documentElement.style
                .setProperty('--my-start-height', this.geesHistoryP1.offsetHeight + "px");

            this.geesHistoryContainer.style.animation = '';

        } else {
            document.getElementById("seeMoreBtn").style.display = "none";
            this.geesHistoryP2.style.display = "block";
            this.geesHistoryContainer.style.height = 'max-content';
        }

        window.addEventListener('resize', () => {
            this.geesHistoryP2.style.display = "flex";

            document.documentElement.style
                .setProperty('--my-start-height', this.geesHistoryP1.offsetHeight + "px");

            document.documentElement.style
                .setProperty('--my-end-height', this.geesHistoryP1.offsetHeight + "px");

            if (window.innerWidth <= 700) {
                this.geesHistoryP2.style.display = "none";

                this.expansionBtn.style.display = "flex";
                this.geesHistoryContainer.style.height = this.geesHistoryP1.offsetHeight + "px";

                document.documentElement.style
                    .setProperty('--my-start-height', this.geesHistoryP1.offsetHeight + "px");

                this.geesHistoryContainer.style.animation = '';

            } else {
                document.getElementById("seeMoreBtn").style.display = "none";
                this.geesHistoryP2.style.display = "block";
                this.geesHistoryContainer.style.height = 'max-content';
            }
        })

        this.expansionBtn.addEventListener("click", () => {
            if (!this.geesHistoryExpanded) {
                this.geesHistoryP2.style.display = "block";

                //sets the animation scroll height endpoint
                document.documentElement.style
                    .setProperty('--my-end-height', this.geesHistoryP1.offsetHeight + this.geesHistoryP2.offsetHeight + "px");

                console.log(getComputedStyle(document.documentElement)
                    .getPropertyValue('--my-end-height'));

                this.geesHistoryContainer.style.height = "max-content";
                this.geesHistoryContainer.style.animation = "expandHistorySection 3s ease-in-out";

                this.geesHistoryExpanded = true;
                this.expansionBtn.innerHTML = "<div>See Less</div> <div style='transform:scale(1,-1)'><span class='downArrow'>V</span></div>";
            } else {
                this.geesHistoryContainer.style.height = this.geesHistoryP1.offsetHeight + "px";
                this.geesHistoryContainer.style.animation = "contractHistorySection 3s ease-in-out";
                setTimeout(() => { this.geesHistoryP2.style.display = "none"; }, 3000)
                this.geesHistoryExpanded = false;
                this.expansionBtn.innerHTML = "See More <span class='downArrow' >V</span>";
            }
        });

        

        this.emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log(`email Subject:${this.emailHeader.value}, email: ${this.emailClientEmail.value}, body:${this.emailBody.value}`);

            fetch("http://localhost:8080/event-email", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    header: this.emailHeader.value,
                    email: this.emailClientEmail.value,
                    body: this.emailBody.value
                })
            });

            this.emailForm.reset();
        })

    }

    set ViewEventsArr(arr: EventSection[]) {
        this.viewEventsArr = arr;
    }

    set ViewReviewArr(arr: any[]) {
        this.viewReviewArr = arr;
        this.updateTicker();
    }

    updateTicker() {
        for (let i = 0; i < this.viewReviewArr.length; i++) {
            let review = this.viewReviewArr[i];

            // console.log("review", review);
            if (!review.tags.find((tag) => tag === "event") || review.rating < 4) {
                continue;
            }
            this.tickerItems.push(`${review.name}: ${review.testimony}`);
        }

    }

    async updateEvents(callback: viewToControllerI) {
        this.updateEventsCallback = callback;
        callback.setViewEvents();
    }

    start(pos: number) {

        let eventLoop = setInterval(() => {

            if (this.viewEventsArr.length == 0) {
                return
            }

            if (this.slideShowPos >= this.viewEventsArr.length - 1) {
                this.slideShowPos = 0;
            } else { this.slideShowPos += 1 }

            this.showActiveEvent(this.slideShowPos);
        }, 5000);


        this.slideShowBtnPrevious.addEventListener('click', () => {
            if (this.viewEventsArr.length == 0) {
                return
            }

            clearInterval(eventLoop);
            if (this.slideShowPos <= 0) {
                this.slideShowPos = this.viewEventsArr.length - 1;
            } else { this.slideShowPos -= 1 }

            this.showActiveEvent(this.slideShowPos);
        });

        this.slideShowBtnNext.addEventListener('click', () => {
            if (this.viewEventsArr.length == 0) {
                return
            }

            clearInterval(eventLoop);
            if (this.slideShowPos >= this.viewEventsArr.length - 1) {
                this.slideShowPos = 0;
            } else { this.slideShowPos += 1 }

            this.showActiveEvent(this.slideShowPos);
        });




        // Populate ticker with items from the array
        this.tickerItems.forEach(item => {
            const tickerItem = document.createElement('li');
            tickerItem.textContent = item;
            this.tickerContainer.appendChild(tickerItem);
        });

    }

    showActiveEvent(slideShowNumber: number) {

        let title = document.getElementById('index-main-content-events-listing-title');
        let image = document.getElementById('index-main-content-events-listing-image') as HTMLImageElement;
        let description = document.getElementById('index-main-content-events-listing-description');


        title.textContent = this.viewEventsArr.at(slideShowNumber)?.title;
        description.textContent = this.viewEventsArr.at(slideShowNumber).description;
        image.src = this.viewEventsArr.at(slideShowNumber).imgSrc;
    }
}


const indexView = new IndexView();
const indexController = new IndexController(indexView);



