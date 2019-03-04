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
        console.log(id);
    })
    $(this).attr("class", "btn btn-success");
});

$(".note").on("click", function() {
    $(".modal").show();
    $(".close-note").on("click", function() {
        $(".modal").hide();
    });

    // var id = $(this).attr("data-id");
    // console.log(id);

    // $.ajax({
    //     method: "GET",
    //     url: "/articles/" + id
    // })
    // .then(function(data) {
    //     console.log(data);
    //     $(".prev-notes").text(data.note.body);
    // });
    var id = $(this).attr("data-id");
    console.log(id);

    $(".save-note").on("click", function() {
        $.ajax({
            method: "POST",
            url: "/articles/" + id,
            data: {
                body: $(".form-control").val()
            }
        })
        .then(function(data) {
            console.log(data);
        })
        $(".form-control").val("");

        $.ajax({
            method: "GET",
            url: "/articles/" + id
        })
        .then(function(data) {
            console.log(data);
            $(".prev-notes").text(data.note.body);
        });

    });
    
})

});