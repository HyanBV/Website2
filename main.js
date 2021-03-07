// Navigation Menu...

(() => {
    const hBtn = document.querySelector(".hamburger-btn"),
    navMenu = document.querySelector(".nav-menu"),
    closeNavBtn = navMenu.querySelector(".close-nav-menu");

    hBtn.addEventListener("click", showNavMenu);
    closeNavBtn.addEventListener("click", hideNavMenu);

    function showNavMenu() {
        navMenu.classList.add("open");
        bodyScrollingToggle();
    }

    function hideNavMenu() {
        navMenu.classList.remove("open");
        fadeOutEffect();
        bodyScrollingToggle();
    }

    function fadeOutEffect() {
        document.querySelector(".fade-out-effect").classList.add("active");
        setTimeout(() => {
            document.querySelector(".fade-out-effect").classList.remove("active");
        }, 300)
    }

    //Attach An Event Handler To Document.
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("link-item")) {

            //Make Sure event.target.hash Has A Value Before Overriding Default Behaviour.
            if (event.target.hash !== "") {

                //Prevent Default Anchor Click Behaviour.
                event.preventDefault();
                const hash = event.target.hash;

                //Deactivate Existing Active 'section'.
                document.querySelector(".section.active").classList.add("hide");
                document.querySelector(".section.active").classList.remove("active");

                //Activate New 'section'.
                document.querySelector(hash).classList.add("active");
                document.querySelector(hash).classList.remove("hide");

                //Deactivate Existing Active Navigation Menu 'link-item'.
                navMenu.querySelector(".active").classList.add("OS", "HIS");
                navMenu.querySelector(".active").classList.remove("active", "IS");
                
                //If Clicked 'link-item' Is Contained Within The Navigation Menu.
                if (navMenu.classList.contains("open")) {
                    //Activate New Navigation Menu 'link-item'.
                    event.target.classList.add("active", "IS");
                    event.target.classList.remove("OS", "HIS");

                    //Hide Navigation Menu.
                    hideNavMenu();
                } else {
                    let navItems = navMenu.querySelectorAll(".link-item");
                    navItems.forEach((item) => {
                        if (hash === item.hash) {

                            //Activate New Navigation Menu 'link-item'
                            item.classList.add("active", "IS");
                            item.classList.remove("OS", "HIS");
                        }
                    })
                    fadeOutEffect();
                }
                //Add Hash (#) To Url.
                window.location.hash = hash;
            }
        }
    })

})();


// About Section Tabs...

(() => {
    const aboutSection = document.querySelector(".about"),
    tabsContainer = document.querySelector(".about-tabs");

    tabsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("tab-item") && 
        !event.target.classList.contains("active")) {
            const target = event.target.getAttribute("data-target");

            //Deactivating existing active 'tab-item'
            tabsContainer.querySelector(".active").classList.remove("OS", "active");

            //Activating new 'tab-item'
            event.target.classList.add("active", "OS");

            //Deactivating existing active 'tab-content'
            aboutSection.querySelector(".tab-content.active").classList.remove("active");

            //Activating new 'tab-content'
            aboutSection.querySelector(target).classList.add("active");
        }
    })
})();

function bodyScrollingToggle() {
    document.body.classList.toggle("hidden-scrolling");
}


// Portfolio Filter & Popup...

