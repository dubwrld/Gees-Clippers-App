class NavigationMenu {
    existingData = localStorage.getItem('user');
    parsedData = JSON.parse(this.existingData);
    homeBtn = document.getElementById('index-nav-menu-home-btn');
    navBTNs = document.getElementsByClassName('navBTN');
    homePageURL = 'http://localhost:8080';
    adminPageURL = 'http://localhost:8080/admin';
    barberPageURL = 'http://localhost:8080/barber';
    navMenu = document.getElementById('nav-menu-section-inner-container');
    isNavMenuHidden = true;
    mobileMenuButton = document.getElementById('nav-section-mobile-menu-button');
    windowSizeChangeTarget = 1250;
    accountPageContainer = document.getElementById('loggedInACC');
    loginForm = document.getElementById('nav-menu-userLogin-form');
    loginInput = document.getElementById('nav-menu-username');
    passwordInput = document.getElementById('nav-menu-password');
    navMenuClicked = false;
    constructor() {
        this.homeBtn.addEventListener('click', () => {
            window.location.href = this.homePageURL;
        });
        for (let navBtn of this.navBTNs) {
            navBtn.addEventListener('mouseenter', () => {
                navBtn.insertAdjacentHTML('afterbegin', `
        <svg fill="#000000" height="30px" width="30px" style="padding:0 5px;"  version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 429.985 429.985" xml:space="preserve">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <path
                            d="M223.263,187.187c-11.446-11.446-30.071-11.447-41.519,0c-11.446,11.446-11.446,30.071,0,41.518l19.536,19.536 c5.724,5.723,13.241,8.585,20.759,8.585c7.519,0,15.036-2.862,20.76-8.585c0-0.001,0-0.001,0-0.001 c11.446-11.447,11.446-30.072,0-41.518L223.263,187.187z M228.655,234.098c-3.649,3.65-9.586,3.648-13.233,0l-19.536-19.536 c-3.649-3.648-3.649-9.585,0-13.234c1.824-1.824,4.221-2.736,6.617-2.736c2.396,0,4.792,0.912,6.617,2.736l19.535,19.535 C232.304,224.513,232.304,230.45,228.655,234.098z">
                        </path>
                        <path
                            d="M429.958,118.407l-1.857-25.431c-0.361-4.949-4.298-8.884-9.247-9.245l-16.809-1.225l-1.227-16.813 c-0.361-4.949-4.298-8.885-9.247-9.246l-16.81-1.225l-1.228-16.813c-0.361-4.949-4.298-8.884-9.247-9.245l-16.809-1.225 l-1.228-16.813c-0.361-4.949-4.298-8.885-9.247-9.246l-25.427-1.854c-2.897-0.208-5.743,0.848-7.798,2.902l-35.705,35.705 c-0.008,0.009-0.017,0.017-0.025,0.025c-1.742,1.743-3.43,3.525-5.061,5.341c-34.633,36.58-230.606,243.617-245.74,260.695 c-12.929,14.59-12.752,35.519,0.413,48.684l6.104,6.104L9.664,373.584c-12.885,12.886-12.885,33.852,0.001,46.737 c6.442,6.442,14.905,9.664,23.368,9.664c8.463,0,16.926-3.221,23.369-9.664l14.101-14.101l6.104,6.105 c13.164,13.164,34.094,13.343,48.684,0.413c17.078-15.134,224.116-211.107,260.695-245.741c1.819-1.634,3.604-3.325,5.352-5.071 c0.009-0.009,0.017-0.018,0.026-0.027l35.693-35.692C429.11,124.152,430.17,121.305,429.958,118.407z M369.253,74.873l12.246,0.893 l0.895,12.25l-25.398,25.398l-13.141-13.142L369.253,74.873z M341.969,47.59l12.247,0.893l0.895,12.25L329.712,86.13L316.57,72.989 L341.969,47.59z M314.686,20.306l12.246,0.892l0.895,12.25l-25.398,25.398l-13.141-13.141L314.686,20.306z M42.259,406.178 c-5.087,5.087-13.366,5.088-18.453,0c-5.087-5.087-5.087-13.365,0-18.452l14.101-14.101l18.453,18.453L42.259,406.178z M112.025,397.768c-6.557,5.809-15.704,5.988-21.277,0.413l-13.175-13.175l-45.77-45.77c-5.574-5.574-5.397-14.721,0.413-21.277 c11.349-12.807,130.794-139.19,200.464-212.835c-0.25,1.508-0.466,3.021-0.648,4.533c-3.202,26.553,4.283,50.426,21.076,67.219 c16.794,16.793,40.669,24.28,67.22,21.076c1.513-0.183,3.025-0.399,4.534-0.648C251.215,266.973,124.832,386.419,112.025,397.768z M267.25,162.734c-12.357-12.357-17.814-30.357-15.362-50.682c2.201-18.254,10.474-36.377,23.557-51.905l12.842,12.842 l-15.743,15.742c-3.905,3.905-3.905,10.237,0,14.142c3.906,3.904,10.236,3.904,14.143,0l15.742-15.743l13.142,13.142 l-15.742,15.742c-3.905,3.905-3.905,10.237,0,14.143c3.906,3.904,10.236,3.904,14.143,0l15.742-15.743l13.142,13.142 l-15.742,15.743c-3.905,3.905-3.905,10.237,0,14.142c3.906,3.905,10.236,3.905,14.143,0l15.742-15.742l12.839,12.839 C336.031,182.984,291.623,187.106,267.25,162.734z M384.279,140.698l-13.142-13.142l25.398-25.399l12.247,0.893l0.895,12.25 L384.279,140.698z">
                        </path>
                    </g>
                </g>
            </svg>
        `);
                let clipper = document.getElementById('Capa_1');
                clipper.style.transform = "rotate(90deg)";
                clipper.style.fill = "white";
            });
            navBtn.addEventListener('focus', () => {
                navBtn.insertAdjacentHTML('afterbegin', `
        <svg fill="#000000" height="30px" width="30px" style="padding:0 5px;"  version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 429.985 429.985" xml:space="preserve">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <path
                            d="M223.263,187.187c-11.446-11.446-30.071-11.447-41.519,0c-11.446,11.446-11.446,30.071,0,41.518l19.536,19.536 c5.724,5.723,13.241,8.585,20.759,8.585c7.519,0,15.036-2.862,20.76-8.585c0-0.001,0-0.001,0-0.001 c11.446-11.447,11.446-30.072,0-41.518L223.263,187.187z M228.655,234.098c-3.649,3.65-9.586,3.648-13.233,0l-19.536-19.536 c-3.649-3.648-3.649-9.585,0-13.234c1.824-1.824,4.221-2.736,6.617-2.736c2.396,0,4.792,0.912,6.617,2.736l19.535,19.535 C232.304,224.513,232.304,230.45,228.655,234.098z">
                        </path>
                        <path
                            d="M429.958,118.407l-1.857-25.431c-0.361-4.949-4.298-8.884-9.247-9.245l-16.809-1.225l-1.227-16.813 c-0.361-4.949-4.298-8.885-9.247-9.246l-16.81-1.225l-1.228-16.813c-0.361-4.949-4.298-8.884-9.247-9.245l-16.809-1.225 l-1.228-16.813c-0.361-4.949-4.298-8.885-9.247-9.246l-25.427-1.854c-2.897-0.208-5.743,0.848-7.798,2.902l-35.705,35.705 c-0.008,0.009-0.017,0.017-0.025,0.025c-1.742,1.743-3.43,3.525-5.061,5.341c-34.633,36.58-230.606,243.617-245.74,260.695 c-12.929,14.59-12.752,35.519,0.413,48.684l6.104,6.104L9.664,373.584c-12.885,12.886-12.885,33.852,0.001,46.737 c6.442,6.442,14.905,9.664,23.368,9.664c8.463,0,16.926-3.221,23.369-9.664l14.101-14.101l6.104,6.105 c13.164,13.164,34.094,13.343,48.684,0.413c17.078-15.134,224.116-211.107,260.695-245.741c1.819-1.634,3.604-3.325,5.352-5.071 c0.009-0.009,0.017-0.018,0.026-0.027l35.693-35.692C429.11,124.152,430.17,121.305,429.958,118.407z M369.253,74.873l12.246,0.893 l0.895,12.25l-25.398,25.398l-13.141-13.142L369.253,74.873z M341.969,47.59l12.247,0.893l0.895,12.25L329.712,86.13L316.57,72.989 L341.969,47.59z M314.686,20.306l12.246,0.892l0.895,12.25l-25.398,25.398l-13.141-13.141L314.686,20.306z M42.259,406.178 c-5.087,5.087-13.366,5.088-18.453,0c-5.087-5.087-5.087-13.365,0-18.452l14.101-14.101l18.453,18.453L42.259,406.178z M112.025,397.768c-6.557,5.809-15.704,5.988-21.277,0.413l-13.175-13.175l-45.77-45.77c-5.574-5.574-5.397-14.721,0.413-21.277 c11.349-12.807,130.794-139.19,200.464-212.835c-0.25,1.508-0.466,3.021-0.648,4.533c-3.202,26.553,4.283,50.426,21.076,67.219 c16.794,16.793,40.669,24.28,67.22,21.076c1.513-0.183,3.025-0.399,4.534-0.648C251.215,266.973,124.832,386.419,112.025,397.768z M267.25,162.734c-12.357-12.357-17.814-30.357-15.362-50.682c2.201-18.254,10.474-36.377,23.557-51.905l12.842,12.842 l-15.743,15.742c-3.905,3.905-3.905,10.237,0,14.142c3.906,3.904,10.236,3.904,14.143,0l15.742-15.743l13.142,13.142 l-15.742,15.742c-3.905,3.905-3.905,10.237,0,14.143c3.906,3.904,10.236,3.904,14.143,0l15.742-15.743l13.142,13.142 l-15.742,15.743c-3.905,3.905-3.905,10.237,0,14.142c3.906,3.905,10.236,3.905,14.143,0l15.742-15.742l12.839,12.839 C336.031,182.984,291.623,187.106,267.25,162.734z M384.279,140.698l-13.142-13.142l25.398-25.399l12.247,0.893l0.895,12.25 L384.279,140.698z">
                        </path>
                    </g>
                </g>
            </svg>
        `);
                let clipper = document.getElementById('Capa_1');
                clipper.style.transform = "rotate(90deg)";
            });
            navBtn.addEventListener('mouseleave', () => {
                document.getElementById('Capa_1').remove();
            });
            navBtn.addEventListener('blur', () => {
                document.getElementById('Capa_1').remove();
            });
        }
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.loginFormHandler(this.loginInput.value, this.passwordInput.value);
        });
        this.mobileMenuButton.addEventListener('click', () => {
            if (!this.navMenuClicked && this.isNavMenuHidden) {
                this.navMenu.style.display = 'flex';
                this.navMenuClicked = true;
                this.navMenu.style.animation = "slideIN 750ms ease-in-out";
                this.isNavMenuHidden = false;
            }
            else {
                this.navMenu.style.animation = "slideOUT 750ms ease-in-out";
                this.navMenuClicked = false;
                this.isNavMenuHidden = true;
                setTimeout(() => { this.navMenu.style.display = 'none'; }, 750);
            }
        });
        window.addEventListener('click', (event) => {
            const clickedElement = event.target;
            if (!this.isNavMenuHidden && !this.mobileMenuButton.contains(clickedElement) && event.target !== this.navMenu && event.target !== this.loginInput && event.target !== this.passwordInput && window.innerWidth < this.windowSizeChangeTarget) {
                this.navMenu.style.animation = "slideOUT 750ms ease-in-out";
                this.isNavMenuHidden = true;
                setTimeout(() => { this.navMenu.style.display = 'none'; }, 750);
            }
        });
        window.addEventListener('resize', () => {
            if (this.windowSizeChangeTarget >= window.innerWidth) {
                this.navMenu.style.display = 'flex';
                this.navMenu.style.animation = "slideIN 750ms ease-in-out";
                this.isNavMenuHidden = false;
            }
        });
    }
    async loginFormHandler(username, password) {
        this.loginForm.reset();
        const response = await fetch("http://localhost:8080/accounts.json");
        let data = await response.json();
        for (let acc of data) {
            console.log(acc.login == username);
            console.log(acc.password == password);
            console.log(acc.accountType);
            if (username == acc.login && password == acc.password) {
                if (acc.accountType == "barber") {
                    console.log("Barber logged in.");
                    localStorage.setItem('user', JSON.stringify(acc));
                    const existingData = localStorage.getItem('user');
                    const parsedData = JSON.parse(existingData);
                    console.log(parsedData);
                    parsedData.loggedIN = true;
                    localStorage.setItem('user', JSON.stringify(parsedData));
                    this.loginForm.style.display = 'none';
                    this.accountPageContainer.insertAdjacentHTML("beforeend", `<button id="userAccount">Account</button>`);
                    document.getElementById("userAccount").addEventListener("click", () => { window.location.href = this.barberPageURL; });
                    return;
                }
                else {
                    console.log('Admin logged in.');
                    this.loginForm.style.display = 'none';
                    localStorage.setItem('user', JSON.stringify(acc));
                    const existingData = localStorage.getItem('user');
                    const parsedData = JSON.parse(existingData);
                    console.log(parsedData);
                    this.accountPageContainer.insertAdjacentHTML("beforeend", `<button id="userAccount">Account</button>`);
                    document.getElementById("userAccount").addEventListener("click", () => { window.location.href = this.adminPageURL; });
                    return;
                }
            }
        }
        alert("Access denied");
        window.location.reload();
    }
}
let navMenu = new NavigationMenu();
//# sourceMappingURL=NavigationMenu.js.map