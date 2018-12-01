$(document).ready(function () {
    var key = 'f28275b8fb7b306cbb42f124b2e94066';

    var queryUrl = 'https://api-2445582011268.apicast.io/games/';

    var encodedUrl = encodeURIComponent(queryUrl);
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        headers: { 'user-key': key, "Accept": "application/json" },
        url: 'https://corsbridge.herokuapp.com/' + encodedUrl,
        success: function (data) {
            console.log(data);
        }
    });

});