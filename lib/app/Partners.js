class Partner {
    companyName = null;
    companyImage = null;
    companyDescription = null;
    companyWebsiteLink = null;
    constructor(name, image, description, website) {
        this.companyName = name;
        this.companyImage = image;
        this.companyDescription = description;
        if (!this.companyImage) {
            this.companyImage = "../images/partner-logos/missing-image.png";
        }
        if (website) {
            this.companyWebsiteLink = website;
        }
    }
    get CompanyName() { return this.companyName; }
    get CompanyImage() { return this.companyImage; }
    get CompanyDescription() { return this.companyDescription; }
    get CompanyWebsiteLink() { return this.companyWebsiteLink; }
}
class PartnerView {
    partnerElementsArr = [];
    partnerControllerCallback;
    partnerCurrentImg = document.getElementById('partner-current-img');
    partnerCurrentName = document.getElementById('partner-current-name');
    partnerCurrentDescription = document.getElementById('partner-current-description');
    partnerCurrentWebsiteLink = document.getElementById('partner-current-websiteLink');
    partnerCurrentDescriptionContainer = document.getElementById("partner-current-description-container");
    partnerNextImg = document.getElementById("partner-next-img");
    partnerPreviousImg = document.getElementById("partner-previous-img");
    partnerNextBtn = document.getElementById('partners-main-content-companies-listing-inner-next');
    partnerPrevBtn = document.getElementById('partners-main-content-companies-listing-inner-prev');
    currentIndex = 0;
    nextIndex = this.currentIndex + 1;
    previousIndex = this.currentIndex - 1;
    loopCarousel = false;
    constructor() {
        setInterval(() => {
            if (this.loopCarousel) {
                if (this.previousIndex < 0) {
                    this.previousIndex = 0;
                }
                if (this.currentIndex + 1 < this.partnerElementsArr.length) {
                    this.previousIndex = this.currentIndex;
                    this.currentIndex++;
                    if (this.currentIndex + 1 < this.partnerElementsArr.length) {
                        this.nextIndex++;
                    }
                }
                else {
                    this.previousIndex = this.currentIndex;
                    this.currentIndex = 0;
                    this.nextIndex = this.currentIndex + 1;
                }
                document.getElementById("partner-current-img").style.animation = "fadeIn 1s ease-in-out";
                setTimeout(() => {
                    this.partnerCurrentDescription.style.animation = "";
                    document.getElementById("partner-current-img").style.animation = "";
                }, 1100);
                this.drawElements();
            }
        }, 6000);
        window.addEventListener('click', () => {
            this.loopCarousel = false;
        });
        this.partnerNextBtn.addEventListener('click', () => {
            let arrLen = this.partnerElementsArr.length;
            if (arrLen == 1) {
                this.currentIndex = 0;
                this.previousIndex = 0;
                this.nextIndex = 0;
                return;
            }
            if (this.previousIndex < 0) {
                this.previousIndex = 0;
            }
            if (this.currentIndex + 1 < arrLen) {
                this.previousIndex = this.currentIndex;
                this.currentIndex++;
                if (this.currentIndex + 1 < arrLen) {
                    this.nextIndex++;
                }
            }
            else {
                this.previousIndex = this.currentIndex;
                this.currentIndex = 0;
                this.nextIndex = this.currentIndex + 1;
            }
            document.getElementById("partner-current-img").style.animation = "fadeIn 750ms ease-in-out";
            setTimeout(() => {
                this.partnerCurrentDescription.style.animation = "";
                document.getElementById("partner-current-img").style.animation = "";
            }, 1000);
            this.drawElements();
        });
        this.partnerPrevBtn.addEventListener('click', () => {
            let arrLen = this.partnerElementsArr.length;
            if (arrLen == 1) {
                this.currentIndex = 0;
                this.previousIndex = 0;
                this.nextIndex = 0;
                return;
            }
            if (this.previousIndex - 1 < 0) {
                this.previousIndex = arrLen - 1;
                this.currentIndex = 0;
                this.nextIndex = this.currentIndex + 1;
                if (this.nextIndex >= arrLen) {
                    this.nextIndex = 0;
                }
            }
            else {
                this.nextIndex = this.currentIndex;
                this.currentIndex = this.previousIndex;
                this.previousIndex--;
            }
            this.partnerCurrentDescription.style.animation = "fadeIn 750ms ease-in-out";
            document.getElementById("partner-current-img").style.animation = "fadeIn 750ms ease-in-out";
            setTimeout(() => {
                this.partnerCurrentDescription.style.animation = "";
                document.getElementById("partner-current-img").style.animation = "";
            }, 1000);
            this.drawElements();
        });
    }
    resetIndexesBasedOnArrayLength(len) {
        if (len != 1 && len != 0) {
            this.currentIndex = 0;
            this.nextIndex = this.currentIndex + 1;
            this.previousIndex = len - 1;
        }
        else {
            this.currentIndex = 0;
            this.nextIndex = 0;
            this.previousIndex = 0;
        }
    }
    setCallback(callback) {
        this.partnerControllerCallback = callback;
    }
    updateElementsArr(arr) {
        this.partnerElementsArr = arr;
        this.resetIndexesBasedOnArrayLength(arr.length);
        this.loopCarousel = true;
    }
    start() {
        this.drawElements();
    }
    drawElements() {
        if (this.partnerElementsArr.length == 0) {
            this.partnerCurrentName.innerHTML = "We are currently looking for partners.";
            this.partnerCurrentDescription.innerHTML = "Contact us today to join.";
            this.partnerCurrentImg.src = "../images/partner-logos/default_partner_needed_logo.jpg";
            return;
        }
        if (this.partnerElementsArr[this.currentIndex].CompanyDescription || this.partnerElementsArr[this.currentIndex].CompanyWebsiteLink) {
            this.partnerCurrentDescriptionContainer.style.visibility = "visible";
        }
        else {
            this.partnerCurrentDescriptionContainer.style.visibility = "hidden";
        }
        if (this.partnerElementsArr.length == 1) {
            this.partnerCurrentName.innerHTML = this.partnerElementsArr[this.currentIndex].CompanyName;
            this.partnerCurrentImg.src = this.partnerElementsArr[this.currentIndex].CompanyImage;
            this.partnerCurrentDescription.innerHTML = this.partnerElementsArr[this.currentIndex].CompanyDescription;
            this.partnerPreviousImg.style.display = "none";
            this.partnerNextImg.style.display = "none";
            if (this.partnerElementsArr[this.currentIndex].CompanyWebsiteLink) {
                this.partnerCurrentWebsiteLink.style.display = "block";
                this.partnerCurrentWebsiteLink.href = this.partnerElementsArr[this.currentIndex].CompanyWebsiteLink;
            }
            else {
                this.partnerCurrentWebsiteLink.style.display = "none";
            }
        }
        else {
            this.partnerCurrentName.innerHTML = this.partnerElementsArr[this.currentIndex].CompanyName;
            this.partnerCurrentImg.src = this.partnerElementsArr[this.currentIndex].CompanyImage;
            this.partnerCurrentDescription.innerHTML = this.partnerElementsArr[this.currentIndex].CompanyDescription;
            if (this.partnerElementsArr[this.currentIndex].CompanyWebsiteLink) {
                this.partnerCurrentWebsiteLink.style.display = "block";
                this.partnerCurrentWebsiteLink.href = this.partnerElementsArr[this.currentIndex].CompanyWebsiteLink;
            }
            else {
                this.partnerCurrentWebsiteLink.style.display = "none";
            }
            this.partnerPreviousImg.src = this.partnerElementsArr[this.previousIndex].CompanyImage;
            this.partnerNextImg.src = this.partnerElementsArr[this.nextIndex].CompanyImage;
        }
    }
}
class PartnerController {
    partnerView;
    partnerElemArr = [];
    constructor(view) {
        this.partnerView = view;
        this.fetchPartners();
    }
    async fetchPartners() {
        let partners = await (await fetch('../partners.json')).json();
        for (let partner of partners) {
            this.partnerElemArr.push(new Partner(partner.companyName, partner.companyImage, partner.companyDescription, partner["website-link"]));
        }
        this.setViewPartnersArr();
        this.partnerView.start();
    }
    async setViewPartnersArr() {
        console.log(this.partnerElemArr);
        this.partnerView.updateElementsArr(this.partnerElemArr);
    }
}
const partnerView = new PartnerView();
const partnerController = new PartnerController(partnerView);
//# sourceMappingURL=Partners.js.map