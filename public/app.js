$("#save").on("click", function() {
    var id = $(this).attr("data-id");
    $.put({
        url: "/articles/"+id
    })
})