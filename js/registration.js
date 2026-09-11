document.addEventListener("DOMContentLoaded", function () {

  const slots = document.querySelectorAll(".slot.available");
  const clinics = document.querySelectorAll(".clinic-card.available");

  const selectedSession =
    document.getElementById("selectedSession");

  const selectedType =
    document.getElementById("selectedType");

  const selectedDay =
    document.getElementById("selectedDay");

  const selectedDate =
    document.getElementById("selectedDate");

  const selectedTime =
    document.getElementById("selectedTime");

  const selectedLocation =
    document.getElementById("selectedLocation");

  const selectedClinic =
    document.getElementById("selectedClinic");

  const sundayNotice =
    document.getElementById("sundayNotice");

  const clinicNotice =
    document.getElementById("clinicNotice");

  const sessionCost =
    document.getElementById("sessionCost");

  const registrationForm =
    document.getElementById("registrationForm");

  const privateTrainingOptions =
    document.getElementById("privateTrainingOptions");


  let currentType = "";
  let currentDay = "";
  let currentDate = "";
  let currentTime = "";
  let currentLocation = "";
  let currentClinic = "";
  let currentPrice = "";


  /*
   * PRIVATE TRAINING PRICING
   *
   * Replace these values with your actual prices.
   */

  const prices = {
    "1:1": 75,
    "2:1": 45,
    "3:1": 35,
    "4:1": 30,
    "5:1": 27,
    "6:1": 25
  };


  /*
   * CLEAR CURRENT SELECTION
   */

  function clearSelections() {

    slots.forEach(function (slot) {
      slot.classList.remove("selected");
    });

    clinics.forEach(function (clinic) {
      clinic.classList.remove("selected");
    });

  }


  /*
   * UPDATE FORM VISIBILITY
   */

  function updateFormForType() {

    const isClinic = currentType === "clinic";

    privateTrainingOptions.hidden = isClinic;

    clinicNotice.hidden = !isClinic;

    if (isClinic) {

      document
        .querySelectorAll('input[name="format"]')
        .forEach(function (input) {
          input.checked = false;
          input.required = false;
        });

      sessionCost.textContent =
        currentPrice || "FPO";

    } else {

      document
        .querySelectorAll('input[name="format"]')
        .forEach(function (input) {
          input.required = true;
        });

      sessionCost.textContent = "SELECT FORMAT";

    }

  }


  /*
   * PRIVATE LESSON SELECTION
   */

  slots.forEach(function (slot) {

    slot.addEventListener("click", function () {

      clearSelections();

      slot.classList.add("selected");

      currentType =
        slot.dataset.type || "lesson";

      currentDay =
        slot.dataset.day || "";

      currentDate =
        slot.dataset.date || "";

      currentTime =
        slot.dataset.time || "";

      currentLocation =
        slot.dataset.location || "";

      currentClinic = "";

      currentPrice = "";


      selectedType.value = currentType;
      selectedDay.value = currentDay;
      selectedDate.value = currentDate;
      selectedTime.value = currentTime;
      selectedLocation.value = currentLocation;
      selectedClinic.value = "";


      selectedSession.textContent =
        currentDay +
        " • " +
        currentDate +
        " • " +
        currentTime;


      /*
       * Sunday lessons have a separate workflow.
       */

      if (currentDay === "Sunday") {

        sundayNotice.hidden = false;

      } else {

        sundayNotice.hidden = true;

      }


      updateFormForType();

    });

  });


  /*
   * CLINIC SELECTION
   */

  clinics.forEach(function (clinic) {

    clinic.addEventListener("click", function () {

      clearSelections();

      clinic.classList.add("selected");

      currentType = "clinic";

      currentDay = "";

      currentDate =
        clinic.dataset.date || "";

      currentTime =
        clinic.dataset.time || "";

      currentLocation =
        clinic.dataset.location || "";

      currentClinic =
        clinic.dataset.clinic || "";

      currentPrice =
        clinic.dataset.price || "FPO";


      selectedType.value = currentType;
      selectedDay.value = "";
      selectedDate.value = currentDate;
      selectedTime.value = currentTime;
      selectedLocation.value = currentLocation;
      selectedClinic.value = currentClinic;


      selectedSession.textContent =
        currentClinic +
        " • " +
        currentDate +
        " • " +
        currentTime;


      sundayNotice.hidden = true;

      updateFormForType();

    });

  });


  /*
   * PRIVATE TRAINING FORMAT / COST
   */

  const formatOptions =
    document.querySelectorAll(
      'input[name="format"]'
    );


  formatOptions.forEach(function (option) {

    option.addEventListener("change", function () {

      if (currentType === "clinic") {
        return;
      }

      const format = option.value;

      if (prices[format] !== undefined) {

        sessionCost.textContent =
          "$" +
          prices[format] +
          " / SESSION";

      }

    });

  });


  /*
   * FORM SUBMISSION
   *
   * This currently demonstrates the registration flow.
   *
   * The final version will POST the form to Google Apps Script.
   * That backend will:
   *
   * 1. Save the registration privately.
   * 2. Check whether the selected lesson is still available.
   * 3. Prevent double booking.
   * 4. Track clinic enrollment.
   * 5. Automatically cap clinics at six players.
   */

  registrationForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      /*
       * Make sure a lesson or clinic was selected.
       */

      if (!currentType) {

        alert(
          "Please select an available lesson or clinic before submitting."
        );

        return;

      }


      /*
       * Private lesson requires a format.
       */

      if (currentType === "lesson") {

        const selectedFormat =
          document.querySelector(
            'input[name="format"]:checked'
          );


        if (!selectedFormat) {

          alert(
            "Please select a training format."
          );

          return;

        }

      }


      /*
       * Confirmation elements.
       */

      const confirmation =
        document.getElementById("confirmation");

      const confirmationMessage =
        document.getElementById(
          "confirmationMessage"
        );


      /*
       * Sunday confirmation.
       */

      if (
        currentType === "lesson" &&
        currentDay === "Sunday"
      ) {

        confirmationMessage.textContent =
          "Your Sunday session request has been received. " +
          "You will receive instructions for contacting the " +
          "Sunday registration contact to confirm your time " +
          "and arrange payment.";

      }


      /*
       * Clinic confirmation.
       */

      else if (currentType === "clinic") {

        confirmationMessage.textContent =
          "Your registration request for the " +
          currentClinic +
          " has been received. " +
          "The clinic is capped at six players and you will " +
          "receive confirmation of your spot and payment instructions.";

      }


      /*
       * Regular lesson confirmation.
       */

      else {

        const selectedFormat =
          document.querySelector(
            'input[name="format"]:checked'
          );


        confirmationMessage.textContent =
          "Your registration request for " +
          currentDay +
          " at " +
          currentTime +
          " has been received. " +
          "Payment will be arranged directly with Coach Jenn.";

      }


      /*
       * Hide form and show confirmation.
       */

      registrationForm.style.display =
        "none";

      confirmation.hidden = false;

      confirmation.scrollIntoView({
        behavior: "smooth"
      });

    }
  );

});
