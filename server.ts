import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import open from "open";
import fs from 'fs/promises';
import nodemailer from 'nodemailer';
import multer from "multer";
import { spawn } from "child_process";
import cors from "cors";


class Server {
    private app = express();
    private port: string | number = process.env.Port ?? 8080;
    private __dirname = path.dirname(fileURLToPath(import.meta.url));
    private targetURL = "http://localhost:" + this.port;
    private openBrowser = false;

    constructor(port?: number) {
        if (port) {
            this.port = process.env.Port ?? port;
            this.targetURL = "http://localhost:" + this.port;
        }
        this.startServer();
    }

    startServer() {
        this.app.use(express.static("static"));
        this.app.use(express.static("static/js"));
        this.app.use(express.static("/"));
        this.registerStaticPaths();
        this.configureRoutes();
        console.log("Server started on port:" + this.port);
        this.runOpen(this.openBrowser);
        this.app.listen(this.port);
    }

    runOpen(run: boolean) {
        if (run)
            // Open the default web browser with the specified URL
            open(this.targetURL, { wait: true })
                .then(() => {
                    console.log(`Opened ${this.targetURL} in the default web browser`);
                    this.openBrowser = false;
                })
                .catch((err) => {
                    console.error("Error:", err);
                });

        return;
    }

    registerStaticPaths() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use(cors());

        console.log("Setting up registerStaticPaths");

        // this.app.use('/app/accountState.js', (req, res, next) => {
        //     res.status(403).send('Access denied');
        // });

