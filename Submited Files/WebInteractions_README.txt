---- Interaction 1 - Seasons ----

- Assigments 1 to 4 are located in the seasons folder under a single index.html file.


Using ajax with a GET request we fetch the words from a answers.json file, this allows for adding aditional words if needed.

// Line 8 in seasons/javascript.js
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

----IIII----

A shuffle function to randomize the order of the elements.

// Line 155 in seasons/javascript.js
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

----IIII----

This event checks if the words are in their correct boxes.

// Line 72 in seasons/javascript.js
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

To check for wrong answers, the CheckCorrectAnswers() function compares the data attribute of
the answer element and the parent box element, and applies the correct styling depending on the correctnes of the answer.

// Line 116 in seasons/javascript.js
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

----IIII----

The event for reseting the answers back to the default box.
The code selects the answers element by class, detaches them and appends them as children to the ".possible-answers" box.

// Line 62 in seasons/javascript.js
$(".refresh-answers").on("click", function () {
    $(".answer-option").each(function () {
      $(this).detach();
      $(".possible-answers").append(this);
      $(this).removeClass("correct-color wrong-color");
    });
  });

----IIII----

Event that shows the correct amswers. The code loops over every box and then every element. If the data atributtes do not match the answer is detached and appended to the correct answer box.
After that a each() function is executed with a CheckCorrectAnswers() on every answer to give it correct styling.

// line 85 in seasons/javascript.js
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

----IIII----

Drag and Drop

A StickElement() function is applied to a answer element that gains a sticky class that allows it to be dragged.
If the element does not have the "dropped" class it is returned to the original parent element.

// Line 134 in seasons/javascript.js
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

A function is created on the document that tracks the mouse position while the user holds down the mouse button.

// Line 128 in seasons/javascript.js
function MousePositionCords(e) {
    jQuery(".sticky").css("top", `${e.pageY - 40}px`);
    jQuery(".sticky").css("left", `${e.pageX - 50}px`);
  }

If the mouseup event is triggerd over the ".answer-box", the element gets added a ".dropped" class.
The element is copied, the classes "sticky" and "dropped" removed from the copied element, and appended to the ".answer-box".

// Line 29 in seasons/javascript.js
$(".answer-box").on("mouseup", function (e) {
    if (!$(".sticky").hasClass("sticky")) return;
    if (!$(this).hasClass("answer-box")) return;
    // Add class to drop the element later
    $(".sticky").addClass("dropped");
    let elem = $(".sticky").clone().removeClass("sticky dropped");
    $(this).append($(elem).on("mousedown", StickElement));
  });

----IIII----

Event that changes themes, on the option element. When a value changes the code will change the values of the css variables to different colors.

// Line 102 in seasons/javascript.js
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

----IIII----

A hover effect for the answer boxes, that activates when a ".sticky" class is present in the document.

// Line 39 in seasons/javascript.js
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

----IIII----

A horizontal scroll that activates when the mouse wheel is scrolled. Changes the scrolling direction to horizontal.

// Line 53 in seasons/javascript.js
$(".answer-box").on("wheel", function (e) {
    e.preventDefault();
    this.scrollLeft += e.originalEvent.wheelDeltaY;
  });

----IIII----

The 3D model displays a tree, with a third party "ModelViewer" plugin.


---- Interaction 2 - Game Index ----


- Assigments 5 is located in the gameIndex folder under a index.html file.


getDataset() function fetches the specified json file and calls functions that populate the document.
every game genre and style is added to unique arrays that are later filtered so only unique elements remain.

// Line 10 in gameIndex/javascript.js
function GetDataset(datasetUrl) {
    $.ajax({
      type: "GET",
      url: datasetUrl,
      success: function (response) {
        responseData = response;
        let responseGenres = [];
        let responseStyles = [];
        // Push genres and styles to new array
        $.each(responseData, function (key, val) {
          responseGenres.push(val.genre);
          responseStyles.push(val.style);
        });
        const unique = (value, index, self) => {
          return self.indexOf(value) === index;
        };
        // Remove duplicate names
        const uniqueGenres = responseGenres.filter(unique);
        const uniqueStyles = responseStyles.filter(unique);
        // Populate the DOM with genre and style data
        SortResponseData(uniqueGenres, "genre");
        SortResponseData(uniqueStyles, "style");
        // Populate the games container with games from the dataset
        PopulateGames(responseData);
        // Empty the element to append new children
      },
    });
  }

----IIII----

After the genre and style data has been filtered to unique elements, SortResponseData() function appends them to the document.

