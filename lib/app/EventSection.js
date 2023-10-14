export class EventSection {
    title;
    image = new Image(400, 400);
    imgSrc;
    description;
    id;
    constructor(title, imageSrc, description) {
        this.title = title;
        this.image.src = imageSrc;
        this.imgSrc = imageSrc;
        this.description = description;
        this.id = Date.now();
    }
    set setImgSrc(src) {
        this.imgSrc = src;
    }
    drawEvent() {
        let title = document.getElementById('index-main-content-events-listing-title');
        let img = document.getElementById('index-main-content-events-listing-image');
        let description = document.getElementById('index-main-content-events-listing-description');
        title.innerText = this.title;
        img = this.image;
        description.innerText = this.description;
    }
}
//# sourceMappingURL=EventSection.js.map