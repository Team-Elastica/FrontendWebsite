
const IMAGE_API = "https://image.tmdb.org/t/p/w1280"

const setVoteClass = (vote) => {
    if (vote >= 8){
        return "green";
    } else if (vote >= 6){
        return "orange";
    } else {   
        return "red";
    }
}

function Movie({title, poster_path, overview, vote_average}){
    return (
        <div className="movie"> 
            <img src={poster_path ? (IMAGE_API + poster_path) : 
                'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'} alt={title} />
            {/* Different classes  */}
            <div className="movie-info">
                <h3>{title}</h3>
                <span className={
                    `tag ${setVoteClass(vote_average)}`
                    }>
                    {vote_average.toFixed(1)}</span>
            </div>

            <div className="movie-over">   
                <h2>Overview:</h2>
                <p>{overview}</p>
            </div>
        </div>
    )
}

export default Movie;