// Line 39 in gameIndex/javascript.js
function SortResponseData(data, type) {
    // Empty the element to append new children
    $(`#${type}-checkboxes`).empty();
    // Populate the specified element
    $.each(data, function (index, val) {
      $(`#${type}-checkboxes`).append(
        `<label for="${type}-${index}" class="checkbox-label" data-${type}="${val}">
        ${val} <input type="checkbox" class="${type}-checkbox checkbox" id="${type}-${index}" />
            </label>`
      );
    });
  }

----IIII----

PopulateGames() applies a filter if it is provided, And calls the PopulateGameToDOM() function that populates the game to the document.
If a filter was provided only the games that pass the filter are added to the document throught the PopulateGameToDOM().
If no filter was provided every game gets appended to the document.

// Line 52 in gameIndex/javascript.js
function PopulateGames(rData, fData) {
    // Empty the element to append new children
    $(".games-container").empty();

    // Populate .games-container with new games
    $.each(rData, function (key, val) {
      // Filter the game if filter is provided
      if (fData) {
        // Check if a game name includes search term
        if (fData.searchTerm !== "") {
          let filterName = true;
          if (!key.toLowerCase().includes(fData.searchTerm.toLowerCase()))
            return;
          else filterName = false;
        }

        // Check if the game contains the selected genre
        if (fData.genres.length > 0) {
          let filterGenre = true;
          $.each(fData.genres, function (index, genre) {
            if (val.genre === genre) filterGenre = false;
          });
          if (filterGenre) return;
        }

        // Check if the game contains the selected styles
        if (fData.styles.length > 0) {
          let filterStyle = true;
          $.each(fData.styles, function (index, style) {
            if (val.style === style) filterStyle = false;
          });
          if (filterStyle) return;
        }
        PopulateGameToDOM(key, val);
      } else {
        PopulateGameToDOM(key, val);
      }
    });
  }

----IIII----

The PopulateGameToDOM() function appends the passed game info to the document.

// Line 92 in gameIndex/javascript.js
function PopulateGameToDOM(key, val) {
    // Populate game to DOM
    $(".games-container").append(
      `<div class="game-container">
          <img class="game-image-url" src="https://exordiumgames.com/jobs/frontend/${val.url}"/>
          <div class="game-info">
            <div class="game-name">${key}</div>
            <div class="game-info-holder">
              <div class="game-info-type">Genre:</div>
              <div class="game-genre"> ${val.genre}</div>
            </div>
            <div class="game-info-holder">
              <div class="game-info-type">Style:</div>
              <div class="game-style">${val.style}</div>
            </div>
          </div>
        </div>`
    );
  }

----IIII----

EnterKeySearch() allows to start the search with the enter key when the text input is in focus and a key is pressed.

// Line 122 in gameIndex/javascript.js
function EnterKeySearch(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      $(".search-button").click();
    }
  }

----IIII----

SearchFilter() function takes the data from the filter elements in the document, puts them in an object and passes them to the PopulateGames() function to
be used as a filter for the games.
After the function finishes and if the ".games-container" has no child elements a div element is appended that inform's the user how the query did not match any results.

// Line 129 in gameIndex/javascript.js
function SearchFilter() {
    let searchTerm = $(".search-box").val();
    let genres = [];
    let styles = [];
    $(".genre-checkbox").each(function () {
      if ($(this).is(":checked")) {
        genres.push($(this).parent().data("genre"));
      }
    });
    $(".style-checkbox").each(function (e) {
      if ($(this).is(":checked")) {
        styles.push($(this).parent().data("style"));
      }
    });

    let filteredData = { searchTerm, genres, styles };
    PopulateGames(responseData, filteredData);
    if ($(".games-container").children().length === 0) {
      $(".games-container").append(
        `<div>Your query did not match any results...</div>`
      );
    }

    $(".search-box").val("");
  }

----IIII----

ResetFilter() resets the checkboxes and text value to be unselected and empty, a default true value will also reset the games populating the document.
If false is passed the doucument wont repolulate, this is used when a new dataset is loaded.

// Line 156 in gameIndex/javascript.js
function ResetFilters(fullReset = true) {
    $("input:checkbox").prop("checked", false);
    $("input:text").val("");
    $(".genre-box").removeClass("filter-selected");
    $(".style-box").removeClass("filter-selected");
    if (fullReset) PopulateGames(responseData);
  }

----IIII----

ShowGenreCheckboxes() displays the genre list by setting its display to "none" or "flex". 
It is closed by the "click" event on the "body" element, by clicking on the genres label element or by clicking the style label element.
If the genre filter has any selected values it will recieve a class styling.

