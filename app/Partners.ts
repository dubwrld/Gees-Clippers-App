interface partnerI {
    CompanyName: string;
    CompanyImage: string;
    CompanyDescription: string;
    CompanyWebsiteLink: string;
}

class Partner implements partnerI {
    private companyName: string = null;
    private companyImage: string = null;
    private companyDescription: string = null;
    private companyWebsiteLink: string = null;

    constructor(name: string, image: string, description: string, website?: string) {
        this.companyName = name;
        this.companyImage = image;
        this.companyDescription = description;

        if (!this.companyImage) {
            this.companyImage = "../images/partner-logos/missing-image.png"
        }

        if (website) {
            this.companyWebsiteLink = website;
        }
    }

    get CompanyName(): string { return this.companyName; }
    get CompanyImage(): string { return this.companyImage; }
    get CompanyDescription(): string { return this.companyDescription; }
    get CompanyWebsiteLink(): string { return this.companyWebsiteLink; }
}

class PartnerView {
    partnerElementsArr: partnerI[] = []
    partnerControllerCallback;
    partnerCurrentImg: HTMLImageElement = document.getElementById('partner-current-img') as HTMLImageElement;
    partnerCurrentName: HTMLElement = document.getElementById('partner-current-name');
    partnerCurrentDescription: HTMLElement = document.getElementById('partner-current-description');
    partnerCurrentWebsiteLink: HTMLAnchorElement = document.getElementById('partner-current-websiteLink') as HTMLAnchorElement;
    partnerCurrentDescriptionContainer: HTMLElement = document.getElementById("partner-current-description-container");

    partnerNextImg: HTMLImageElement = document.getElementById("partner-next-img") as HTMLImageElement;
    partnerPreviousImg: HTMLImageElement = document.getElementById("partner-previous-img") as HTMLImageElement;

    partnerNextBtn: HTMLElement = document.getElementById('partners-main-content-companies-listing-inner-next');
    partnerPrevBtn: HTMLElement = document.getElementById('partners-main-content-companies-listing-inner-prev');
    currentIndex: number = 0;
    nextIndex: number = this.currentIndex + 1;
    previousIndex: number = this.currentIndex - 1;

    loopCarousel = false;

    constructor() {

        //automatically loops through the partner carousel
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
                } else {
                    this.previousIndex = this.currentIndex;
                    this.currentIndex = 0;
                    this.nextIndex = this.currentIndex + 1;
                }
                
                document.getElementById("partner-current-img").style.animation = "fadeIn 1s ease-in-out"
                setTimeout(() => {
                    this.partnerCurrentDescription.style.animation = "";
                    document.getElementById("partner-current-img").style.animation = "";
                }, 1100);
                
                //draw each element in their current spots.
                this.drawElements();
            }
        }, 6000);

        window.addEventListener('click', () => {
            this.loopCarousel = false;
        })


        //increment the carosuel. Moving it forward.
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
            } else {
                this.previousIndex = this.currentIndex;
                this.currentIndex = 0;
                this.nextIndex = this.currentIndex + 1;
            }
            document.getElementById("partner-current-img").style.animation = "fadeIn 750ms ease-in-out"
            setTimeout(() => {
                this.partnerCurrentDescription.style.animation = "";
                document.getElementById("partner-current-img").style.animation = "";
            }, 1000);
            //draw each element in their current spots.
            this.drawElements()
        });


        //decrement partners array. Moving the carosuel in reverse
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
            } else {
                this.nextIndex = this.currentIndex;
                this.currentIndex = this.previousIndex;
                this.previousIndex--;
            }
            this.partnerCurrentDescription.style.animation = "fadeIn 750ms ease-in-out";
            document.getElementById("partner-current-img").style.animation = "fadeIn 750ms ease-in-out"
            setTimeout(() => {
                this.partnerCurrentDescription.style.animation = "";
                document.getElementById("partner-current-img").style.animation = "";
            }, 1000);
            //DRAW each element in their current position
            this.drawElements()
        });

    }

    resetIndexesBasedOnArrayLength(len: number) {
        if (len != 1 && len != 0) {
            this.currentIndex = 0;
            this.nextIndex = this.currentIndex + 1;
            this.previousIndex = len - 1;
        } else {
            this.currentIndex = 0;
            this.nextIndex = 0;
            this.previousIndex = 0;
        }

    }

    setCallback(callback) {
        this.partnerControllerCallback = callback;
    }

    updateElementsArr(arr: partnerI[]) {
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
            this.partnerCurrentDescription.innerHTML = "Contact us today to join."
            this.partnerCurrentImg.src = "../images/partner-logos/default_partner_needed_logo.jpg";
            return;
        }

        if (this.partnerElementsArr[this.currentIndex].CompanyDescription || this.partnerElementsArr[this.currentIndex].CompanyWebsiteLink) {
            this.partnerCurrentDescriptionContainer.style.visibility = "visible";
        } else {
            this.partnerCurrentDescriptionContainer.style.visibility = "hidden";
        }

        if (this.partnerElementsArr.length == 1) {
            //Display everything for the current partner
            this.partnerCurrentName.innerHTML = this.partnerElementsArr[this.currentIndex].CompanyName;
            this.partnerCurrentImg.src = this.partnerElementsArr[this.currentIndex].CompanyImage;
            this.partnerCurrentDescription.innerHTML = this.partnerElementsArr[this.currentIndex].CompanyDescription;

            // this.partnerCurrentDescription.style.animation = "fadeIn 1s ease-in-out 2s 1";

            this.partnerPreviousImg.style.display = "none";
            this.partnerNextImg.style.display = "none";

            if (this.partnerElementsArr[this.currentIndex].CompanyWebsiteLink) {
                this.partnerCurrentWebsiteLink.style.display = "block";
                this.partnerCurrentWebsiteLink.href = this.partnerElementsArr[this.currentIndex].CompanyWebsiteLink;
            } else {
                this.partnerCurrentWebsiteLink.style.display = "none"
            }

        } else {
            //Display everything for the current partner
            this.partnerCurrentName.innerHTML = this.partnerElementsArr[this.currentIndex].CompanyName;
            this.partnerCurrentImg.src = this.partnerElementsArr[this.currentIndex].CompanyImage;
            this.partnerCurrentDescription.innerHTML = this.partnerElementsArr[this.currentIndex].CompanyDescription;

            if (this.partnerElementsArr[this.currentIndex].CompanyWebsiteLink) {
                this.partnerCurrentWebsiteLink.style.display = "block";
                this.partnerCurrentWebsiteLink.href = this.partnerElementsArr[this.currentIndex].CompanyWebsiteLink;
            } else {
                this.partnerCurrentWebsiteLink.style.display = "none";
            }

            //Display the previous partner img
            this.partnerPreviousImg.src = this.partnerElementsArr[this.previousIndex].CompanyImage;

            //Display the next partner img
            this.partnerNextImg.src = this.partnerElementsArr[this.nextIndex].CompanyImage;
        }
    }
}

class PartnerController {
    partnerView: PartnerView;
    partnerElemArr: partnerI[] = [];


    constructor(view: PartnerView) {
        this.partnerView = view;
        this.fetchPartners();
        // this.setViewPartnersArr()
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