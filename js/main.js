document.addEventListener('DOMContentLoaded', function() {
    const categoriesBtn2 = [
        "AMC 8"
    ];

    const categoriesBtn3 = [
        "AIME I",
        "AIME II"
    ];
    const categoriesBtn1 = [
        "AMC 10A",
        "AMC 10B",
        "AMC 12A",
        "AMC 12B",
        "AMC 12B Resit"
    ];

    isAMC8 = false;
    isAIME = false

    let tempFirstName, tempLastName, tempFullName, tempEmail, tempDob, tempCategory, tempResult, tempCertificate;
    function resetTempVariables() {
        tempFirstName = null;
        tempLastName = null;
        tempFullName = null;
        tempEmail = null;
        tempDob = null;
        tempCategory = null;
        tempResult = null;
        tempCertificate = null;
    }

    function setCategories(categories) {
        categorySelect.innerHTML = `
            <option value="" disabled selected hidden>Select your category</option>
        `;

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
    }

    const loadingOverlay2 = document.getElementById('loadingOverlay2');


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

    function getDirectDriveLink(shareLink) {
        const match = shareLink.match(/\/d\/(.*?)\//);
        return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : shareLink;
    }


    const headerMessage = document.getElementById('headerMessage');
    // VIEW RESULT BUTTON
    viewResult.addEventListener('click', function() {
        isAMC8 = false;
        isAIME = false;
        const headerMessage = document.getElementById('headerMessage');
        setCategories(categoriesBtn1);
        headerMessage.textContent = "Check Your Result!";
        emailBox.style.display = 'flex';
    });

    const viewResult8 = document.getElementById('amc8-button1'); // View Result AMC 8
    viewResult8.addEventListener('click', function() {
        setCategories(categoriesBtn2);
        isAMC8 = true;
        isAIME = false;
        headerMessage.textContent = "Check Your Result!";
        emailBox.style.display = 'flex';
    });

    const viewResultAIME = document.getElementById('aime-button1'); // View Result AIME
    viewResultAIME.addEventListener('click', function() {
        setCategories(categoriesBtn3);
        isAIME = true;
        isAMC8 = false;
        headerMessage.textContent = "Check Your Result!";
        emailBox.style.display = 'flex';
    });

    const downloadCert8 = document.getElementById('amc8-button2'); // download cert. AMC 8
    downloadCert8.addEventListener('click', function() {
        setCategories(categoriesBtn2);
        isAMC8 = true;
        isAIME = false;
        const headerMessage = document.getElementById('headerMessage');
        headerMessage.textContent = "Download Your Certificate!";
        emailBox.style.display = 'flex';
    });

    const downloadCertAIME = document.getElementById('aime-button2'); // download cert. AIME
    downloadCertAIME.addEventListener('click', function() {
        setCategories(categoriesBtn3);
        isAIME = true;
        isAMC8 = false;
        const headerMessage = document.getElementById('headerMessage');
        headerMessage.textContent = "Download Your Certificate!";
        emailBox.style.display = 'flex';
    });

    // CLOSE MODAL BUTTON FOR RESULT/CERTIFICATE
    function closeEmailModal() {
        emailBox.style.display = 'none';
        document.getElementById("categorySelect").selectedIndex = 0;
        document.getElementById("categorySelect").style.color = "#999";
    }
    closeBox.addEventListener('click', closeEmailModal);
    const closeEmailModalBtn = document.getElementById('closeEmailModal');
    if (closeEmailModalBtn) {
        closeEmailModalBtn.addEventListener('click', closeEmailModal);
    }

    // DOWNLOAD CERTIFICATE BUTTON
    downloadCert.addEventListener('click', function() {
        const headerMessage = document.getElementById('headerMessage');
        headerMessage.textContent = "Download Your Certificate!";
        emailBox.style.display = 'flex';

    });

    // SPINNER FUNCTIONS / ANIMATIONS. DONT TOUCH!
    function showSpinner() {
        loadingOverlay2.style.display = 'flex';
        const spinner = loadingOverlay2.querySelector('.spinner');
        spinner.style.display = 'flex'; 
        requestAnimationFrame(() => {
            loadingOverlay2.classList.add('active'); // smooth fade in
        });
    }
    function hideSpinnerKeepBackground() {
        const spinner = loadingOverlay2.querySelector('.spinner');
        spinner.style.display = 'none'; 
    }
    function resetSpinner() {
        loadingOverlay2.style.display = 'none';
        loadingOverlay2.classList.remove('active');
        const spinner = loadingOverlay2.querySelector('.spinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
        void loadingOverlay2.offsetWidth; 
    }


    function fetchWithTimeout(url, options = {}, timeout = 6000) {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("timeout")), timeout)
            )
        ]);
    }

    const BACKEND_BASE_URL = "https://competition-backend-1-zd68.onrender.com";

    function keepBackendAwake() {
        setInterval(() => {
            fetch(`${BACKEND_BASE_URL}/health`)
            .then(res => {
                if (res.ok) console.log("✅ Backend ping successful");
                else console.warn("⚠️ Backend ping returned error:", res.status);
            })
            .catch(err => console.error("⚠️ Ping failed:", err));
        }, 5 * 60 * 1000); // 10 minutes
    }

        // Call it once when page loads
    keepBackendAwake();

    // FETCH STUDENT INFO FROM BACKEND RENDER
    async function updateStudentInfo(firstName, lastName, dob, email, category) {
        const data = { firstName, lastName, dob, email, category};
        try {
            const response = await fetchWithTimeout(
                `${BACKEND_BASE_URL}/check-result`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                },
                6000 // timeout after 6 seconds
            );
            const result = await response.json();

            if (result.success) {
                const student = result.student;
                tempFirstName    = student.firstName;
                tempLastName     = student.lastName;
                tempFullName     = student.fullName;
                tempEmail        = student.email;
                tempDob          = student.dob;
                tempCategory     = student.category;
                tempResult       = student.result;
                tempCertificate  = student.certificate;
            } else {
                resetTempVariables();
                return null;
            }
        } catch (err) {
            errorText.textContent = "Server not responding. Please try again.";
            return null;
        }
    }



    /* CHECK RESULT / DOWNLOAD CERTIFICATE SUBMIT BUTTON */
    submitEmail.addEventListener('click', function() {
        /* VIEW RESULT */
        if(headerMessage.textContent === "Check Your Result!") {
            const firstName = capitalize(document.getElementById('firstNameInput').value.trim());
            const lastName = capitalize(document.getElementById('lastNameInput').value.trim());
            const dob = document.getElementById('dobInput').value;
            const email = document.getElementById('emailInput').value.trim();
            const categorySelect = document.getElementById('categorySelect');
            const selectedCategory = categorySelect.value;
            if (!firstName) {
                showSpinner();
                setTimeout(() => {
                    hideSpinnerKeepBackground();
                    loadingOverlay2.style.display = 'none';
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please enter your given first name.";
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                    resetSpinner();
                });
                return;
            }
            if (!lastName) {
                showSpinner();
                setTimeout(() => {
                    hideSpinnerKeepBackground();
                    loadingOverlay2.style.display = 'none';
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please enter your given last name.";
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                    resetSpinner();
                });
                return;
            }
            if (!dob && !email) {
                showSpinner();
                setTimeout(() => {
                    hideSpinnerKeepBackground();
                    loadingOverlay2.style.display = 'none';
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please enter your birth date or email.";
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                    resetSpinner();
                });
                return;
            }
            if(!selectedCategory) {
                showSpinner();
                setTimeout(() => {
                    hideSpinnerKeepBackground();
                    loadingOverlay2.style.display = 'none';
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please select a category.";
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                    resetSpinner();
                });
                return;
            }
            
            async function showResult() {
                try {
                    resetTempVariables();
                    resetSpinner();
                    showSpinner();

                    await updateStudentInfo(firstName, lastName, dob, email, selectedCategory);


                    if (errorText.textContent === "Server not responding. Please try again.") {
                        showSpinner();
                        setTimeout(() => {
                            hideSpinnerKeepBackground();
                            loadingOverlay2.style.display = 'none';
                            errorBox.style.display = 'flex';
                            errorText.textContent = "Server not responding. Please refresh the page.";
                        }, 2000);
                        closeErrorBox.addEventListener('click', function() {
                            errorBox.style.display = 'none';
                        });
                    } else if (tempCategory === null) {
                        showSpinner();
                        setTimeout(() => {
                            hideSpinnerKeepBackground();
                            loadingOverlay2.style.display = 'none';
                            errorBox.style.display = 'flex';
                            errorText.textContent = "Unable to find contestant.";
                        }, 2000);
                        closeErrorBox.addEventListener('click', function() {
                            errorBox.style.display = 'none';
                        });
                        return;
                    } else {
                        setTimeout(() => {
                            hideSpinnerKeepBackground();
                            loadingOverlay2.style.display = 'none';
                            document.getElementById('emailBox').style.display = 'none';

                            showResultModal(tempFirstName, tempLastName, tempResult, tempCategory, isAMC8, isAIME);

                            categorySelect.selectedIndex = 0;
                            categorySelect.style.color = '#999';
                            
                        }, 1500);
                        document.querySelector('.close-result').addEventListener('click', () => {
                            document.getElementById('resultBox').style.display = 'none';
                            emailBox.style.display = 'none';
                        });
                    }
                } catch (err) {
                    return;
                }
            }
            showResult();
        
        
        /* DOWNLOAD CERTIFICATE*/
        } else {
            const firstName = capitalize(document.getElementById('firstNameInput').value.trim());
            const lastName = capitalize(document.getElementById('lastNameInput').value.trim());
            const dob = document.getElementById('dobInput').value;
            const email = document.getElementById('emailInput').value.trim();
            const categorySelect = document.getElementById('categorySelect');
            const selectedCategory = categorySelect.value;
            if (!firstName) {
                showSpinner();
                setTimeout(() => {
                    hideSpinnerKeepBackground();
                    loadingOverlay2.style.display = 'none';
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please enter your given first name.";
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                    resetSpinner();
                });
                return;
            }
            if (!lastName) {
                showSpinner();
                setTimeout(() => {
                    hideSpinnerKeepBackground();
                    loadingOverlay2.style.display = 'none';
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please enter your given last name.";
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                    resetSpinner();
                });
                return;
            }
            if (!dob && !email) {
                showSpinner();
                setTimeout(() => {
                    hideSpinnerKeepBackground();
                    loadingOverlay2.style.display = 'none';
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please enter your birth date or email.";
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                    resetSpinner();
                });
                return;
            }
            if(!selectedCategory) {
                showSpinner();
                setTimeout(() => {
                    hideSpinnerKeepBackground();
                    loadingOverlay2.style.display = 'none';
                    errorBox.style.display = 'flex';
                    errorText.textContent = "Please select a category.";
                }, 2000);
                closeErrorBox.addEventListener('click', function() {
                    errorBox.style.display = 'none';
                    resetSpinner();
                });
                return;
            }

            async function download() {
                try {
                    resetTempVariables();
                    resetSpinner();
                    showSpinner();

                    await updateStudentInfo(firstName, lastName, dob, email, selectedCategory);

                    if(errorText.textContent === "Server not responding. Please try again.") {
                        showSpinner();
                        setTimeout(() => {
                            hideSpinnerKeepBackground();
                            loadingOverlay2.style.display = 'none';
                            errorBox.style.display = 'flex';
                            errorText.textContent = "Server not responding. Please refresh the page.";
                        }, 2000);
                        closeErrorBox.addEventListener('click', function() {
                            errorBox.style.display = 'none';
                            loadingOverlay2.classList.remove('active');
                        });
                    } else if (tempCertificate === "" || tempCategory === null) {
                        showSpinner();
                        setTimeout(() => {
                            hideSpinnerKeepBackground();
                            loadingOverlay2.style.display = 'none';
                            errorBox.style.display = 'flex';
                            errorText.textContent = "Certificate has not been released yet.";
                        }, 2000);
                        closeErrorBox.addEventListener('click', function() {
                            errorBox.style.display = 'none';
                            loadingOverlay2.classList.remove('active');
                        });
                    } else {
                        setTimeout(() => {
                            hideSpinnerKeepBackground();
                            loadingOverlay2.style.display = 'none';
                            downloadCertificate();
                        }, 2000);
                    }
                } catch (err) {
                    return;
                } 
            };
            download();
        }
        
    });

    // CLOSE BUTTON FOR ALL ERROR MODALS
    document.getElementById('closeError').addEventListener('click', function() {
        document.getElementById('errorModal').style.display = 'none';

    });

    // SHOW RESULT / 150 MODAL
    function showResultModal(tempFirstName, tempLastName, tempResult, tempCategory, isAMC8, isAIME) {
        const modal = document.getElementById('resultBox');
        const name = document.getElementById('resultName');
        const messageText = document.getElementById('resultMessage');
        const scoreText = document.getElementById('resultText');
        const congratulationMessage = document.getElementById('resultCongratulation');

        if(isAMC8 == true) {
            congratulationMessage.textContent = 'Congratulations for completing AMC 8!';
            scoreText.textContent = tempResult + ' / 25';
        } else if(isAIME == true) {
            congratulationMessage.textContent = 'Congratulations for completing AIME!';
            scoreText.textContent = tempResult + ' / 15';
        } else {
            congratulationMessage.textContent = 'Congratulations for completing AMC!';
            scoreText.textContent = tempResult + ' / 150';
        }

        const passed = false;
        if(tempFirstName === "" || tempLastName === "") {
            name.textContent = tempFullName;
        } else {
            name.textContent = capitalize(tempFirstName) + " " + capitalize(tempLastName);
        }

        if (passed) {
            messageText.textContent = 'Congratulations for qualifying AIME!';
            setTimeout(() => {
                confetti({
                    particleCount: 300,
                    spread: 300,
                    origin: { y: 0.55 },
                    ticks: 350
                });

                // Move the canvas above modal
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    canvas.style.position = 'fixed';
                    canvas.style.top = '0';
                    canvas.style.left = '0';
                    canvas.style.zIndex = '10000';  // above modal
                    canvas.style.pointerEvents = 'none'; // allow clicks through canvas
                }
            }, 100);
            
        } else {
            if(isAMC8 == true || isAIME == true) {
                messageText.textContent = 'Category: ' + tempCategory + ' 2026';
            } else {
                messageText.textContent = 'Category: ' + tempCategory + ' 2025';
            }
            setTimeout(() => {
                confetti({
                    particleCount: 250,
                    spread: 300,
                    origin: { y: 0.55 },
                    ticks: 350
                });

                // Move the canvas above modal
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    canvas.style.position = 'fixed';
                    canvas.style.top = '0';
                    canvas.style.left = '0';
                    canvas.style.zIndex = '10000';  // above modal
                    canvas.style.pointerEvents = 'none'; // allow clicks through canvas
                }
            }, 100);
        }   
        modal.style.display = 'flex';
    };

    // FORMAT NAME
    function capitalize(name) {
        if (!name) return '';
        return name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }


    
    // LINK FROM RESULT MODAL TO DOWNLOAD CERTIFICATE MODAL
    document.getElementById("openCertLink").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("resultBox").style.display = "none";
        headerMessage.textContent = "Download Your Certificate!";
        document.getElementById("emailBox").style.display = "flex";
        resetSpinner();
    });

    /* ENQUIRY MODAL SET UP */
    document.querySelector("#enquiryModal .close-modal").onclick = function() {
        document.getElementById("enquiryForm").reset();
        document.getElementById("enquiryModal").style.display = "none";
    }


    /* EMAILJS FUNCTION */
    function sendEnquiryEmail() {
        let parms = {
            name: document.getElementById("enquiryName").value,
            email: document.getElementById("enquiryEmail").value,
            category: document.getElementById("enquiryCategory").value,
            message: document.getElementById("enquiryMessage").value
        };
        emailjs.send("service_8pruku7", "template_hkzn2pc", parms);
        event.preventDefault();
        
    }

    // SUBMIT & SEND ENQUIRY
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
            resetSpinner();
        }
    });
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("enquiryModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });



    /* DOWNLOAD CERTIFICATE WITH PROGRESS BAR */
    function downloadCertificate() {
        downloadOverlay.style.display = 'flex';
        downloadContainer.style.display = 'flex';
        const message = document.getElementById('downloadLabel');
        message.textContent = "Downloading...";

        progressBar.style.width = '0%'; // reset

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5; // uneven progress for realism
            if (progress >= 100) {
                progress = 100;
                setTimeout(() => {
                    message.textContent = "Download Complete!";
                }, 300);
                progress = 100;
                clearInterval(interval);

                // Trigger download
                const directLink = getDirectDriveLink(tempCertificate);
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
                }, 3800);
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

    
    /* SINGLE PAGE NAVIGATION / REVEAL */
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const topBar = document.querySelector('.top-bar');
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');
    const navOverlay = document.getElementById('navOverlay');
    const contactTrigger = document.querySelector('.contact-nav');

    function closeMobileNav() {
        if (!siteNav || !navToggle || !navOverlay) return;
        siteNav.classList.remove('is-open');
        navOverlay.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    function openMobileNav() {
        if (!siteNav || !navToggle || !navOverlay) return;
        siteNav.classList.add('is-open');
        navOverlay.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = siteNav && siteNav.classList.contains('is-open');
            if (isOpen) closeMobileNav();
            else openMobileNav();
        });
    }
    if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);

    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (!targetSection) return;
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            closeMobileNav();
        });
    });

    if (contactTrigger) {
        contactTrigger.addEventListener('click', () => {
            document.getElementById('enquiryModal').style.display = 'flex';
            closeMobileNav();
        });
    }

    const homeButton = document.querySelector('.home-button');
    const aboutLearnBtn = document.querySelector('.about-learn-btn');
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            const targetSection = document.getElementById('amc8Section');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if (aboutLearnBtn) {
        aboutLearnBtn.addEventListener('click', () => {
            closeMobileNav();
        });
    }

    document.querySelectorAll('.reveal-section').forEach((section) => {
        section.classList.add('is-visible');
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            navItems.forEach((nav) => {
                nav.classList.toggle('active', nav.getAttribute('data-target') === id);
            });
        });
    }, { threshold: 0.35, rootMargin: "-10% 0px -45% 0px" });
    document.querySelectorAll('main section[id]').forEach(sec => sectionObserver.observe(sec));

    if (topBar) {
        const updateTopBarState = () => {
            topBar.classList.toggle('scrolled', window.scrollY > 4);
        };
        updateTopBarState();
        window.addEventListener('scroll', updateTopBarState, { passive: true });
    }

    
});