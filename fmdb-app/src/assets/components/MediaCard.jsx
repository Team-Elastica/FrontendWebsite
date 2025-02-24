import "../css/MediaCard.css";

//media.url, media.title, media.release_date
function MediaCard({media}) {

    function onFavouriteClick() {
        alert("clicked on favourite button");
    }

    function onCancelClick() {
        alert("clicked on cancel button");
    }
    
    return <div className="media-card">
        <div className = "media-poster">
            <img src={media.url} alt={media.title}></img>
        </div>
        <div className="media-overlay">
            <button className="favourite-btn" onClick={onFavouriteClick}>
                ❤️
            </button>
            <button className="cancel-btn" onClick={onCancelClick}>
                ❌
            </button>
        </div>

        <div className="media-info">
            <h3>{media.title}</h3>
            <p>{media.release_date}</p>
        </div>
    </div>
}

export default MediaCard;