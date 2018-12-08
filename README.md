# GroupProject1
## Group Project 1 for UA Coding Bootcamp

## The Game Object
Information pulled from the IGDB API is stored in an array of `Game` objects. The `Game` object has the following properties:
* `Game.title` is a string representing the game's name.
* `Game.summary` is a string representing a description of the game.
* `Game.cover` is a string representing a URL for the game's cover image.
* `Game.platformIds` is an array of integers representing platform IDs for a later call. *It's not intended for direct use.*
* `Game.videoIds` is an array of YouTube IDs. *It's not intended for direct use.*
* `Game.platforms` uses a getter to make an additinional API call to pull platforms via `platformIds`. It returns a promise.
* `Game.videos` uses a getter that returns an `<iframe>` jQuery object for displaying a YouTube video.

## The Track Object
Information pulled from the LastFM API is stored in an array of `Track` objects. The `Track` object has the following properties:
* `Track.title` is a string representing the track's name.
* `Track.artist` is a string representing the track's artist.
* `Track.cover` is a string representing a url for the track's album's cover.
* `Track.link`is a string representing a link to the track's streaming page on [last.fm].

### Links
* [Trello](https://trello.com/b/UlvgmvcL/group-project-1)
* [API list](https://github.com/toddmotto/public-apis)




This application uses Open Source components. You can find the source code of their open source projects along with license information below. We acknowledge and are grateful to these developers for their contributions to open source.

Start Bootstrap was created by and is maintained by **[David Miller](http://davidmiller.io/)**, Owner of [Blackrock Digital](http://blackrockdigital.io/).

* http://davidmiller.io
* https://twitter.com/davidmillerskt
* https://github.com/davidtmiller

Start Bootstrap is based on the [Bootstrap](http://getbootstrap.com/) framework created by [Mark Otto](https://twitter.com/mdo) and [Jacob Thorton](https://twitter.com/fat).

Copyright and License

Copyright 2013-2018 Blackrock Digital LLC. Code released under the [MIT](https://github.com/BlackrockDigital/startbootstrap-scrolling-nav/blob/gh-pages/LICENSE) license.


