class Footer {
    shopHoursDirectoryBtn = document.getElementById('footer-hours-btn');
    shopHoursDirectoryMenu = document.getElementById('footer-section-shop-hours')

    shopContactDirectoryBtn = document.getElementById('footer-contact-btn');
    shopContactDirectoryMenu = document.getElementById('footer-section-gees-contact');

    linkedINBtn = document.getElementById('footer-section-gees-contact-linkedin');
    facebokBtn = document.getElementById('footer-section-gees-contact-facebook');
    instagramBtn = document.getElementById('footer-section-gees-contact-instagram');

    constructor() {

        window.addEventListener('click', (event) => {
            const clickedElement = event.target as Node;
            const windowSizeChangeTarget = 1250;

            if (!this.shopContactDirectoryMenu.contains(clickedElement) && event.target !== this.shopContactDirectoryBtn) {
                this.shopContactDirectoryMenu.style.display = 'none';
            }

            if (!this.shopHoursDirectoryBtn.contains(clickedElement) && event.target !== this.shopHoursDirectoryBtn) {
                this.shopHoursDirectoryMenu.style.display = 'none';
            }

        })


        this.shopContactDirectoryBtn.addEventListener('click', () => {
            this.shopContactDirectoryMenu.style.display = 'flex';
        })

        this.shopHoursDirectoryBtn.addEventListener('click', () => {
            this.shopHoursDirectoryMenu.style.display = 'flex';
        });


        //NOTE - footer contact social media buttons.

        this.linkedINBtn.addEventListener('click', () => {
            window.open("https://www.linkedin.com/in/gaulien-smith-ii-4ba8bb14/");
        });

        this.facebokBtn.addEventListener('click', () => {
            window.open("https://www.facebook.com/geesclippersbarberandbeautysalon");
        });

        this.instagramBtn.addEventListener('click', () => {
            window.open("https://www.instagram.com/geesclippers/");
        });
    }
}

let footer = new Footer();