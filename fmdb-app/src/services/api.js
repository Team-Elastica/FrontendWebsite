const TMDB_API_KEY = "f227800b9536e9381d2fd17bb3aa3c83";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IGDB_BASE_URL = "https://api.igdb.com/v4";
const IGDB_AUTH_URL = "https://id.twitch.tv/oauth2/token";

const IGDB_CLIENT_ID = "oykdfgwed2b8b6pldfwu48iypp7uj6"
const IGDB_CLIENT_SECRET = "7mgcxf8993bgq820gznpm8lp33i1t4"

const TMDB_IMAGE_PATH = "https://image.tmdb.org/t/p/w500";

let latest_id = 0

/*
 API CALL FUNCTIONS
*/
export const getGameAuth = async () => {
    const params = new URLSearchParams({
        client_id: IGDB_CLIENT_ID,
        client_secret: IGDB_CLIENT_SECRET,
        grant_type: "client_credentials"
    });

    try {
        const response = await fetch(IGDB_AUTH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Access Token:", data.access_token);
        return data.access_token;
    } catch (error) {
        console.error("Failed to fetch access token:", error);
    }
}

export const getPopularMovies = async () => {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    console.log('Movie Data:', data.results)
    return wrapData(data.results, "Movie");
}

export const getPopularShows = async () => {
    const response = await fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    console.log('Show Data:', data.results)
    return wrapData(data.results, "Show");
}

export const getPopularGames = async () => {
    const token = await getGameAuth();

    const response = await fetch(`${IGDB_BASE_URL}/games`, {
        method: "POST",
        headers: {
            "Client-ID": IGDB_CLIENT_ID,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "text/plain"
        },
        body: `
            fields name, cover.url, first_release_date, rating, rating_count, genres.name;
            sort rating desc;
            where rating != null;
            limit 10;
        `
    });

    if (!response.ok) {
        throw new Error(`Error fetching popular games: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Game Data:', data)
    return wrapData(data, "Game");
};

export const getPopularMedia = async () => {
    const movies = await getPopularMovies();
    const shows = await getPopularShows();
    //const games = await getPopularGames();

    const media =  [
        ...movies,
        ...shows,
        //...games
    ];

    return shuffleArray(media);
}
    // Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}


/*
    Input:
        data: array of data elements. Each data element is from either the TMDB or IGDB datasets. 
              An example of what we expect for the variable data is list:
            [
                {
                    id:..
                    title:...
                    first_release_date:...
                    etc...
            
                },

                {
                    id:..
                    title:...
                    first_release_date:...
                    etc...
                },

                etc...
            ]
        type: type of media, either these strings {"Movie", "Show", "Game", "Fixed"}
    Output:
        array of original data wrapped with these consistent columns: [id, title, url, release_date, summary, genres, type, hasAddButton]
*/  
function wrapData(data, type) {
    if (!Array.isArray(data)) {
        throw new Error(`Expected array, but got ${typeof data}`);
    }
    
    if (type === "Fixed") {
        return data;
    }

    return data.map(item => {
        return {                                                  
            id: latest_id++, // Ensure unique IDs
            title: type === "Game" ? item.name : item.title || item.name,
            url: type === "Game" 
                ? item.cover?.url || "fallback_url.jpg" // Fallback URL if cover.url is missing
                : item.poster_path || "fallback_url.jpg", // Fallback for posters
            release_date: type === "Game" ? dateToYear(item.first_release_date) : dateToYear(item.release_date) || dateToYear(item.first_air_date),
            summary: type === "Game" ? item.summary : item.overview, // Assign summary based on type
            genres: type === "Game" 
                ? (Array.isArray(item.Genres) ? item.Genres : []) // Ensure it's an array
                : (typeof item.genres === "string" ? item.genres.split(", ") : []), // Split by ", " for Movies/Shows
            type: type,
            hasAddButton: true
        };
    });
}

function dateToYear(date) {
    return new Date(date).getFullYear();
}


/*
 ELASTICSEARCH CALL FUNCTIONS
*/

/*
    TO DO...
    Input:
        keystroke: keystroke input from the user in the search bar
    Output:
        matches: list of closest media matches. The list has length=MAX_MATCHES
*/
export async function get_closest_keystroke_match(keystroke) {
    //Max number of matches to return
    let MAX_MATCHES = 9;
    let MAX_PER_TYPE = MAX_MATCHES / 3;

    //TO DO: populate matches based on your autocomplete logic. Right now, I'm just filling it with dummy data.
    let matches = [];

    //if search bar is empty, just default to most popular media API
    if(keystroke === ""){
        matches = await getPopularMedia();

      //if search bar is populated, do keystroke search
    } else {
        /*TO DO: EDIT THIS WITH ACTUAL AUTOCOMPLETE SEARCH LOGIC. 
            -Right now, I'm just supplying dummy data from popular API calls
            -I am getting a separate list of data for each type (movie, game, show), then splitting them equally to fit in matches. 
            -TO DO:Up to your discretion to give importance to which media is a closest match. Movies, Games, or Shows might have different ratio
                in matches depending on the keystroke
        */
        let movie_matches = await getPopularMovies(); //TO DO: Replace with actual logic
        movie_matches = wrapData(movie_matches, "Fixed"); //IMPORTANT: call wrapData on your data list. Replace "Fixed" with {"Game", "Show", or "Movie"}
                                                        //READ COMMENT ON wrapData function for detailed data structure info
        movie_matches = movie_matches.slice(0, MAX_PER_TYPE + 1); //IMPORTANT: Limit how many media matches for each type of media

        let show_matches = await getPopularShows(); 
        show_matches = wrapData(show_matches, "Fixed");
        show_matches = show_matches.slice(0, MAX_PER_TYPE + 1);

        let game_matches = []; //doing empty cause getPopularGames doesn't work yet
        game_matches = wrapData(game_matches, "Fixed");
        game_matches = game_matches.slice(0, MAX_PER_TYPE + 1);

        //combine all the media_matches into matches [KEEP]
        matches = movie_matches.concat(show_matches, game_matches)

        //restrict the matches for only up to MAX_MATCHES [KEEP]
        matches = matches.slice(0, MAX_MATCHES + 1);

        //shuffles the matches list [KEEP MAYBE]
        matches = shuffleArray(matches)
    }

    //return closest matches
    return matches
}


/*
    TO DO...
    Input:
        medias: list of medias to get recommendations from.
    Output:
        matches_dict: {movies: [list of movies recommended], games: [list of games recommended], shows: [list of shows recommended]}
*/
export async function get_recommendations(medias){
    //Max number of matches to return
    let MAX_PER_TYPE = 5;

    //TO DO: populate matches_dict based on your recommendation logic. Right now, I'm just filling it with dummy data.
    let matches_dict = {movies: [], games: [], shows: []};

    //if empty, just return empty dict
    if(medias.length === 0) {
        matches_dict = matches_dict
        //do recommendation logic if dict is not empty
    } else {
        /*
        * TO DO: implement recommendation logic. Rn, I'm just using popular API as dummy data
        */
        let summaries = []
        for (let index in medias) {
            summaries.push(medias[index].summary)
            summaries.push(medias[index].title)
        }

        const queryParams = `items=${encodeURIComponent(JSON.stringify(summaries))}`;
        let result = null
        try {
            console.log('start')
            const response = await fetch(`http://localhost:5000/semanticSearch?${queryParams}`);
            result = await response.json();
          } catch (error) {
            console.error("Error fetching data:", error);
          }

        let movie_matches = result.movies ; //IMPORTANT: call wrapData on your data list. Replace "Fixed" with {"Game", "Show", or "Movie"}
                                                        //READ COMMENT ON wrapData function for detailed data structure info
        // console.info("Movie Matches: " + movie_matches)
        // movie_matches = movie_matches.slice(0, MAX_PER_TYPE + 1); //IMPORTANT: Limit how many media matches for each type of media

        let show_matches = result.tv_shows; 
        // show_matches = show_matches.slice(0, MAX_PER_TYPE + 1);
        // console.error(show_matches)

        let game_matches = result.games; //doing empty cause getPopularGames doesn't work yet
        // game_matches = game_matches.slice(0, MAX_PER_TYPE + 1);

        //assign the dictionary values accordingly before returning [KEEP]
        matches_dict.movies = movie_matches;
        matches_dict.games = game_matches;
        matches_dict.shows = show_matches;

    }

    //return closest matches
    return matches_dict
}

