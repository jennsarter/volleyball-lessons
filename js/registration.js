document.addEventListener("DOMContentLoaded", function () {

  const slots = document.querySelectorAll(".slot.available");
  const selectedSession = document.getElementById("selectedSession");
  const selectedDay = document.getElementById("selectedDay");
  const selectedTime = document.getElementById("selectedTime");

  const sundayNotice = document.getElementById("sundayNotice");
  const sessionCost = document.getElementById("sessionCost");
  const registrationForm = document.getElementById("registrationForm");

  let currentDay = "";
  let currentTime = "";


  /*
   * FPO PRICING
   *
   * Replace these values later with your actual prices.
   */

  const prices = {
    "1:1": 75,
    "2:1": 45,
    "3:1": 35,
    "4:1": 30,
    "Larger Group": 0
  };


  /*
   * SLOT SELECTION
   */

  slots.forEach(function (slot) {

    slot.addEventListener("click", function () {

      slots.forEach(function (otherSlot) {
        otherSlot.classList.remove("selected");
      });

      slot.classList.add("selected");

      currentDay = slot.dataset.day;
      currentTime = slot.dataset.time;

      selectedDay.value = currentDay;
      selectedTime.value = currentTime;

      selectedSession.textContent =
        currentDay + " • " + currentTime;


      /*
       * Sunday lessons have a different
       * registration/payment workflow.
       */

      if (currentDay === "Sunday") {

        sundayNotice.hidden = false;

      } else {

        sundayNotice.hidden = true;

      }

    });

  });


  /*
   * TRAINING FORMAT / COST
   */

  const formatOptions =
    document.querySelectorAll('input[name="format"]');

  formatOptions.forEach(function (option) {

    option.addEventListener("change", function () {

      const format = option.value;

      if (format === "Larger Group") {

        sessionCost.textContent = "CONTACT";

      } else {

        sessionCost.textContent =
          "$" + prices[format] + " / SESSION";

      }

    });

  });


  /*
   * FORM SUBMISSION
   *
   * This is currently a demonstration.
   *
   * Later we will connect this to Google Apps Script
   * so registrations are securely recorded and
   * unavailable slots are protected from double booking.
   */

  registrationForm.addEventListener("submit", function (event) {

    event.preventDefault();


    /*
     * Make sure a lesson time was selected.
     */

    if (!currentDay || !currentTime) {

      alert(
        "Please select an available lesson time before submitting."
      );

      return;

    }


    /*
     * Get selected training format.
     */

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


    /*
     * Get confirmation elements.
     */

    const confirmation =
      document.getElementById("confirmation");

    const confirmationMessage =
      document.getElementById("confirmationMessage");


    /*
     * Sunday message.
     */

    if (currentDay === "Sunday") {

      confirmationMessage.textContent =
        "Your Sunday session request has been received. " +
        "FPO — Please contact the Sunday registration contact " +
        "to confirm your time and arrange payment.";

    } else {

      confirmationMessage.textContent =
        "Your registration request for " +
        currentDay +
        " at " +
        currentTime +
        " has been received. " +
        "FPO — Payment will be arranged directly with the coach.";

    }


    /*
     * Hide the form and show confirmation.
     */

    registrationForm.style.display = "none";

    confirmation.hidden = false;

    confirmation.scrollIntoView({
      behavior: "smooth"
    });

  });

});