(() => {
    
    const filterContainer = document.querySelector(".portfolio-filter"),
    portfolioItemsContainer = document.querySelector(".portfolio-items"),
    portfolioItems = document.querySelectorAll(".portfolio-item"),
    popup = document.querySelector(".portfolio-popup"),
    prevBtn = popup.querySelector(".pp-prev"),
    nextBtn = popup.querySelector(".pp-next"),
    closeBtn = popup.querySelector(".pp-close"),
    projectDetailsContainer = popup.querySelector(".pp-details"),
    projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
    let itemIndex, slideIndex, screenshots;

    //Filtering Portfolio Items...
    filterContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("filter-item") && 
        !event.target.classList.contains("active")) {

            //Deactivating Existing Active 'filter-item'
            filterContainer.querySelector(".active").classList.remove("OS", "active");

            //Activating New 'filter-item'
            event.target.classList.add("active", "OS");
            const target = event.target.getAttribute("data-target");
            portfolioItems.forEach((item) => {
                if (target === item.getAttribute("data-category") || target === 'all') {
                    item.classList.remove("hide");
                    item.classList.add("show");
                } else {
                    item.classList.remove("show");
                    item.classList.add("hide");
                }
            })
        }
    })

    portfolioItemsContainer.addEventListener("click", (event) => {
        if (event.target.closest(".PII")) {
            const portfolioItem = event.target.closest(".PII").parentElement;

            //Getting the portfolioItem index.
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
            screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img").getAttribute("data-screenshots");

            //Convert screenshots Into Array.
            screenshots = screenshots.split(",");
            if (screenshots.length === 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            } else {
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
            }
            slideIndex = 0;
            popupToggle();
            popupSlideShow();
            popupDetails();
        }
    })

    closeBtn.addEventListener("click", () => {
        popupToggle();
        if (projectDetailsContainer.classList.contains("active")) {
            popupDetailsToggle();
        }
    })

    function popupToggle() {
        popup.classList.toggle("open");
        bodyScrollingToggle();
    }

    function popupSlideShow() {
        const imgSrc = screenshots[slideIndex],
        popupImg = popup.querySelector(".pp-img");

        //Activating Loader Until The popupImg Loads.
        popup.querySelector(".pp-loader").classList.add("active");
        popupImg.src = imgSrc;
        popupImg.onload = () => {

            //Deactivating Loader After The popupImg Loaded.
            popup.querySelector(".pp-loader").classList.remove("active");
        }
        popup.querySelector(".pp-counter").innerHTML = (slideIndex + 1) + " of " 
        + screenshots.length;
    }

    //Next Slide...
    nextBtn.addEventListener("click", () => {
        if (slideIndex === screenshots.length - 1) {
            slideIndex = 0;
        } else {
            slideIndex++;
        }
        popupSlideShow();
    })

    //Previous Slide...
    prevBtn.addEventListener("click", () => {
        if (slideIndex === 0) {
            slideIndex = screenshots.length - 1
        } else {
            slideIndex--;
        }
        popupSlideShow();
    })

    function popupDetails() {
        //If portfolio-item-details doesn't exist.
        if (! portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
            projectDetailsBtn.style.display = "none";
            return; //End Function Execution
        }
        projectDetailsBtn.style.display = "block";

        //Getting Project Details.
        const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;

        //Set Project Details.
        popup.querySelector(".pp-project-details").innerHTML = details;

        //Getting Project Title.
        const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;

        //Set Project Title.
        popup.querySelector(".pp-title h2").innerHTML = title;

        //Getting Project Category.
        const category = portfolioItems[itemIndex].getAttribute("data-category");

        //Set Project Category.
        popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");
    }

    projectDetailsBtn.addEventListener("click", () => {
        popupDetailsToggle();
    })

    function popupDetailsToggle() {
        if (projectDetailsContainer.classList.contains("active")) {
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");
            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight = 0 + "px";
        } else {
            projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
            projectDetailsBtn.querySelector("i").classList.add("fa-minus");
            projectDetailsContainer.classList.add("active");
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight 
            + "px";
            popup.scrollTo(0, projectDetailsContainer.offsetTop);
        }
    }

})();


// Testimonial Slider...

(() => {

    const sliderContainer = document.querySelector(".testi-slider-container"),
    slides = sliderContainer.querySelectorAll(".testi-item"),
    slideWidth = sliderContainer.offsetWidth,
    prevBtn = document.querySelector(".testi-slider-nav .prev"),
    nextBtn = document.querySelector(".testi-slider-nav .next"),
    activeSlide = sliderContainer.querySelector(".testi-item.active");
    let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide);

    //Set Width Of All Slides
    slides.forEach((slide) => {
        slide.style.width = slideWidth + "px";
    })

    //Set Width Of sliderContainer
    sliderContainer.style.width = slideWidth * slides.length + "px";

    nextBtn.addEventListener("click", () => {
        if (slideIndex === slides.length - 1) {
            slideIndex = 0;
        } else {
            slideIndex++;
        }
        sliderContainer.style.marginLeft = - (slideWidth * slideIndex) + "px";
        slider();
    })

    prevBtn.addEventListener("click", () => {
        if (slideIndex === 0) {
            slideIndex = slides.length - 1;
        } else {
            slideIndex--;
        }
        sliderContainer.style.marginLeft = - (slideWidth * slideIndex) + "px";
        slider();
    })

    function slider() {
        //Deactivate Existing Active Slides.
        sliderContainer.querySelector(".testi-item.active").classList.remove("active");

        //Activate New Slide.
        slides[slideIndex].classList.add("active");
        sliderContainer.style.marginLeft = - (slideWidth * slideIndex) + "px";
    }
    slider();

})();


// // Hide All Sections Except Active One...

// (() => {
//     const sections = document.querySelectorAll(".section");
//     sections.forEach((section) => {
//         if (! section.classList.contains("active")) {
//             section.classList.add("hide");
//         }
//     })
// })();

//Toggle Style Switcher...
const styleSwitcherToggler = document.querySelector(".style-switcher-toggler");

styleSwitcherToggler.addEventListener("click", () => {
    document.querySelector(".style-switcher").classList.toggle("open");
})

//Hide Style Switcher On Scroll...
window.addEventListener("scroll", () => {
    if (document.querySelector(".style-switcher").classList.contains("open")) {
        document.querySelector(".style-switcher").classList.remove("open");
    }
})

//Theme Colors...
const alternateStyles = document.querySelectorAll(".alternate-style");
function setActiveStyle(c) {
    alternateStyles.forEach((style) => {
        if (c === style.getAttribute("title")) {
            style.removeAttribute("disabled");
        } else {
            style.setAttribute("disabled", "true");
        }
    })
}

//Ligth & Dark Mode...
const dayNight = document.querySelector(".day-night");

dayNight.addEventListener("click", () => {
    dayNight.querySelector("i").classList.toggle("fa-sun");
    dayNight.querySelector("i").classList.toggle("fa-moon");
    document.body.classList.toggle("dark");
})

window.addEventListener("load", () => {
    if (document.body.classList.contains("dark")) {
        dayNight.querySelector("i").classList.add("fa-sun");
    } else {
        dayNight.querySelector("i").classList.add("fa-moon");
    }
})