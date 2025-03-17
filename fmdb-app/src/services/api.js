const TMDB_API_KEY = "f227800b9536e9381d2fd17bb3aa3c83";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IGDB_BASE_URL = "https://api.igdb.com/v4";
const IGDB_AUTH_URL = "https://id.twitch.tv/oauth2/token";

const IGDB_CLIENT_ID = "oykdfgwed2b8b6pldfwu48iypp7uj6"
const IGDB_CLIENT_SECRET = "7mgcxf8993bgq820gznpm8lp33i1t4"

const TMDB_IMAGE_PATH = "https://image.tmdb.org/t/p/w500";

let latest_id = 0

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

function wrapData(data, type) {
    //console.log('Data received:', data); // Check the structure
    if (!Array.isArray(data)) {
        throw new Error(`Expected array, but got ${typeof data}`);
    }
    
    return data.map(item => {
        return {
            id: latest_id++, // Ensure unique IDs
            title: type === "Game" ? item.name : item.title || item.name,
            url: type === "Game" 
                ? item.cover?.url || "fallback_url.jpg" // Fallback URL if cover.url is missing
                : item.poster_path || "fallback_url.jpg", // Fallback for posters
            release_date: type === "Game" ? dateToYear(item.first_release_date) : dateToYear(item.release_date) || dateToYear(item.first_air_date),
            type: type,
            hasAddButton: true
        };
    });
}

function dateToYear(date) {
    return new Date(date).getFullYear();
}