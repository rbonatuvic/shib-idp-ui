$( document ).ready(function() {

    /* ==============================
    TOOLTIPS
    ============================== */

    // Enable tooltips everywhere
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    /* ==============================
    VIEW TOGGLE
    ============================== */
    $("#sourceListViewToggle button").on('click', function() {
        $("#sourceListViewToggle button").toggleClass("btn-primary btn-light");
    });

    /* ==============================
    BACK TO TOP
    ============================== */
    $(".to-top").on('click', function() {
        // Scroll window to top of view
	    window.scrollTo(0, 0);
    });

    /* ==============================
    VIDEOS
    ============================== */

    // Make videos responsive
    // https://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php

    // Find all YouTube videos
    //var $allVideos = $("iframe[src^='//www.youtube.com']"),
    var $allVideos = $("iframe"),

    // The element that is fluid width
    $fluidEl = $("#videoResize");

    // Figure out and save aspect ratio for each video
    $allVideos.each(function() {

    $(this)
    .data('aspectRatio', this.height / this.width)

    // and remove the hard coded width/height
    .removeAttr('height')
    .removeAttr('width');

    });

    // When the window is resized
    $(window).resize(function() {

    var newWidth = $fluidEl.width();

    // Resize all videos according to their own aspect ratio
    $allVideos.each(function() {

    var $el = $(this);
    $el
    .width(newWidth)
    .height(newWidth * $el.data('aspectRatio'));

    });

    // Kick off one resize to fix all videos on page load
    }).resize();

    /* ==============================
    SELF ASSESSMENT
    ============================== */

    // Check answers
    $("#sa1Check").click(function () {
        console.log("selfAssessment1Check clicked");

        var c1 = $("#sa1c1").val();
        var c2 = $("#sa1c2").val();
        var c3 = $("#sa1c3").val();

        var c1a = c1.includes("--");
        var c2a = c2.includes("--");
        var c3a = c3.includes("--");

        console.log("c1: " + c1);
        console.log("c2: " + c2);
        console.log("c3: " + c3);
        console.log("c1a: " + c1a);
        console.log("c2a: " + c2a);
        console.log("c3a: " + c3a);

        // Remove alert if it was shown previously
        var alertShown = $("#sa1Alert").hasClass("active");
        if( alertShown == true ) {
            $("#sa1Alert").removeClass("active").addClass("d-none");
        }

        // Reset scoring indicators
        $("#sa1 .question-score .correct").addClass("d-none");
        $("#sa1 .question-score .incorrect").addClass("d-none");
        $("#sa1 .question-score .not-scored").removeClass("d-none");
        

        // Check for answers to all questions
        if( c1a == true || c2a == true || c3a == true ) {
            // Not all questions answered, ask for answers.
            console.log("Not all questions were answered");
            $("#sa1Alert").removeClass("d-none").addClass("active");

        } else {
            // All questions have been answered, show scores.
            console.log("Scoring");

            // Remove not-scored indicator
            $("#sa1 .question-score .not-scored").addClass("d-none");

            if( c1 === "Nitrogen and Phosphorus" ) {
                // Correct
                $("#sa1q1 .question-score .correct").removeClass("d-none");
            } else {
                // Incorrect
                $("#sa1q1 .question-score .incorrect").removeClass("d-none");
            };

            if( c2 === "Enzymes" ) {
                // Correct
                $("#sa1q2 .question-score .correct").removeClass("d-none");
            } else {
                // Incorrect
                $("#sa1q2 .question-score .incorrect").removeClass("d-none");
            };

            if( c3 === "Saprobes" ) {
                // Correct
                $("#sa1q3 .question-score .correct").removeClass("d-none");
            } else {
                // Incorrect
                $("#sa1q3 .question-score .incorrect").removeClass("d-none");
            };
        };
    });

    // Reset assessment
    $("#selfAssessment1Reset").click(function () {
        $("#choice1 .dropdown-toggle").text("-- Choose --");
        $("#choice2 .dropdown-toggle").text("-- Choose --");
        $("#choice3 .dropdown-toggle").text("-- Choose --");
    });

}); // end document.ready