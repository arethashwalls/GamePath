$(document).ready(function () {
    let moods = ['sad', 'angry', 'fanciful', 'excited', 'cheerful', 'spooky', 'suspenseful', 'thoughtful', 'curious'];

    for (let mood of moods) {
        $('.mood-buttons').append($('<button>').text(mood).attr({ 'data-mood': mood, 'class': 'btn btn-primary mood-button' }));
    }

    //getRandom is a utility function 
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

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

    const gameKey = 'f28275b8fb7b306cbb42f124b2e94066';

    class Game {
        constructor(title, summary, platformIds, cover, videoIds) {
            this.title = title;
            this.summary = summary;
            this.cover = `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.cloudinary_id}.jpg`;
            this.platformIds = platformIds;
            this.videoIds = videoIds;
        }
        get platforms() {
            let gameQueryUrl = 'https://api-2445582011268.apicast.io/platforms/';
            for (const id of this.platformIds) {
                gameQueryUrl += id + ',';
            }
            gameQueryUrl = gameQueryUrl.substring(0, gameQueryUrl.length - 1);
            gameQueryUrl += '?fields=name';
            const gameSafeUrl = 'https://corsbridge2.herokuapp.com/' + encodeURIComponent(gameQueryUrl);
            return axios.get(gameSafeUrl, {
                headers: {
                    'user-key': gameKey,
                    'Accept': 'application/json'
                }
            }).then(response => response.data.map(datum => datum.name));
        }
        get videos() {
            return this.videoIds.map(id => $('<iframe>').attr({
                'width': 560,
                'height': 315,
                'src' : `https://www.youtube.com/embed/${id.video_id}`,
                'allow' : 'autoplay; encrypted-media',
                'allowfullscreen' : true
            }));
        }

    }

    function getGamePromise(mood, property) {
        const moodTerms = searchTerms(mood);
        let gameQueryUrl = 'https://api-2445582011268.apicast.io/games/?limit=20&fields=name,summary,platforms,cover,videos' +
            `&order=popularity:desc&filter[rating][gt]=90&filter[first_release_date][gt]=2005-01-01&filter[${property}][any]=`;
        const propIds = property === 'genres' ? moodTerms.genreIds : moodTerms.themeIds;
        propIds.forEach(id => {
            gameQueryUrl += id + ',';
        });
        gameQueryUrl = gameQueryUrl.substring(0, gameQueryUrl.length - 1);
        const gameSafeUrl = 'https://corsbridge2.herokuapp.com/' + encodeURIComponent(gameQueryUrl);
        return axios.get(gameSafeUrl, {
            headers: {
                'user-key': gameKey,
                'Accept': 'application/json'
            }
        }).then(response => response.data.map(
            datum => new Game(datum.name, datum.summary, datum.platforms, datum.cover, datum.videos)
        ));

    }

    $('.mood-buttons').on('click', '.mood-button', function () {
        const mood = $(this).attr('data-mood');
        const property = searchTerms(mood).hasOwnProperty('themeIds') ? 'themes' : 'genres';
        getGamePromise(mood, property).then(result => {
            //result arrives as an array of 20 Game objects.
            console.log(result);
            let game = getRandom(result); 
            //CODE FOR DISPLAYING RESULTS GOES HERE:


            ////////////////////////////////////////
            game.platforms.then(platforms => {
                console.log(platforms);
                //CODE SPECIFICALLY FOR DISPLAYING PLATFORMS GOES HERE:
                
                
                //////////////////////////////////////////////////////
            });
        });
        getMusicPromise(mood).then(result => {
            console.log(result);
            //CODE FOR DISPLAYING TRACKS GOES HERE:

            
            ///////////////////////////////////////
        });
    });

    const musicKey = 'a3e040df3cd2213704ea57b5d25c8714';

    class Track {
        constructor(title, artist, cover, link) {
            this.title = title;
            this.artist = artist;
            this.cover = cover;
            this.link = link;
        }
    }

    function getMusicPromise(mood) {
        const musicQueryUrl = `http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${mood}&api_key=${musicKey}&format=json`
        const musicSafeUrl = 'https://corsbridge.herokuapp.com/' + encodeURIComponent(musicQueryUrl);
        return track = axios.get(musicSafeUrl).then(response => response.data.tracks.track.map(
            track => new Track(track.name, track.artist.name, track.image[2]['#text'], track.url)
        ));
    }

    getMusicPromise('angry');

});