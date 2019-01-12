$('#statusPage').show()

function displayPage(page) {
    $('.page').hide()
    $('#' + page +'Page').show()
    $('.menuItem').removeClass("active")
    $('.menuItem[data-page="' + page + '"]').addClass("active")
}