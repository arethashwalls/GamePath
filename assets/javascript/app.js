$(document).ready(function () {
    //moods lists all possible moods:
    let moods = ['sad', 'angry', 'fanciful', 'excited', 'cheerful', 'spooky', 'suspenseful', 'thoughtful', 'curious'];

    //allData will hold all previously fetched API data to avoid repeating calls:
    let allData = {};

    for (let mood of moods) {
        //Programatically generate buttons based on each mood:
        $('.mood-buttons').append($('<button>').text(mood).attr({ 'data-mood': mood, 'class': 'btn btn-primary mood-button' }));
        //Add a property to allData for each mood:
        allData[mood] = { games: [], tracks: [] };
    }

    //getRandom is a utility function that returns a random element from an array:
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    //searchTerms translates moods into IGDB search terms:
    function searchTerms(mood) {
        switch (mood) {
            case 'sad':
                return {
                    //Survival, Drama
                    themeIds: [21, 31]
                };
            case 'angry':
                return {
                    //Shooter, Fighting, Hack and slash/Beat 'em up
                    genreIds: [5, 4, 25],
                };
            case 'fanciful':
                return {
                    //Fantasy, Historical, Science Fiction
                    themeIds: [17, 22, 18]
                };
            case 'excited':
                return {
                    //Racing, Sport, Fighting
                    genreIds: [10, 14, 4],
                };
            case 'cheerful':
                return {
                    //Party, Comedy
                    themeIds: [40, 27]
                };
            case 'spooky':
                return {
                    //Horror
                    themeIds: [19]
                };
            case 'suspenseful':
                return {
                    //Thriller, Stealth
                    themeIds: [20, 23]
                };
            case 'thoughtful':
                return {
                    //Puzzles, Strategy, Turn-based strategy, Real-time strategy
                    genreIds: [9, 15, 16, 11],
                }
            case 'curious':
                return {
                    //4X, Open world, Sandbox
                    themeIds: [41, 38, 33]
                }
            default:
                return {};
        }
    }

    //The Game object stores relevant game information pulled from IGDB:
    class Game {
        constructor(title, summary, platformIds, cover, videoIds) {
            this.title = title;
            this.summary = summary;
            this.cover = `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.cloudinary_id}.jpg`;
            this.platformIds = platformIds;
            //If videoIds is undefined, short-circuit to an empty array.
            this.videoIds = videoIds || [];
        }
        //Platforms are pulled as a seperate API query based on stored IDs.
        //The getter returns an array of platform names:
        get platforms() {
            let gameQueryUrl = 'https://api-2445582011268.apicast.io/platforms/';
            for (const id of this.platformIds) {
                gameQueryUrl += id + ',';
            }
            gameQueryUrl = gameQueryUrl.substring(0, gameQueryUrl.length - 1);
            gameQueryUrl += '?fields=name';
            const gameSafeUrl = `https://corsbridge2.herokuapp.com/${encodeURIComponent(gameQueryUrl)}`;
            return axios.get(gameSafeUrl, {
                headers: {
                    'user-key': gameKey,
                    'Accept': 'application/json'
                }
            }).then(response => response.data.map(datum => datum.name));
        }
        //IGDB gives us YouTube video IDs, the videos getter returns a JQuery element to display the YouTube video:
        get videos() {
            if (this.videoIds.length > 0) {
                return this.videoIds.map(id => $('<iframe>').attr({
                    'width': 560,
                    'height': 315,
                    'src': `https://www.youtube.com/embed/${id.video_id}`,
                    'allow': 'autoplay; encrypted-media',
                    'allowfullscreen': true
                }));
            }
            else {
                return '';
            }
        }
        //makeHtml returns a div for displaying the Game's properties:
        makeHtml() {
            let gameDiv = $('<div>').addClass('game-box');
            gameDiv.append(
                $("<h4>").text("Title: " + this.title),
                $("<img>").attr("src", this.cover),
                $("<p>").text("Summary: " + this.summary),
                this.videos[0]
            );
            return gameDiv;
        }
    }

    //makePlatformHtml handles the creation of the platform list:
    makePlatformHtml = (platforms) => {
        let $platformDiv = $('<div>').append($('<h4>').text('Platforms:'));
        let $platformList = $('<ul>');
        for (const platform of platforms) {
            $platformList.append($('<li>').text(platform));
        }
        $platformDiv.append($platformList);
        return $platformDiv;
    }

    const gameKey = 'f28275b8fb7b306cbb42f124b2e94066';

    //Game data is pulled from IGDB and returned as a promise:
    getGamePromise = (mood, property) => {
        const moodTerms = searchTerms(mood);
        let gameQueryUrl = 'https://api-2445582011268.apicast.io/games/?limit=20&fields=name,summary,platforms,cover,videos' +
            `&order=popularity:desc&filter[rating][gt]=90&filter[first_release_date][gt]=2005-01-01&filter[${property}][any]=`;
        const propIds = property === 'genres' ? moodTerms.genreIds : moodTerms.themeIds;
        //Each property is added to the query url:
        propIds.forEach(id => {
            gameQueryUrl += id + ',';
        });
        //The final , is trimmed off the url:
        gameQueryUrl = gameQueryUrl.substring(0, gameQueryUrl.length - 1);
        //An axios GET querry is sent indirectly via CORSbridge to bypass CORS blocking:
        const gameSafeUrl = 'https://corsbridge2.herokuapp.com/' + encodeURIComponent(gameQueryUrl);
        return axios.get(gameSafeUrl, {
            headers: {
                'user-key': gameKey,
                'Accept': 'application/json'
            }
        }).then(response => response.data.map(
            //The promise contains an array of Game objects:
            datum => new Game(datum.name, datum.summary, datum.platforms, datum.cover, datum.videos)
        ));

    }

    $('.mood-buttons, #game-buttons').on('click', '.mood-button', function () {
        $('#game-buttons').removeClass('hidden');
        const mood = $(this).attr('data-mood');
        $('#new-game-button, #music-button').attr('data-mood', mood);
        if (allData[mood].games.length == 0) {
            console.log('calling')
            const property = searchTerms(mood).hasOwnProperty('themeIds') ? 'themes' : 'genres';
            getGamePromise(mood, property).then(result => {
                //result arrives as an array of 20 Game objects.
                const game = getRandom(result);
                //CODE FOR DISPLAYING RESULTS GOES HERE:
                const $gameHtml = game.makeHtml();
                allData[mood].games = result.filter(item => item.title !== game.title);
                $gameHtml.append(game.makePlatformHtml)
                ////////////////////////////////////////
                game.platforms.then(platforms => {
                    //CODE SPECIFICALLY FOR DISPLAYING PLATFORMS GOES HERE:
                    $gameHtml.append(makePlatformHtml(platforms));
                    $('#game-results').prepend($gameHtml);
                    //////////////////////////////////////////////////////
                });
            });
        } else {
            console.log('not calling')
            const game = getRandom(allData[mood].games);
            const $gameHtml = game.makeHtml();
            game.platforms.then(platforms => {
                //CODE SPECIFICALLY FOR DISPLAYING PLATFORMS GOES HERE:
                $gameHtml.append(makePlatformHtml(platforms));
                $('#game-results').prepend($gameHtml);
                //////////////////////////////////////////////////////
            });
        }
    });

    const musicKey = 'a3e040df3cd2213704ea57b5d25c8714';

    //The Track object stores relevant game information pulled from the LastFM API:
    class Track {
        constructor(title, artist, cover, link) {
            this.title = title;
            this.artist = artist;
            this.cover = cover;
            this.link = link;
        }
        //makeHtml returns a div for displaying the Track's properties:
        makeHtml() {
            let $trackDiv = $('<div>').addClass('track-box');
            $trackDiv.append(
                $('<h4>').text(this.title),
                $('<p>').text(this.artist),
                $('<img>').attr('src', this.cover),
                $('<p>').html($('<a>').attr('href', this.link).text('Check it out!'))
            );
            return $trackDiv;
        }
    }

    //Track data is pulled from the LastFM API and returned as a promise:
    function getMusicPromise(mood) {
        const musicQueryUrl = `http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${mood}&api_key=${musicKey}&format=json`
        const musicSafeUrl = 'https://corsbridge.herokuapp.com/' + encodeURIComponent(musicQueryUrl);
        return track = axios.get(musicSafeUrl).then(response => response.data.tracks.track.map(
            //The promise contains an array of Track objects:
            track => new Track(track.name, track.artist.name, track.image[2]['#text'], track.url)
        ));
    }

    $('#music-button').on('click', function () {
        const mood = $(this).attr('data-mood');
        if(allData[mood].tracks.length === 0) {
            getMusicPromise(mood).then(result => {
                //CODE FOR DISPLAYING TRACKS GOES HERE:
                const track = getRandom(result);
                allData[mood].tracks = result.filter(item => item.title !== track.title);
                $('#music-results').prepend(track.makeHtml());
                ///////////////////////////////////////
            });
        } else {
            const track = getRandom(allData[mood].tracks);
            $('#music-results').prepend(track.makeHtml());
        }
        
    });
});