        this.app.use("/", express.static(path.join(this.__dirname, "./")));
        this.app.use("/app", express.static(path.join(this.__dirname, "./app/")));
        this.app.use("/html", express.static(path.join(this.__dirname, "./html/")));
        this.app.use("/css", express.static(path.join(this.__dirname, "./css")));
        this.app.use(
            "/images",
            express.static(path.join(this.__dirname, "./images/"))
        );
        this.app.use(
            "/images/uploads",
            express.static(path.join(this.__dirname, "./images/uploads/"))
        );
        this.app.use("/dist", express.static(path.join(this.__dirname, "./dist/")));
    }

    configureRoutes() {

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './images/uploads');
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.split('.').pop().toLowerCase();
                cb(null, Date.now() + '.' + extension);

            }
        });

        const upload = multer({ storage: storage });

        this.app.get("/", (req, res) => {
            res.sendFile(path.join(this.__dirname, "./html/index.html"));
        });

        this.app.get("/medical-clinic", (req, res) => {
            res.sendFile(path.join(this.__dirname, "./html/medicalClinic.html"));
        });

        this.app.get("/barbers", (req, res) => {
            res.sendFile(path.join(this.__dirname, "./html/barbers.html"));
        });

        this.app.get("/admin", async (req, res) => {
            // const filePath = "./accounts.json";
            // const fileContent = await fs.readFile(filePath, 'utf-8');
            // const existingData = JSON.parse(fileContent);

            res.sendFile(path.join(this.__dirname, "./html/adminPanel.html"));
        })

        this.app.get("/barber", (req, res) => {
            res.sendFile(path.join(this.__dirname, "./html/barberAccount.html"));
        });

        this.app.get("/services", (req, res) => {
            res.sendFile(path.join(this.__dirname, "./html/services.html"));
        });

        this.app.get("/reviews", (req, res) => {
            res.sendFile(path.join(this.__dirname, "./html/reviews.html"));
        });

        this.app.get('/partners', (req, res) => {
            res.sendFile(path.join(this.__dirname, "./html/partners.html"));
        });

        this.app.delete("/delete-review", async (req, res) => {
            console.log(req.body);
            const filePath = "./reviews.json";
            const filePathMain = "./lib/reviews.json";

            const fileContent = await fs.readFile(filePath, 'utf-8');
            const existingData = JSON.parse(fileContent) as { id: number }[];

            for (let i = 0; i < existingData.length; i++) {
                let review = existingData[i];

                if (review.id == req.body.id) {
                    console.log(true);
                    existingData.splice(i, 1);
                    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
                    await fs.writeFile(filePathMain, JSON.stringify(existingData, null, 2));

                    res.sendStatus(200);
                    return
                }
            }
            res.sendStatus(404);
        });


        this.app.delete("/delete-account", async (req, res) => {
            console.log(req.body);
            const filePath = "./accounts.json";
            const filePathMain = "./lib/accounts.json";

            const filePathBarbers = "./barbers.json";
            const filePathMainBarbers = "./lib/barbers.json";

            const fileContent = await fs.readFile(filePath, 'utf-8');
            const accountsData = JSON.parse(fileContent) as { id: number, accountType: string }[];

            const fileContentBarbers = await fs.readFile(filePathBarbers, 'utf-8');
            const barbersData = JSON.parse(fileContentBarbers) as { id: number, name: string }[];

            try {
                for (let i = 0; i < accountsData.length; i++) {
                    let account = accountsData[i];

                    if (account.id == req.body.id) {
                        console.log("Account found: ", true);

                        if (account.accountType == "barber") {
                            let index = barbersData.findIndex((barber) => {
                                return barber.id == account.id
                            });

                            if (index != -1) {
                                console.log("Barber found:", true);
                                console.log("index", index);
                                barbersData.splice(index, 1);

                                await fs.writeFile(filePathBarbers, JSON.stringify(barbersData, null, 2));
                                await fs.writeFile(filePathMainBarbers, JSON.stringify(barbersData, null, 2));
                            }
                        }
                        accountsData.splice(i, 1);
                        await fs.writeFile(filePath, JSON.stringify(accountsData, null, 2));
                        await fs.writeFile(filePathMain, JSON.stringify(accountsData, null, 2));

                        res.sendStatus(200);
                        return
                    }
                }
                res.sendStatus(404);
            } catch (error) {
                console.error(error)
                res.sendStatus(404);
            }


        });


        this.app.delete("/delete-event", async (req, res) => {
            console.log(req.body);
            const filePath = "./events.json";
            const filePathMain = "./lib/events.json";

            const fileContent = await fs.readFile(filePath, 'utf-8');
            const existingData = JSON.parse(fileContent) as { id: number }[];

            for (let i = 0; i < existingData.length; i++) {
                let event = existingData[i];

                if (event.id == req.body.id) {
                    console.log(true);
                    existingData.splice(i, 1);
                    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
                    await fs.writeFile(filePathMain, JSON.stringify(existingData, null, 2));

                    res.sendStatus(200);
                    return
                }
            }
            res.sendStatus(404);
        });


        this.app.post("/account-creation", async (req, res) => {
            const filePath = "./accounts.json";
            const filePathMain = "./lib/accounts.json";
            console.log(req.body);

            const fileContent = await fs.readFile(filePath, 'utf-8');
            const existingData = JSON.parse(fileContent);

            for (let account of existingData) {
                if (account.login == req.body.username) {
                    console.log("account already exist");
                    res.sendStatus(400);
                    return;
                }
            }

            const account = {
                id: Date.now(),
                login: req.body.username,
                password: req.body.password,
                accountType: req.body.accountType,
                loggedIn: false
            }
            existingData.push(account);

            await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
            await fs.writeFile(filePathMain, JSON.stringify(existingData, null, 2));


            if (req.body.accountType == "barber") {
                const filePathA = "./barbers.json";
                const filePathMainA = "./lib/barbers.json";

                const fileContentA = await fs.readFile(filePathA, 'utf-8');
                const existingDataA = JSON.parse(fileContentA);

                let barber = {
                    id: account.id,
                    name: req.body.name,
                    img: "../images/barbers/default_img.png",
                    bio: "",
                    scheduleAppointment: "",
                    contact: "",
                    socialMediaLinks: [],
                    buttonImg: [],
                    barberCuts: []
                }

                existingDataA.push(barber);

                await fs.writeFile(filePathA, JSON.stringify(existingDataA, null, 2));
                await fs.writeFile(filePathMainA, JSON.stringify(existingDataA, null, 2));

                res.sendStatus(200);
            }

        });


        this.app.post("/login", async (req, res) => {
            const filePath = "./accounts.json";
            const filePathMain = "./lib/accounts.json";

            const fileContent = await fs.readFile(filePath, 'utf-8');
            const existingData = JSON.parse(fileContent);
            console.log(req.body.email + req.body.password);


            for (let account of existingData) {
                console.log("account:", account)
                if (req.body.email == account.login && req.body.password == account.password) {
                    console.log(req.body.email == account.login && req.body.password == account.password);

                    if (account.accountType == "admin") {
                        // res.sendFile(path.join(this.__dirname, "./html/adminPanel.html"));
                        account.loggedIN = true;
                        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
                        await fs.writeFile(filePathMain, JSON.stringify(existingData, null, 2));

                        res.json({ account: account })
                        return;
                    } else if (account.accountType == "barber") {
                        account.loggedIN = true;
                        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
                        await fs.writeFile(filePathMain, JSON.stringify(existingData, null, 2));
                        res.json({ account: account });
                        return;
                        //res.sendFile(path.join(this.__dirname, "./html/barberAccount.html"));
                    }
                }
            }
            res.status(403).send('Access denied');
        });


        this.app.post("/updateProfileImg", upload.single("image"), async (req, res) => {
            const imageUrl = (req.file as Express.Multer.File).filename; // Type assertion
            console.log("img:", imageUrl);
            console.log("id:", req.body.id)
            try {
                const filePath = './lib/barbers.json';
                const filePathMain = './barbers.json';

                const sourcePath = "./images/uploads/";
                const destinationPath = "./lib/images/uploads/";

                try {
                    await fs.cp(sourcePath, destinationPath, { recursive: true });
                } catch (error) {
                    console.log("Failed to copy image")
                    res.sendStatus(501)
                }

                // Read the existing data from the file
                const fileContent = await fs.readFile(filePath, 'utf-8');
                const existingData = JSON.parse(fileContent);

                for (let barber of existingData) {
                    if (barber.id == req.body.id) {
                        barber.img = "../images/uploads/" + imageUrl;
                    }
                }
                await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
                await fs.writeFile(filePathMain, JSON.stringify(existingData, null, 2));
                res.sendStatus(200);
            } catch (error) {
                console.log(error)
                res.sendStatus(500)
            }
        });


        this.app.post("/updateInfo", async (req, res) => {
            console.log(req.body);


            const filePath = './lib/barbers.json';
            const filePathMain = './barbers.json';

            (async () => {
                try {


                    // Read the existing data from the file
                    const fileContent = await fs.readFile(filePath, 'utf-8');
                    const existingData = JSON.parse(fileContent);

                    for (let barber of existingData) {
                        if (barber.id == req.body.id) {
                            console.log("before update:", barber);

                            barber.name = req.body.name;
                            barber.bio = req.body.bio;
                            barber.scheduleAppointment = req.body.scheduleAppointment;
                            barber.contact = req.body.preferredContact;

                            barber.socialMediaLinks = [];
                            barber.buttonImg = [];

                            for (let i = 0; i < req.body.socialMediaLinks.length; i++) {
                                barber.socialMediaLinks.push(req.body.socialMediaLinks[i].socialMediaLink);
                                barber.buttonImg.push(req.body.socialMediaLinks[i].img);
                            }


                            console.log("after update:", barber);
                        }
                    }

                    // Write the updated data back to the file
                    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
                    await fs.writeFile(filePathMain, JSON.stringify(existingData, null, 2));

                    res.sendStatus(200);

                    // console.log('New object added to the array in the file.');
                } catch (err) {
                    res.sendStatus(500);
                    console.error('Error:', err);
                }

            })();

        })

        this.app.post('/event-email', async (req, res) => {
            console.log(req.body);

            const transporter = nodemailer.createTransport({
                service: 'Gmail', // e.g., 'Gmail'
                auth: {
                    user: '0112derrick@gmail.com',
                    pass: 'zohyhldqnlzbnium'
                }
            });

            const mailOptions = {
                from: '0112derrick@gmail.com',
                to: 'derrwilliams@icstars.org',
                subject: req.body.header,
                text: "Email: " + req.body.email + " message:" + req.body.body
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent:', info.response);
                res.sendStatus(200);
            } catch (error) {
                console.error('Error sending email:', error);
                res.sendStatus(500);
            }
        });


        this.app.post("/upload-event", upload.single('image'), async (req, res) => {
            const title = req.body.title as string;
            const description = req.body.description as string;
            const imageUrl = (req.file as Express.Multer.File).filename; // Type assertion
            console.log("T: " + title + " D: " + description + "Image: " + imageUrl);

            const data = {
                id: Date.now(),
                title: title,
                imageSrc: "../images/uploads/" + imageUrl,
                description: description
            }

            const filePath = './lib/events.json';
            const filePathMain = './events.json';

            (async () => {
                try {
                    const sourcePath = "./images/uploads/";
                    const destinationPath = "./lib/images/uploads/";

                    try {
                        await fs.cp(sourcePath, destinationPath, { recursive: true });
                    } catch (error) {
                        console.log(error);
                        res.sendStatus(500);
                        return;
                    }

                    // Read the existing data from the file
                    const fileContent = await fs.readFile(filePath, 'utf-8');
                    const existingData = JSON.parse(fileContent);

                    console.log(existingData);
                    // Add the new object to the existing array
                    existingData.push(data);

                    // Write the updated data back to the file
                    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
                    await fs.writeFile(filePathMain, JSON.stringify(existingData, null, 2));


                    // Handle the data and send a response
                    res.sendStatus(200);

                    // console.log('New object added to the array in the file.');
                } catch (err) {
                    // Handle the data and send a response
                    res.sendStatus(500)
                    console.error('Error:', err);
                }

            })();

        });

        this.app.post("/review-form", async (req, res) => {
            console.log(req.body);
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
            const day = String(currentDate.getDate()).padStart(2, '0');

            // Format the date in yyyy/mm/dd format
            const formattedDate = `${year}/${month}/${day}`;
            // const data = new Review(req.body.rating, req.body.description);
            const data = {
                date: formattedDate,
                rating: req.body.rating,
                testimony: req.body.description,
                name: req.body.name || "Anonymous",
                tags: req.body.tags || [],
                id: Date.now()
            }

            const filePath = './lib/reviews.json';
            const filePathMain = './reviews.json';

            (async () => {
                try {
                    // Read the existing data from the file
                    const fileContent = await fs.readFile(filePath, 'utf-8');
                    const existingData = JSON.parse(fileContent);

                    console.log(existingData);
                    // Add the new object to the existing array
                    existingData.push(data);


                    // Write the updated data back to the file
                    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
                    await fs.writeFile(filePathMain, JSON.stringify(existingData, null, 2));

                    res.sendStatus(200);

                    // console.log('New object added to the array in the file.');
                } catch (err) {
                    res.sendStatus(500);
                    console.error('Error:', err);
                }

            })();

        });


        this.app.all('*', (req, res) => {
            res.status(404).send('Route not found');
        });

        return;
    }

}

const server = new Server();
