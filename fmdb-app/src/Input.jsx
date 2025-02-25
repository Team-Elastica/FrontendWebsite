import MediaCard from "./assets/components/MediaCard";
import {useState, useEffect} from 'react'

function Input(){
    const [searchQuery, setSearchQuery] = useState("")
    //const [medias, setMedias] = useState([])

    const [medias, setMedias] = useState([
        { id: 1, title: "Inception", release_date: 2010 },
        { id: 2, title: "Breaking Bad", release_date: 2008 },
        { id: 3, title: "Interstellar", release_date: 2014 },
    ]);

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
                {medias.map(
                    (media) =>
                        <MediaCard key={media.id} media={media} />
                )}
            </div>
        </main>


}

export default Input