// Line 165 in gameIndex/javascript.js
function ShowGenreCheckboxes() {
    var checkboxes = $("#genre-checkboxes");
    if (!genreExpanded) {
      // If document has no event
      if ($._data(document.querySelector("body"), "events") === undefined) {
        $("body").on("click", bodyGenreCheckboxToggle);
        // Shows the list of genres
        checkboxes.css("display", "flex");
        genreExpanded = true;
        // Closes the styles list
        $("#style-checkboxes").css("display", "none");
        styleExpanded = false;
      } else {
        // if it has an event a specific event is disabled and another enabled
        $._data(document.querySelector("body"), "events").click.forEach(
          (element) => {
            if (element.handler.name === "bodyStyleCheckboxToggle") {
              $("body").off("click", bodyStyleCheckboxToggle);
            }
            $("body").on("click", bodyGenreCheckboxToggle);
            // Shows the list of genres
            checkboxes.css("display", "flex");
            genreExpanded = true;
            // Closes the styles list
            $("#style-checkboxes").css("display", "none");
            styleExpanded = false;
          }
        );
      }
    } else {
      // Close the genres list if the user clicks on the elsewhere document
      checkboxes.css("display", "none");
      $("body").off("click", bodyGenreCheckboxToggle);
      genreExpanded = false;
    }
    // Apply styling if a filter are selected
    let applyStyling = false;
    $(".genre-checkbox").each(function () {
      if ($(this).is(":checked")) {
        applyStyling = true;
        if (!$(".genre-box").hasClass("filter-selected"))
          $(".genre-box").toggleClass("filter-selected");
      }
    });
    if (!applyStyling) $(".genre-box").removeClass("filter-selected");
  }

----IIII----

ShowStyleCheckboxes function functions in the same way as the ShowGenreCheckboxes() function.

// Line 240 in gameIndex/javascript.js
function ShowStyleCheckboxes() {
    let checkboxes = $("#style-checkboxes");
    if (!styleExpanded) {
      if ($._data(document.querySelector("body"), "events") === undefined) {
        $("body").on("click", bodyStyleCheckboxToggle);
        checkboxes.css("display", "flex");
        styleExpanded = true;
        $("#genre-checkboxes").css("display", "none");
        genreExpanded = false;
      } else {
        $._data(document.querySelector("body"), "events").click.forEach(
          (element) => {
            if (element.handler.name === "bodyGenreCheckboxToggle") {
              $("body").off("click", bodyGenreCheckboxToggle);
            }
            $("body").on("click", bodyStyleCheckboxToggle);
            checkboxes.css("display", "flex");
            styleExpanded = true;
            $("#genre-checkboxes").css("display", "none");
            genreExpanded = false;
          }
        );
      }
    } else {
      checkboxes.css("display", "none");
      $("body").off("click", ShowStyleCheckboxes);
      styleExpanded = false;
    }
    // Apply styling if a filter are selected
    let applyStyling = false;
    $(".style-checkbox").each(function () {
      if ($(this).is(":checked")) {
        applyStyling = true;
        if (!$(".style-box").hasClass("filter-selected"))
          $(".style-box").toggleClass("filter-selected");
      }
    });
    if (!applyStyling) $(".style-box").removeClass("filter-selected");
  }

----IIII----

BodyStyleCheckboxToggle() and BodyGenreCheckboxToggle() functions, toggle the body event that closes the style and genre list respectively if a user clicks outside of it.

// Line 212 in gameIndex/javascript.js
  function BodyStyleCheckboxToggle(e) {
    if ($(e.target).hasClass("style-box")) return;
    else if ($(e.target).hasClass("style-checkbox")) return;
    else if ($(e.target).hasClass("checkbox")) return;
    else {
      $("#style-checkboxes").css("display", "none");
      $("body").off("click", bodyStyleCheckboxToggle);
      styleExpanded = false;
      return;
    }
  }

// Line 227 in gameIndex/javascript.js
function BodyGenreCheckboxToggle(e) {
    if ($(e.target).hasClass("genre-box")) return;
    else if ($(e.target).hasClass("genre-checkbox")) return;
    else if ($(e.target).hasClass("checkbox-label")) return;
    else if ($(e.target).hasClass("checkbox")) return;
    else {
      $("#genre-checkboxes").css("display", "none");
      $("body").off("click", bodyGenreCheckboxToggle);
      genreExpanded = false;
      return;
    }

----IIII----

An event that changes the displayed dataset based on the "change" event on the defined "select" element, it resets the filters with the ResetFilter() function,
and calls the GetDataset() function that repopulates the document with the new games .json url.

// Line 280 in gameIndex/javascript.js
$(".dataset-select").on("change", function () {
    if ($(this).find(":selected").val() === "dataset2") {
      ResetFilters(false);
      GetDataset("https://exordiumgames.com/jobs/frontend/dataset_2.json");
    } else {
      ResetFilters(false);
      GetDataset("https://exordiumgames.com/jobs/frontend/dataset_1.json");
    }
  });


