jQuery.noConflict();
jQuery(document).ready(function ($) {
  // $("button").on("click", function () {
  //   $(".answer-option").toggleClass("test");
  // });
  $(".answer-option").on("mousedown", StickElement);

  $(".answer-box").on("mouseup", function (e) {
    if (!$(".sticky").hasClass("sticky")) return;
    $(".sticky").addClass("dropped");
    $(this).append(
      `<div class="answer-option no-event">${$(".sticky").text()}</div>`
    );
  });

  $(".answer-box").on("wheel", function (e) {
    e.preventDefault();
    this.scrollLeft += e.originalEvent.wheelDeltaY;
    console.log(e.originalEvent.wheelDeltaY)
  });


  function MousePositionCords(e) {
    console.log("e.pageY", e.pageY);
    console.log("e.pageX", e.pageX);
    jQuery(".sticky").css("top", "" + (e.pageY - 40) + "px");
    jQuery(".sticky").css("left", "" + (e.pageX - 50) + "px");
  }

  function StickElement(e) {
    $(this).addClass("sticky");
    $(document).mousemove(MousePositionCords);
    $("body").css("cursor", "pointer");
    $(document).mouseup(function () {
      if ($(".sticky").hasClass("dropped")) {
        $(".sticky").remove();
      } else {
        $(".sticky").toggleClass("sticky");
      }
      $(document).off("mousemove", MousePositionCords);
      $(document).off("mouseup");
      $("body").css("cursor", "default");
    });
  }
});
