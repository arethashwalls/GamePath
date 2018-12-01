$(document).ready(function () {
    const gameKey = 'f28275b8fb7b306cbb42f124b2e94066';
    const musicKey = 'a3e040df3cd2213704ea57b5d25c8714';

    const gameQueryUrl = 'https://api-2445582011268.apicast.io/games/';
    const gameEncodedUrl = encodeURIComponent(gameQueryUrl);

    const musicQueryUrl = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${musicKey}&artist=Cher&album=Believe&format=json`;
    const musicEncodedUrl = encodeURIComponent(musicQueryUrl);

    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        headers: { 'user-key': gameKey, "Accept": "application/json" },
        url: 'https://corsbridge.herokuapp.com/' + gameEncodedUrl,
        success: function (data) {
            console.log(data);
        }
    });

    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: 'https://corsbridge.herokuapp.com/' + musicEncodedUrl,
        success: function (data) {
            console.log(data);
        }
    })


});