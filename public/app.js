$(document).ready(function() {
$("#new").hide();

$("#scrape").on("click", function() {
    $("#scrape").hide();
    $("#new").show();
});

$(".save").on("click", function() {
    var id = $(this).attr("data-id");
    event.preventDefault();
    $.ajax({
        method: "PUT",
        url: "/articles/" + id,
        data: {
            saved: true
        }
    })
    .then(function() {
        console.log("Article Saved");
    })
});

});