import MediaCard from "./assets/components/MediaCard";
import {useState, useEffect} from 'react';
import "./assets/css/Input.css";
import {getPopularMedia} from "./services/api"

function Input({addToCart, removeFromCart}) {
    const NO_POPULAR_MOVIES_DISPLAYED = 19;
    const [searchQuery, setSearchQuery] = useState("")
    const [medias, setMedias] = useState([])

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

    // const [medias, setMedias] = useState([
    //     { id: 1, title: "Inception", type : "Movie", release_date: 2010, hasAddButton: true  },
    //     { id: 2, title: "Django Unchained", type : "Movie", release_date: 2010, hasAddButton: true  },
    //     { id: 3, title: "Dexter", type : "Show", release_date: 2010, hasAddButton: true  },
    //     { id: 4, title: "Breaking Bad", type : "Show", release_date: 2008, hasAddButton: true  },
    //     { id: 5, title: "Mario Odyssey", type : "Game", release_date: 2014, hasAddButton: true  },
    // ]);

    const handleSearch = (e) => {
        e.preventDefault()
        alert(searchQuery)
        setSearchQuery("------")
    };

    return <main className = "input">

            <div className = "search-title">Search for media</div>
            <form onSubmit={handleSearch} className="search-form">
                <input 
                    type="text" 
                    placeholder="search for media..." 
                    className = "search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>

            <div className="medias-grid">
                {/*only show first 10 */}
                {medias
                    .filter(media => media.title.toLowerCase().startsWith(searchQuery.toLowerCase()))
                    .slice(0, NO_POPULAR_MOVIES_DISPLAYED) // Limit to the first 10 items
                    .map((media) => 
                        <MediaCard key={media.id} media={media} addToCart={addToCart} removeFromCart={removeFromCart} />
                    )}
            </div>
        </main>


}

export default Input