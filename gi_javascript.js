jQuery.noConflict();
jQuery(document).ready(function ($) {
  let genreExpanded = false;
  let styleExpanded = false;

  $(".genre-box-container").on("click", ShowGenreCheckboxes);
  $(".style-box-container").on("click", ShowStyleCheckboxes);
  //   $("body").on("click", bodyGenreCheckboxToggle);
  console.log($._data(document.querySelector("body"), "events"));
  //   console.log(
  //     $._data(document.querySelector("body"), "events").click.forEach(
  //       (element) => {
  //         console.log(element);
  //       }
  //     )
  //   );

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

  function bodyGenreCheckboxToggle(e) {
    console.log(e.target);
    if ($(e.target).hasClass("genre-box")) return;
    else if ($(e.target).hasClass("genre-checkbox")) return;
    else {
      $("#genre-checkboxes").css("display", "none");
      $("body").off("click", bodyGenreCheckboxToggle);
      genreExpanded = false;
      return;
    }
  }

  function bodyStyleCheckboxToggle(e) {
    if ($(e.target).hasClass("style-box")) return;
    else if ($(e.target).hasClass("style-checkbox")) return;
    else {
      $("#style-checkboxes").css("display", "none");
      $("body").off("click", bodyStyleCheckboxToggle);
      styleExpanded = false;
      return;
    }
  }

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

  //   function bodyStyleCheckboxToggle(e) {
  //     console.log(e.target);
  //     if ($(e.target).hasClass("style-box")) return;
  //     else if ($(e.target).hasClass("style-checkbox")) return;
  //     else {
  //       $("#style-checkboxes").css("display", "none");
  //       $("body").off("click", bodyStyleCheckboxToggle);
  //       styleExpanded = false;
  //     }
  //   }
});
