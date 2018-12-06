$(document).ready(function () {
    let moods = ['sad', 'angry', 'fanciful', 'excited', 'cheerful', 'spooky', 'suspenseful', 'thoughtfull', 'curious'];

    for (let mood of moods) {
        $('.mood-buttons').append($('<button>').text(mood).attr({ 'data-mood': mood, 'class': 'btn btn-primary mood-button' }));
    }

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    function searchTerms(mood) {
        switch (mood) {
            case 'sad':
                return {
                    themes: ['Survival', 'Drama'],
                    themeIds: [21, 31]
                };
            case 'angry':
                return {
                    genres: ['Shooter', 'Fighting', 'Hack and slash/Beat \'em up'],
                    genreIds: [5, 4, 25],
                    themes: ['Action', 'Warfare'],
                    themeIds: [1, 39]
                };
            case 'fanciful':
                return {
                    themes: ['Fantasy', 'Historical', 'Science Fiction'],
                    themeIds: [17, 22, 18]
                };
            case 'excited':
                return {
                    genres: ['Racing', 'Sport', 'Fighting'],
                    genreIds: [10, 14, 4],
                };
            case 'cheerful':
                return {
                    genres: ['Music', 'Platform', 'Racing'],
                    genreIds: [7, 8, 10],
                    themes: ['Party', 'Comedy'],
                    themeIds: [40, 27]
                };
            case 'spooky':
                return {
                    themes: ['horror'],
                    themeIds: [19]
                };
            case 'suspenseful':
                return {
                    themes: ['Thriller', 'Stealth'],
                    themeIds: [20, 23]
                };
            case 'thoughtful':
                return {
                    genres: ['Puzzles', 'Strategy', 'Turn-based strategy', 'Real-time strategy'],
                    genreIds: [9, 15, 16, 11],
                    themes: ['4X'],
                    themeIds: [41]
                }
            case 'curious':
                return {
                    genres: ['Adventure'],
                    genreIds: [31],
                    themes: ['4X', 'Open world', 'Sandbox'],
                    themeIds: [41, 38, 33]
                }
            default:
                return {};
        }
    }

    function Game(title, summary, platforms, cover, videos) {
        this.title = title;
        this.summary = summary;
        this.platforms = platforms;
        this.cover = cover;
        this.videos = videos;
    }

    const gameKey = 'f28275b8fb7b306cbb42f124b2e94066';
    // const musicKey = 'a3e040df3cd2213704ea57b5d25c8714';

    function getGameIDs(mood, property, cb) {
        const moodTerms = searchTerms(mood);
        let gameQueryUrl = `https://api-2445582011268.apicast.io/${property}s/`;
        const ids = property === 'genre' ? moodTerms.genreIds : moodTerms.themeIds;
        for (let id of ids) {
            gameQueryUrl += id + ',';
        }
        gameQueryUrl = gameQueryUrl.substring(0, gameQueryUrl.length - 1);
        gameQueryUrl += '?fields=*&filter[rating][gt]=90&order=popularity:desc';
        const gameEncodedUrl = encodeURIComponent(gameQueryUrl);
        let gameIds = [];
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            headers: { 'user-key': gameKey, "Accept": "application/json" },
            url: 'https://corsbridge.herokuapp.com/' + gameEncodedUrl,
            success: async function (data) {
                for(datum of data) {
                    for(let i = 0; i < 10; i++) {
                        gameIds.push(datum.games[i]);
                    }
                }
                let game = await cb(getRandom(gameIds))
                console.log( game );
            }
        });
        return gameIds;
    }

    function getGame(id){
        let gameQueryUrl = `https://api-2445582011268.apicast.io/games/${id}?fields=*`;
        const gameEncodedUrl = encodeURIComponent(gameQueryUrl);
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            headers: { 'user-key': gameKey, "Accept": "application/json" },
            url: 'https://corsbridge.herokuapp.com/' + gameEncodedUrl,
            success: function (data) {
                let game = new Game(data[0].name, data[0].summary, data[0].platforms, data[0].cover, data[0].videos);
                console.log(game);

                return game;
                
            }
        });
    }

    console.log(getGameIDs('angry', 'genre', getGame));


    // const gameQueryUrl = 'https://api-2445582011268.apicast.io/themes/?search=sandbox&fields=name';
    // const gameEncodedUrl = encodeURIComponent(gameQueryUrl);

    // const musicQueryUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=cher&api_key=${musicKey}&format=json`;
    // const musicEncodedUrl = encodeURIComponent(musicQueryUrl);

    $('.mood-buttons').on('click', '.mood-button', () => {
        const mood = $(this).attr('data-mood');

    });



    // $.ajax({
    //     type: 'GET',
    //     contentType: 'application/json',
    //     url: 'https://corsbridge.herokuapp.com/' + musicEncodedUrl,
    //     success: function (data) {
    //         console.log(data);
    //     }
    // })


});