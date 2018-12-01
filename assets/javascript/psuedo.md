# App Structure

## Global variables:
* Current mood

On clicking add a mood button:
* If it passes our restrictions:
    * Code like the GIPHY app adds a new button

On clicking a mood button:
* A function maps moods to game genres.
* AJAX request for highly rated games from that genre
    * Then:
        * Format info from those games into 5 game cards
        * Display them

On clicking fetch more games:
* Make another AJAX request with the same mood
    * Then:
        * Format info from those games into 5 game cards
        * Display them

On clicking a game:
* Let user request a playlist

On clicking request playlist:
* AJAX request to music API based on mood + game rating, language, et c.
    * Then:
        * Display the playlist