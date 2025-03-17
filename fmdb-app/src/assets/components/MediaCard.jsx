import "../css/MediaCard.css";

//media.url, media.title, media.type, media.release_date, media.hasAddButton
function MediaCard({media, addToCart, removeFromCart}) {

    function onFavouriteClick() {
        alert("clicked on favourite button");
    }

    function onCancelClick() {
        removeFromCart(media);
        //alert("clicked on cancel button");
    }

    function onAddClick() {
        addToCart(media);
        //alert("clicked on add button");
    }

    return <div className="media-card">
        <div className = "media-poster">
            <img src={`https://image.tmdb.org/t/p/w500${media.url}`} alt={media.title}></img>
        </div>
        <div className="media-overlay">
            <button className="favourite-btn" onClick={onFavouriteClick}>
                ❤️
            </button>

            {/* renders EITHER add or cancel button */}
            {!media.hasAddButton && <button className="cancel-btn" onClick={onCancelClick}>
                ❌
            </button>}

            {media.hasAddButton && <button className="add-btn" onClick={onAddClick}>
                ➕
            </button>}
        </div>

        <div className="media-info">
            <h3>{`${media.title}(${media.release_date})`}</h3>
            <h3>{media.type}</h3>
        </div>
    </div>
}

export default MediaCard;