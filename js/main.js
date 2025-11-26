document.addEventListener('DOMContentLoaded', function() {
    const cutoffScores = {
        "AMC 10A": 1194.5,
        "AMC 10B": 11105,
        "AMC 12A": 1176.5,
        "AMC 12B": 1188.5
    };

    const loadingOverlay2 = document.getElementById('loadingOverlay2');
    const loadingOverlay4 = document.getElementById('loadingOverlay4');

    const viewResult = document.getElementById('button1'); // View Result
    const downloadCert = document.getElementById('button2'); // download cert.

    const downloadContainer = document.getElementById('downloadContainer');
    const downloadOverlay = document.getElementById('downloadOverlay');
    downloadOverlay.style.display = 'none'; // hide initially
    downloadContainer.style.display = 'none'; // hide initially

    const progressBar = document.getElementById('downloadBar');
    const categorySelect = document.getElementById('categorySelect');

    /*get result modal box elements*/
    const emailBox = document.getElementById('emailBox');
    const closeBox = document.getElementById('closeBox');
    const submitEmail = document.getElementById('submitEmail');
    const emailInput = document.getElementById('emailInput');

    /*get downloadCert modal box*/
    const certBox = document.getElementById('certBox');
    const closeBox2 = document.getElementById('closeCert');
    const submitEmail2 = document.getElementById('submitCertEmail');
    const emailInput2 = document.getElementById('certEmailInput');
    const completeModal = document.getElementById('completeModal');

    /*error box*/
    const errorBox = document.getElementById('errorModal');
    const closeErrorBox = document.getElementById('closeError');
    const errorText = document.getElementById('errorText');

    categorySelect.addEventListener('change', function() {
    if (this.value) {
        this.style.color = '#000';
    } else {
        this.style.color = '#999';
    }
    });
    let usersData = []; 
    async function loadUsers() {
        try {
            const response = await fetch("first data amc.json");
            usersData = await response.json(); 
            console.log(usersData); 
        } catch (error) {
            console.error("Error fetching JSON:", error);
        }
    }
    window.onload = loadUsers;
    function getDirectDriveLink(shareLink) {
        const match = shareLink.match(/\/d\/(.*?)\//);
        return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : shareLink;
    }


    const headerMessage = document.getElementById('headerMessage');
    viewResult.addEventListener('click', function() {
        const headerMessage = document.getElementById('headerMessage');
        headerMessage.textContent = "Check Your Result!";
        emailBox.style.display = 'flex';
        emailInput.value = ''; // Clear previous input
    });
    closeBox.addEventListener('click', function() {
        emailBox.style.display = 'none';
        document.getElementById("categorySelect").selectedIndex = 0;
        document.getElementById("categorySelect").style.color = "#999";
    });

    downloadCert.addEventListener('click', function() {
        const headerMessage = document.getElementById('headerMessage');
        headerMessage.textContent = "Download Your Certificate!";
        emailBox.style.display = 'flex';
        emailInput.value = ''; // Clear previous input
    });
    closeBox2.addEventListener('click', function() {
        emailBox.style.display = 'none';
    });


    /* CHECK RESULT SUBMIT BUTTON */
    submitEmail.addEventListener('click', function() {
        if(headerMessage.textContent === "Check Your Result!") {
            const firstName = capitalize(document.getElementById('firstNameInput').value.trim());
            const lastName = capitalize(document.getElementById('lastNameInput').value.trim());
            const dob = document.getElementById('dobInput').value;
            const email = document.getElementById('emailInput').value.trim();
            const categorySelect = document.getElementById('categorySelect');
            const selectedCategory = categorySelect.value;
            if (!firstName) {
                loadingOverlay2.classList.add('active');
                setTimeout(() => {
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please enter your first name.";
                    loadingOverlay2.classList.remove('active');
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                });
                return;
            }
            if (!lastName) {
                loadingOverlay2.classList.add('active');
                setTimeout(() => {
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please enter your last name.";
                    loadingOverlay2.classList.remove('active');
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                });
                return;
            }
            if (!dob && !email) {
                loadingOverlay2.classList.add('active');
                setTimeout(() => {
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please enter your birth date or email address.";
                    loadingOverlay2.classList.remove('active');
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                });
                return;
            }
            if(!selectedCategory) {
                loadingOverlay2.classList.add('active');
                setTimeout(() => {
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please select a category.";
                    loadingOverlay2.classList.remove('active');
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                });
                return;
            }

            const user = usersData.find(u =>
                u.fullName.toLowerCase().includes(firstName.toLowerCase()) &&
                u.fullName.toLowerCase().includes(lastName.toLowerCase()) &&
                u.category === selectedCategory &&
                (normalizeDate(u.dob) === dob ||
                u.email.toLowerCase() === email.toLowerCase())
            );        

            if (user) {
                loadingOverlay2.classList.add('active');
                setTimeout(() => {
                    document.getElementById('emailBox').style.display = 'none';
                    showResultModal(user, selectedCategory, cutoffScores);
                    categorySelect.selectedIndex = 0;
                    categorySelect.style.color = '#999';
                    loadingOverlay2.classList.remove('active');
                }, 3000);
                document.querySelector('.close-result').addEventListener('click', () => {
                    document.getElementById('resultBox').style.display = 'none';
                    emailBox.style.display = 'none';
                });
            } else {
                loadingOverlay2.classList.add('active');
                setTimeout(() => {
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Unable to find contestant.";
                    loadingOverlay2.classList.remove('active');
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                });
            }
        } else {
            const firstName = capitalize(document.getElementById('firstNameInput').value.trim());
            const lastName = capitalize(document.getElementById('lastNameInput').value.trim());
            const dob = document.getElementById('dobInput').value;
            const email = document.getElementById('emailInput').value.trim();
            const categorySelect = document.getElementById('categorySelect');
            const selectedCategory = categorySelect.value;
            if (!firstName) {
                loadingOverlay2.classList.add('active');
                setTimeout(() => {
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please enter your first name.";
                    loadingOverlay2.classList.remove('active');
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                });
                return;
            }
            if (!lastName) {
                loadingOverlay2.classList.add('active');
                setTimeout(() => {
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please enter your last name.";
                    loadingOverlay2.classList.remove('active');
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                });
                return;
            }
            if (!dob && !email) {
                loadingOverlay2.classList.add('active');
                setTimeout(() => {
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please enter your birth date or email address.";
                    loadingOverlay2.classList.remove('active');
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                });
                return;
            }
            if(!selectedCategory) {
                loadingOverlay2.classList.add('active');
                setTimeout(() => {
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please select a category.";
                    loadingOverlay2.classList.remove('active');
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                });
                return;
            }

            const user = usersData.find(u =>
                u.fullName.toLowerCase().includes(firstName.toLowerCase()) &&
                u.fullName.toLowerCase().includes(lastName.toLowerCase()) &&
                u.category === selectedCategory &&
                (normalizeDate(u.dob) === dob ||
                u.email.toLowerCase() === email.toLowerCase())
            );  

            if (user && user.certificate) {
                downloadCertificate(user);
            } else {
                loadingOverlay2.classList.add('active');
                setTimeout(() => {
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Certificate has not released yet.";
                    loadingOverlay2.classList.remove('active');
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                });
            }

        }
        
    });

    document.getElementById('closeError').addEventListener('click', function() {
        document.getElementById('errorModal').style.display = 'none';

    });

    

    
    function showResultModal(user, selectedCategories, cutoffScores) {
        const modal = document.getElementById('resultBox');
        const name = document.getElementById('resultName');
        const messageText = document.getElementById('resultMessage');
        const scoreText = document.getElementById('resultText');
        const congratulationMessage = document.getElementById('resultCongratulation');

        congratulationMessage.textContent = 'Congratulations for completing AMC!';
        scoreText.textContent = user.result + ' / 150';

        const passed = user.result >= cutoffScores[selectedCategories];
        name.textContent = capitalize(user.firstName) + " " + capitalize(user.lastName);

        if (passed) {
            messageText.textContent = 'Congratulations for qualifying AIME!';
            setTimeout(() => {
                confetti({
                    particleCount: 300,
                    spread: 300,
                    origin: { y: 0.55 },
                    ticks: 350
                });
            }, 100);
            
        } else {
            messageText.textContent = 'Category: ' + selectedCategories + ' 2025';
            setTimeout(() => {
                confetti({
                    particleCount: 300,
                    spread: 300,
                    origin: { y: 0.55 },
                    ticks: 200
                });
            }, 100);
        }   
        modal.style.display = 'flex';
    };

    function capitalize(name) {
        if (!name) return '';
        return name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }

    document.getElementById("openCertLink").addEventListener("click", function(event) {
        const loadingOverlay3 = document.getElementById('loadingOverlay3');
        loadingOverlay3.classList.add('active');
        setTimeout(() => {
            // Close the result box
            event.preventDefault(); // prevent the page from jumping
            document.getElementById("resultBox").style.display = "none";

            // Open the certificate box
            headerMessage.textContent = "Download Your Certificate!";
            document.getElementById("emailBox").style.display = "flex";
            loadingOverlay3.classList.remove('active');
        }, 1250);
    });

    /* ENQUIRY MODAL SET UP */
    document.querySelector("#enquiryModal .close-modal").onclick = function() {
        document.getElementById("enquiryForm").reset();
        document.getElementById("enquiryModal").style.display = "none";
    }
    /* FUNCTION TO CONVERT DD/MM/YYYY TO YYYY-MM-DD */
    function normalizeDate(dateStr) {
        if (!dateStr) return null;

        // Replace '-' with '/' for easier splitting
        const cleanStr = dateStr.replace(/-/g, '/');
        const parts = cleanStr.split('/');

        if (parts[0].length === 4) {
            // Already in YYYY/MM/DD
            return `${parts[0]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
        } else {
            // DD/MM/YYYY format → convert to YYYY-MM-DD
            return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
        }
    }

    /* OPEN THE CONTACT US PAGE  */
    const contactText = document.querySelector(".nav-item:nth-child(2)");
    contactText.addEventListener("click", function() {
        document.getElementById("enquiryModal").style.display = "block";
    });

    /* FUNCTION TO SEND ENQUIRY EMAILJS AUTOMATIC */
    function sendEnquiryEmail() {
        let parms = {
            name: document.getElementById("enquiryName").value,
            email: document.getElementById("enquiryEmail").value,
            message: document.getElementById("enquiryMessage").value
        };
        emailjs.send("service_btpe0sq", "template_hkzn2pc", parms);
        event.preventDefault();
        
    }

    document.getElementById("enquirySubmit").addEventListener("click", function(event) {
        const form = document.getElementById("enquiryForm");

        if (!form.checkValidity()) {
            event.preventDefault();
            form.reportValidity();
            return;
        } else {
            submitEnquiry();
        }     
    });


    /* CLOSE MODALS CLICKING OUTSIDE SET UP */
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("resultBox");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("certBox");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("emailBox");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("errorModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("enquiryModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    /* DOWNLOAD CERTIFICATE WITH PROGRESS BAR */
    function downloadCertificate(user) {
        downloadOverlay.style.display = 'flex';
        downloadContainer.style.display = 'flex';
        const message = document.getElementById('downloadLabel');
        message.textContent = "Downloading...";

        progressBar.style.width = '0%'; // reset

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5; // uneven progress for realism
            if (progress >= 100) {
                setTimeout(() => {
                    message.textContent = "Download Complete!";
                }, 300);
                progress = 100;
                clearInterval(interval);

                // Trigger download
                const directLink = getDirectDriveLink(user.certificate);
                const link = document.createElement('a');
                link.href = directLink;
                link.download = 'Certificate.pdf';
                link.click();

                setTimeout(() => {
                    downloadOverlay.style.display = "none";
                    downloadContainer.style.display = "none";
                    message.textContent = "";
                    emailBox.style.display = 'none';
                    document.getElementById("categorySelect").selectedIndex = 0;
                    document.getElementById("categorySelect").style.color = "#999";
                }, 5000);
            }
            progressBar.style.width = progress + '%';
        }, 200); // update every 200ms
    }

    function submitEnquiry() {
        sendEnquiryEmail();
        downloadOverlay.style.display = 'flex';
        downloadContainer.style.display = 'flex';
        const message = document.getElementById('downloadLabel');
        message.textContent = "Submitting enquiry...";

        progressBar.style.width = '0%'; // reset

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5; // uneven progress for realism
            if (progress >= 100) {
                setTimeout(() => {
                    message.textContent = "We have received your enquiry!";
                }, 300);
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    downloadOverlay.style.display = "none";
                    downloadContainer.style.display = "none";
                    message.textContent = "";
                    document.getElementById("enquiryModal").style.display = "none";
                    document.getElementById("enquiryMessage").value = "";
                }, 2000);
            }
            progressBar.style.width = progress + '%';
        }, 200); // update every 200ms
    }


    
});