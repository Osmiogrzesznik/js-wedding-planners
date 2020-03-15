try {
    lo = function(x) { console.log(x); }
    var TIMEOUT = 6000;
    TOUCHING_DEVICE = false;
    var presentationInterval = setInterval(ChangeSlide, TIMEOUT);
    window.addEventListener("load", prepareCarouselSlider);

    function prepareCarouselSlider() {
        // converting NodeCollection to global array of all radio buttons
        AllRadioBtns = [].slice.call(document.querySelectorAll('input[class*="carousel-pos-radio"]'));

        AllRadioBtns.forEach(function(radio) {
            radio.addEventListener("click", stopPresentation); //stop on user action
        })
    }

    function ChangeSlide(backward) {
        //get active radio
        var currentActiveRadioBtn = document.querySelector('input[class*="carousel-pos-radio"]:checked');
        //get its index in array of all radios
        var currentSlideIndex = AllRadioBtns.indexOf(currentActiveRadioBtn);
        var radiosLength = AllRadioBtns.length;
        //loop back to first/last slide (circular behaviour)
        if (backward) {
            if (currentSlideIndex <= 0) {
                AllRadioBtns[radiosLength - 1].checked = true;
            } else {
                currentActiveRadioBtn.previousElementSibling.checked = true;
                currentActiveRadioBtn.checked = false;
            }
        } else {
            if (currentSlideIndex >= radiosLength - 1) {
                AllRadioBtns[0].checked = true;
            } else {
                currentActiveRadioBtn.nextElementSibling.checked = true;
                currentActiveRadioBtn.checked = false;
            }
        }
    }

    function stopPresentation() {
        clearInterval(presentationInterval);
    }

    // SWipe detection - utilised small framework Hammer.js
    h = new Hammer(document.querySelector(".css-carousel-wrapper"), {});

    h.on("swipeleft", function(x) {
        clearInterval(presentationInterval);
        ChangeSlide();
    });
    h.on("swiperight", function(x) {
        clearInterval(presentationInterval);
        ChangeSlide(true);
    });


    // -------------------------------- ACCESSIBILITY MODE -----------------------------------------------

    AccessibilityModeOn = false;

    window.addEventListener('touchstart', function onFirstTouchOnly() {
        window.TOUCHING_DEVICE = true;
        window.removeEventListener('touchstart', onFirstTouchOnly, false);
    }, false);

    function toggleAccessibilityMode(AccessibilityButton) {

        AccessibilityModeOn = !AccessibilityModeOn;
        if (AccessibilityModeOn === true) {
            AccessibilityButton.innerText = "Accessibility On";
            //set up handlers depending on device type
            Eventtype = TOUCHING_DEVICE ? "touchstart" : "mouseover";
            EventHandler = TOUCHING_DEVICE ? onGestureSpeechReadClick : onGestureSpeechRead; // touch devices cannot hover
            //speak this fragment only on touch devices
            speak(`Accessibility Mode activated. ${TOUCHING_DEVICE ? " click items again to follow links." : ""}`);
            window.addEventListener(Eventtype, EventHandler, false);
            stopPresentation();
            //change stylesheet to high contrast
            var mainStyle = document.getElementsByTagName("link").namedItem("mainStyle");
            mainStyle.href = "AccessibilitysplashCarousel.css";
        } else {

            AccessibilityButton.innerText = "Accessibility Off";
            speak("Accessibility Mode deactivated");
            var mainStyle = document.getElementsByTagName("link").namedItem("mainStyle");
            mainStyle.href = "splashCarousel.css";
            window.removeEventListener(EventHandler, EventHandler, false);
        }
    }

    currentSpokenTargetTXT = "";

    function onGestureSpeechRead(ev) {
        if (ev.target.innerText != currentSpokenTargetTXT) {
            ev.preventDefault();
            currentSpokenTargetTXT = ev.target.innerText;
            lo(ev.target.innerText);
            speak(ev.target.innerText);
            return false;
        }
        return true;
    }

    function onGestureSpeechReadCLick(ev) {

        clicking = onGestureSpeechRead(ev);
        if (clicking) {
            speak("click");
        }

    }

    function onGestureSpeechReadClick(ev) {
        if (ev.target.innerText != currentSpokenTargetTXT) {
            currentSpokenTargetTXT = ev.target.innerText;
            speak(ev.target.innerText);
        } else {
            speak("click");
        }
    }

    function speak(text) {
        console.log("Speaking: " + text)
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        su = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(su);

    }
} catch (e) {
    malert(e);
}