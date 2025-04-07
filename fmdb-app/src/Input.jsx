import MediaCard from "./assets/components/MediaCard";
import {useState, useEffect} from 'react';
import "./assets/css/Input.css";
import {getPopularMedia, get_closest_keystroke_match, get_recommendations} from "./services/api"

function Input({addToCart, removeFromCart}) {
    const NO_POPULAR_MOVIES_DISPLAYED = 10;
    const [searchQuery, setSearchQuery] = useState("");
    const [medias, setMedias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPopularMedia = async() => {
            try{
                const popularMedia = await getPopularMedia()
                setMedias(popularMedia)
                console.log("Popular media fetched is", popularMedia);
            } catch (error) {
                console.log(error)
                console.error("failed to load popular media", error);
                setError(error)
        } finally {
            setLoading(false)
        }
    }

    loadPopularMedia()
    }, [])

    // This effect runs whenever searchQuery changes
    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const searchResults = await get_closest_keystroke_match(searchQuery);
                setMedias(searchResults);
                console.log("Search results:", searchResults);
            } catch (error) {
                console.error("Failed to search media", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        // Add a small delay to prevent too many API calls while typing
        const debounceTimer = setTimeout(() => {
            fetchSearchResults();
        }, 300);

        // Clean up the timer
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // const [medias, setMedias] = useState([
    //     { id: 1, title: "Inception", type : "Movie", release_date: 2010, hasAddButton: true  },
    //     { id: 2, title: "Django Unchained", type : "Movie", release_date: 2010, hasAddButton: true  },
    //     { id: 3, title: "Dexter", type : "Show", release_date: 2010, hasAddButton: true  },
    //     { id: 4, title: "Breaking Bad", type : "Show", release_date: 2008, hasAddButton: true  },
    //     { id: 5, title: "Mario Odyssey", type : "Game", release_date: 2014, hasAddButton: true  },
    // ]);

    const handleSearch = (e) => {
        e.preventDefault()
        //alert(searchQuery)
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return <main className = "input">

            {/* <div className = "search-title">Search for media</div> */}
            <form onSubmit={handleSearch} className="search-form">
                <input 
                    type="text" 
                    placeholder="Search for media..." 
                    className = "search-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </form>

            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">Error: {error.message}</div>}

            <div className="medias-grid">
                {medias
                    .slice(0, NO_POPULAR_MOVIES_DISPLAYED)
                    .map((media) => 
                        <MediaCard 
                            key={media.id} 
                            media={media} 
                            addToCart={addToCart} 
                            removeFromCart={removeFromCart} 
                        />
                    )}
            </div>
        </main>


}

export default Input