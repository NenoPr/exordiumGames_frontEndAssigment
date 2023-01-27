jQuery.noConflict();
jQuery(document).ready(function ($) {
  // VARIABLES
  let genreExpanded = false;
  let styleExpanded = false;
  let responseData;
  GetDataset("https://exordiumgames.com/jobs/frontend/dataset_1.json");

  function GetDataset(datasetUrl) {
    $.ajax({
      type: "GET",
      url: datasetUrl,
      success: function (response) {
        console.log(response);
        responseData = response;
        let responseGenres = [];
        let responseStyles = [];
        // push genres and styles to new array
        $.each(response, function (key, val) {
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
        PopulateGames(response);
        // Empty the element to append new children
      },
    });
  }

  function SortResponseData(data, type) {
    // Empty the element to append new children
    $(`#${type}-checkboxes`).empty();
    // Populate the specified element
    $.each(data, function (index, val) {
      $(`#${type}-checkboxes`).append(
        `<label for="${type}-${index}" class="checkbox-label">
        ${val} <input type="checkbox" class="${type}-checkbox checkbox" id="${type}-${index}" />
            </label>`
      );
    });
  }

  function PopulateGames(gamesData) {
    // Empty the element to append new children
    $(".games-container").empty();
    // Populate .games-container with new games
    $.each(gamesData, function (key, val) {
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
    });
  }

  //              ---- EVENTS ----
  // Search checkboxes events
  // creates a vertical list of genres on click
  $(".genre-box-container").on("click", ShowGenreCheckboxes);
  $(".style-box-container").on("click", ShowStyleCheckboxes);
  $(".reset-filters").on("click", ResetFilters);

  function ResetFilters() {
    $("input:checkbox").prop("checked", false);
    $("input:text").val("");
  }

  // Displays the list of genres
  function ShowGenreCheckboxes() {
    var checkboxes = $("#genre-checkboxes");
    if (!genreExpanded) {
      if ($._data(document.querySelector("body"), "events") === undefined) {
        $("body").on("click", bodyGenreCheckboxToggle);
        checkboxes.css("display", "flex");
        genreExpanded = true;
        $("#style-checkboxes").css("display", "none");
        styleExpanded = false;
        console.log($._data(document.querySelector("body"), "events"));
      } else {
        $._data(document.querySelector("body"), "events").click.forEach(
          (element) => {
            if (element.handler.name === "bodyStyleCheckboxToggle") {
              $("body").off("click", bodyStyleCheckboxToggle);
            }
            $("body").on("click", bodyGenreCheckboxToggle);
            checkboxes.css("display", "flex");
            genreExpanded = true;
            $("#style-checkboxes").css("display", "none");
            styleExpanded = false;
          }
        );
      }
    } else {
      checkboxes.css("display", "none");
      $("body").off("click", bodyGenreCheckboxToggle);
      genreExpanded = false;
    }
  }

  // Toggles the body event that closes the genre list if a user clicks outside of it
  function bodyGenreCheckboxToggle(e) {
    console.log(e.target);
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
  }

  // Toggles the body event that closes the style list if a user clicks outside of it
  function bodyStyleCheckboxToggle(e) {
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

  // Displays the list of styles
  function ShowStyleCheckboxes() {
    let checkboxes = $("#style-checkboxes");
    if (!styleExpanded) {
      if ($._data(document.querySelector("body"), "events") === undefined) {
        $("body").on("click", bodyStyleCheckboxToggle);
        checkboxes.css("display", "flex");
        styleExpanded = true;
        $("#genre-checkboxes").css("display", "none");
        genreExpanded = false;
        console.log($._data(document.querySelector("body"), "events"));
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
  }

  // Change the selected game dataset
  $(".dataset-select").on("change", function () {
    if ($(this).find(":selected").val() === "dataset2") {
      GetDataset("https://exordiumgames.com/jobs/frontend/dataset_2.json");
    } else {
      GetDataset("https://exordiumgames.com/jobs/frontend/dataset_1.json");
    }
  });
});
