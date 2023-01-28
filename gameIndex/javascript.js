jQuery.noConflict();
jQuery(document).ready(function ($) {
  // VARIABLES
  let genreExpanded = false;
  let styleExpanded = false;
  let responseData;
  GetDataset("https://exordiumgames.com/jobs/frontend/dataset_1.json");

  // GET dataset json
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
        const UNIQUE_GENRES = responseGenres.filter(unique);
        const UNIQUE_STYLES = responseStyles.filter(unique);
        // Populate the DOM with genre and style data
        SortResponseData(UNIQUE_GENRES, "genre");
        SortResponseData(UNIQUE_STYLES, "style");
        // Populate the games container with games from the dataset
        PopulateGames(responseData);
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
        `<label for="${type}-${index}" class="checkbox-label" data-${type}="${val}">
        ${val} <input type="checkbox" class="${type}-checkbox checkbox" id="${type}-${index}" />
            </label>`
      );
    });
  }

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

  //              ---- EVENTS ----

  // Search checkboxes events
  // creates a vertical list of genres on click
  $(".genre-box-container").on("click", ShowGenreCheckboxes);
  $(".style-box-container").on("click", ShowStyleCheckboxes);
  $(".reset-filters").on("click", ResetFilters);
  $(".search-button").on("click", SearchFilter);
  $(".search-box").on("keypress", EnterKeySearch);

  function EnterKeySearch(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      $(".search-button").click();
    }
  }

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

  // Reset search filters
  function ResetFilters(fullReset = true) {
    $("input:checkbox").prop("checked", false);
    $("input:text").val("");
    $(".genre-box").removeClass("filter-selected");
    $(".style-box").removeClass("filter-selected");
    if (fullReset) PopulateGames(responseData);
  }

  // Displays the list of genres
  function ShowGenreCheckboxes() {
    var checkboxes = $("#genre-checkboxes");
    if (!genreExpanded) {
      // If document has no event
      if ($._data(document.querySelector("body"), "events") === undefined) {
        $("body").on("click", BodyGenreCheckboxToggle);
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
            if (element.handler.name === "BodyStyleCheckboxToggle") {
              $("body").off("click", BodyStyleCheckboxToggle);
            }
            $("body").on("click", BodyGenreCheckboxToggle);
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
      $("body").off("click", BodyGenreCheckboxToggle);
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

  // Toggles the body event that closes the genre list if a user clicks outside of it
  function BodyGenreCheckboxToggle(e) {
    if ($(e.target).hasClass("genre-box")) return;
    else if ($(e.target).hasClass("genre-checkbox")) return;
    else if ($(e.target).hasClass("checkbox-label")) return;
    else if ($(e.target).hasClass("checkbox")) return;
    else {
      $("#genre-checkboxes").css("display", "none");
      $("body").off("click", BodyGenreCheckboxToggle);
      genreExpanded = false;
      return;
    }
  }

  // Toggles the body event that closes the style list if a user clicks outside of it
  function BodyStyleCheckboxToggle(e) {
    if ($(e.target).hasClass("style-box")) return;
    else if ($(e.target).hasClass("style-checkbox")) return;
    else if ($(e.target).hasClass("checkbox")) return;
    else {
      $("#style-checkboxes").css("display", "none");
      $("body").off("click", BodyStyleCheckboxToggle);
      styleExpanded = false;
      return;
    }
  }

  // Displays the list of styles
  function ShowStyleCheckboxes() {
    let checkboxes = $("#style-checkboxes");
    if (!styleExpanded) {
      if ($._data(document.querySelector("body"), "events") === undefined) {
        $("body").on("click", BodyStyleCheckboxToggle);
        checkboxes.css("display", "flex");
        styleExpanded = true;
        $("#genre-checkboxes").css("display", "none");
        genreExpanded = false;
      } else {
        $._data(document.querySelector("body"), "events").click.forEach(
          (element) => {
            if (element.handler.name === "BodyGenreCheckboxToggle") {
              $("body").off("click", BodyGenreCheckboxToggle);
            }
            $("body").on("click", BodyStyleCheckboxToggle);
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

  // Change the selected game dataset
  $(".dataset-select").on("change", function () {
    if ($(this).find(":selected").val() === "dataset2") {
      ResetFilters(false);
      GetDataset("https://exordiumgames.com/jobs/frontend/dataset_2.json");
    } else {
      ResetFilters(false);
      GetDataset("https://exordiumgames.com/jobs/frontend/dataset_1.json");
    }
  });
});
