jQuery.noConflict();
jQuery(document).ready(function ($) {
  // $("button").on("click", function () {
  //   $(".answer-option").toggleClass("test");
  // });

  // IMPORT WORDS FOR THE GAME
  // shuffle(JSON_WORDS);

  // let name = $.parseJSON(data)
  // console.log(name)


  // $.getJSON("answers.json", function (data) {
  //   let items = [];
  //   console.log(data);
  //   $.each(data, function (key, value) {
  //     items.push(
  //       `<div class="answer-option" data-season="${key}">${value}</div>`
  //     );
  //   });
  //   shuffle(items);
  //   $.each(items, function (item) {
  //     $(".possible-answers").append(item);
  //   });
  // }).fail(function () {
  //   console.log("An error has occurred.");
  // });

  // $(JSON_WORDS).each(function (key, value) {
  //   // $(".possible-answers").append(
  //   //   `<div class="answer-option" data-season="${value}">${key}</div>`
  //   // );
  //   console.log(key, value)
  // });

  let showAnswersCounter = 0;
  //        ---- EVENTS ----
  $(".answer-option").on("mousedown", StickElement);

  //- ANSWER BOX EVENTS -

  // Append answer element to the box on mouseup event over it
  $(".answer-box").on("mouseup", function (e) {
    if (!$(".sticky").hasClass("sticky")) return;
    if ($(this).hasClass("answer-option")) return;
    // Add class to drop the element later
    $(".sticky").addClass("dropped");
    let elem = $(".sticky").clone().removeClass("sticky");
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
    console.log(e.originalEvent.wheelDeltaY);
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
    $(".answer-option").each(CheckCorrectAnswers);
    showAnswersCounter++;
    if (showAnswersCounter > 1) {
      $(".show-answers").css("visibility", "visible");
      $(".show-answers").css("opacity", "1");
    }
  });

  // Show Answers
  // Places the answers in their correct box elements
  $(".show-answers").on("click", function () {
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

  //        ---- FUNCTIONS ----

  function CheckCorrectAnswers() {
    if ($(this).data("season") === $(this).parent().data("season")) {
      $(this).removeClass("wrong-color");
      $(this).addClass("correct-color");
      console.log(true);
    } else {
      $(this).removeClass("correct-color");
      $(this).addClass("wrong-color");
      console.log(false);
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
