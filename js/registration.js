document.addEventListener("DOMContentLoaded", function () {

  const lessonSlots = document.querySelectorAll(".slot.available");
  const selectedSession = document.getElementById("selected-session");
  const selectedSessionName = document.getElementById("selected-session-name");
  const selectedSessionDetails = document.getElementById("selected-session-details");

  const sessionType = document.getElementById("sessionType");
  const sessionDay = document.getElementById("sessionDay");
  const sessionDate = document.getElementById("sessionDate");
  const sessionTime = document.getElementById("sessionTime");
  const sessionLocation = document.getElementById("sessionLocation");
  const sessionClinic = document.getElementById("sessionClinic");
  const sessionPrice = document.getElementById("sessionPrice");

  const sundayNotice = document.getElementById("sunday-notice");
  const costAmount = document.getElementById("cost-amount");

  const playerCountOptions = document.querySelectorAll(
    'input[name="playerCount"]'
  );

  const additionalPlayerFields = document.getElementById(
    "additional-player-fields"
  );

  const registrationForm = document.getElementById(
    "registration-form-element"
  );

  /*
   * REGULAR PRIVATE LESSON PRICING
   *
   * Training rate per player:
   * 1 player = $50
   * 2 players = $35/player
   * 3 players = $35/player
   * 4 players = $25/player
   * 5 players = $25/player
   * 6 players = $25/player
   *
   * Victorium adds a $25 gym fee per session,
   * split among the registered players.
   */

  const regularTrainingPrices = {
    1: 50,
    2: 35,
    3: 35,
    4: 25,
    5: 25,
    6: 25
  };

  const regularGymFee = 25;


  /*
   * SUNDAY PRIVATE LESSON PRICING
   *
   * Sunday lessons are at Archway Scottsdale.
   * Facility fee is already included.
   */

  const sundayPrices = {
    1: 70,
    2: 50,
    3: 40,
    4: 35,
    5: 30,
    6: 30
  };


  /*
   * KEEP TRACK OF THE SELECTED LESSON
   */

  let selectedLesson = null;


  /*
   * LESSON SELECTION
   */

  lessonSlots.forEach(function (slot) {

    slot.addEventListener("click", function () {

      selectedLesson = slot;

      const day = slot.dataset.day || "";
      const date = slot.dataset.date || "";
      const time = slot.dataset.time || "";
      const location = slot.dataset.location || "";
      const isSunday = slot.dataset.sunday === "true";

      /*
       * Update selected-session display
       */

      if (selectedSession) {
        selectedSession.classList.add("active");
      }

      if (selectedSessionName) {
        selectedSessionName.textContent =
          date + " · " + time;
      }

      if (selectedSessionDetails) {

        let details = "";

        if (day) {
          details += day;
        }

        if (location) {
          if (details) {
            details += " · ";
          }

          details += location;
        }

        selectedSessionDetails.textContent = details;
      }


      /*
       * Update hidden form fields
       */

      if (sessionType) {
        sessionType.value = "lesson";
      }

      if (sessionDay) {
        sessionDay.value = day;
      }

      if (sessionDate) {
        sessionDate.value = date;
      }

      if (sessionTime) {
        sessionTime.value = time;
      }

      if (sessionLocation) {
        sessionLocation.value = location;
      }

      if (sessionClinic) {
        sessionClinic.value = "";
      }


      /*
       * Sunday pricing notice
       */

      if (sundayNotice) {

        if (isSunday) {

          sundayNotice.style.display = "block";

          sundayNotice.innerHTML =
            "<strong>Sunday registration:</strong> " +
            "Sunday private lessons at Archway Scottsdale have separate pricing, " +
            "with the facility fee already included. After submitting this form, " +
            "you will be directed to the appropriate contact for Sunday registration " +
            "and payment.";

        } else {

          sundayNotice.style.display = "none";
          sundayNotice.innerHTML = "";

        }
      }


      /*
       * Recalculate cost if player count
       * has already been selected.
       */

      updateCost();


      /*
       * Scroll to the selected lesson/form
       */

      if (selectedSession) {

        setTimeout(function () {

          selectedSession.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }, 100);

      }

    });

  });


  /*
   * CREATE ADDITIONAL PLAYER FIELDS
   *
   * Player 1 is the primary player already
   * entered in the PLAYER section.
   *
   * If 2 players are selected, create
   * Player 2.
   *
   * If 6 players are selected, create
   * Players 2–6.
   */

  function updateAdditionalPlayerFields() {

    if (!additionalPlayerFields) {
      return;
    }

    const selectedPlayerCount = document.querySelector(
      'input[name="playerCount"]:checked'
    );

    additionalPlayerFields.innerHTML = "";

    if (!selectedPlayerCount) {
      return;
    }

    const count = parseInt(
      selectedPlayerCount.value,
      10
    );


    for (let playerNumber = 2; playerNumber <= count; playerNumber++) {

      const fieldWrapper = document.createElement("div");

      fieldWrapper.className = "additional-player-field";


      const label = document.createElement("label");

      label.setAttribute(
        "for",
        "additional-player-" + playerNumber
      );

      label.textContent =
        "PLAYER " + playerNumber + " NAME";


      const input = document.createElement("input");

      input.type = "text";

      input.id =
        "additional-player-" + playerNumber;

      input.name =
        "additionalPlayer" + playerNumber;

      input.placeholder =
        "Player " + playerNumber + " full name";

      input.required = true;


      fieldWrapper.appendChild(label);

      fieldWrapper.appendChild(input);

      additionalPlayerFields.appendChild(
        fieldWrapper
      );

    }

  }


  /*
   * CALCULATE TOTAL COST
   */

  function updateCost() {

    if (!costAmount) {
      return;
    }

    const selectedPlayerCount = document.querySelector(
      'input[name="playerCount"]:checked'
    );

    if (!selectedPlayerCount || !selectedLesson) {

      costAmount.textContent = "$—";

      if (sessionPrice) {
        sessionPrice.value = "";
      }

      return;
    }


    const playerCount = parseInt(
      selectedPlayerCount.value,
      10
    );

    const isSunday =
      selectedLesson.dataset.sunday === "true";

    const location =
      selectedLesson.dataset.location || "";


    let total = 0;


    /*
     * SUNDAY
     */

    if (isSunday) {

      const pricePerPlayer =
        sundayPrices[playerCount];

      total =
        pricePerPlayer * playerCount;

    }


    /*
     * REGULAR LESSON
     */

    else {

      const trainingPrice =
        regularTrainingPrices[playerCount];

      total =
        trainingPrice * playerCount;


      /*
       * Victorium gym fee
       *
       * Player-Provided Location has no
       * gym fee.
       */

      if (
        location.toLowerCase() !==
        "player-provided location"
      ) {

        total += regularGymFee;

      }

    }


    /*
     * Update visible cost
     */

    const pricePerPlayer =
      total / playerCount;


    costAmount.textContent =
      "$" +
      pricePerPlayer.toFixed(2) +
      " / PLAYER · $" +
      total.toFixed(2) +
      " TOTAL";


    /*
     * Update hidden price field
     */

    if (sessionPrice) {
      sessionPrice.value =
        total.toFixed(2);
    }

  }


  /*
   * PLAYER COUNT CHANGES
   */

  playerCountOptions.forEach(function (option) {

    option.addEventListener("change", function () {

      updateAdditionalPlayerFields();

      updateCost();

    });

  });


  /*
   * FORM SUBMISSION
   *
   * This is currently a front-end confirmation.
   * It does not yet send registration information
   * to a private database or email service.
   */

  if (registrationForm) {

    registrationForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        /*
         * Make sure a lesson was selected.
         */

        if (!selectedLesson) {

          alert(
            "Please select an available lesson before submitting."
          );

          return;

        }


        /*
         * Make sure player count was selected.
         */

        const selectedPlayerCount =
          document.querySelector(
            'input[name="playerCount"]:checked'
          );


        if (!selectedPlayerCount) {

          alert(
            "Please select how many players you are registering."
          );

          return;

        }


        /*
         * Recalculate one final time
         * before submission.
         */

        updateCost();


        /*
         * Determine whether this is Sunday.
         */

        const isSunday =
          selectedLesson.dataset.sunday === "true";


        /*
         * Hide the form.
         */

        registrationForm.style.display =
          "none";


        /*
         * Show confirmation.
         */

        const confirmation =
          document.getElementById(
            "registration-confirmation"
          );


        if (confirmation) {

          confirmation.style.display =
            "block";


          const confirmationMessage =
            confirmation.querySelector(
              ".confirmation-message"
            );


          if (confirmationMessage) {

            if (isSunday) {

              confirmationMessage.innerHTML =
                "Your Sunday lesson request has been received. " +
                "Because Sunday lessons at Archway Scottsdale use separate " +
                "registration and payment arrangements, you will need to " +
                "complete those steps with the appropriate contact.";

            } else {

              confirmationMessage.innerHTML =
                "Your private lesson request has been received. " +
                "Coach Jenn will follow up with you to confirm the lesson " +
                "and arrange payment directly.";

            }

          }


          confirmation.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }
    );

  }

});
