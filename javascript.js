jQuery.noConflict();
jQuery(document).ready(function ($) {
  // VARIABLES
  let showAnswersCounter = 0;
  let wrongAnswer = false;

  // IMPORT WORDS FOR THE GAME
  $.ajax({
    type: "GET",
    url: "answers.json",
    success: function (response) {
      let answers = response.words;
      shuffle(answers);
      $(answers).each(function (index, data) {
        $(".possible-answers").append(
          $(
            `<div class="answer-option" data-season="${data.season}">${data.word}</div>`
          ).on("mousedown", StickElement)
        );
      });
    },
  });

  //        ---- EVENTS ----

  //- ANSWER BOX EVENTS -

  // Append answer element to the box on mouseup event over it
  $(".answer-box").on("mouseup", function (e) {
    if (!$(".sticky").hasClass("sticky")) return;
    if (!$(this).hasClass("answer-box")) return;
    // Add class to drop the element later
    $(".sticky").addClass("dropped");
    let elem = $(".sticky").clone().removeClass("sticky dropped");
    $(this).append($(elem).on("mousedown", StickElement));
  });

  // Add css scale transformation when hovering over the element
  $(".answer-box")
    .on("mouseover", function () {
      if ($(".sticky").hasClass("sticky")) {
        $(this).css("transform", "scale(1.05)");
      }
    })
    .on("mouseup", function () {
      $(this).css("transform", "scale(1)");
    })
    .on("mouseleave", function () {
      $(this).css("transform", "scale(1)");
    });

  // Scroll horizontally on mouse wheel scroll
  $(".answer-box").on("wheel", function (e) {
    e.preventDefault();
    this.scrollLeft += e.originalEvent.wheelDeltaY;
  });

  //- ACTIONS EVENTS -

  // Refresh Answers
  // Place all answers back in the possible answers element
  $(".refresh-answers").on("click", function () {
    $(".answer-option").each(function () {
      $(this).detach();
      $(".possible-answers").append(this);
      $(this).removeClass("correct-color wrong-color");
    });
  });

  // Confirm Choices
  // Checks if the answers are in the correct boxes
  $(".confirm-selection").on("click", function () {
    wrongAnswer = false;
    $(".answer-option").each(CheckCorrectAnswers);
    if (wrongAnswer) showAnswersCounter++;
    if (showAnswersCounter > 1) {
      $(".show-answers").css("visibility", "visible");
      $(".show-answers").css("opacity", "1");
      showAnswersCounter = 0;
    }
  });

  // Show Answers
  // Places the answers in their correct box elements
  $(".show-answers").on("click", function () {
    wrongAnswer = false;
    $(".answer-box").each(function () {
      let box = $(this);
      $(".answer-option")
        .each(function () {
          if ($(this).data("season") === $(box).data("season")) {
            $(this).detach();
            $(box).append($(this));
          }
        })
        .each(CheckCorrectAnswers);
    });
  });

  // CHANGE THEMES

  $(".theme-container").on("change", function () {
    if ($(this).find(":selected").val() === "Theme-2") {
      $("body").get(0).style.setProperty("--primary", "rgb(63, 207, 152)");
      $("body").get(0).style.setProperty("--secondary", "rgb(81, 246, 152)");
      $("body").get(0).style.setProperty("--highlight", "rgb(245, 255, 250)");
    } else {
      $("body").get(0).style.setProperty("--primary", "rgb(253, 178, 89)");
      $("body").get(0).style.setProperty("--secondary", "rgb(230, 172, 96)");
      $("body").get(0).style.setProperty("--highlight", "rgb(248, 243, 199)");
    }
  });

  //        ---- FUNCTIONS ----

  function CheckCorrectAnswers() {
    if ($(this).data("season") === $(this).parent().data("season")) {
      $(this).removeClass("wrong-color");
      $(this).addClass("correct-color");
    } else {
      $(this).removeClass("correct-color");
      $(this).addClass("wrong-color");
      wrongAnswer = true;
    }
  }

  // Stick the selected answer to the mouse coordinates
  function MousePositionCords(e) {
    jQuery(".sticky").css("top", `${e.pageY - 40}px`);
    jQuery(".sticky").css("left", `${e.pageX - 50}px`);
  }

  // Logic for dragging and dropping answer element to other boxes
  function StickElement(e) {
    let parentNode = $(this).parent();
    let stickElem = $(this).detach();
    $("body").append(this);
    $(this).addClass("sticky");
    $(document).mousemove(MousePositionCords);
    $("body").css("cursor", "pointer");
    $(document).mouseup(function () {
      if ($(".sticky").hasClass("dropped")) {
        $(".sticky").remove();
      } else {
        $(".sticky").toggleClass("sticky");
        $(parentNode).append(stickElem);
      }
      $("body").css("cursor", "default");
      $(document).off("mousemove", MousePositionCords);
      $(document).off();
    });
  }

  // Shuffle Array
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
});
