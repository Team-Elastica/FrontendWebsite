import streamlit as st
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Sample dataset (can be replaced with Elasticsearch)
data = pd.DataFrame({
    'title': ["The Last of Us", "Uncharted", "God of War", "Interstellar", "Inception", "Avatar", "Breaking Bad", "Stranger Things", "The Witcher"],
    'type': ["game", "game", "game", "movie", "movie", "movie", "show", "show", "show"],
    'description': [
        "Post-apocalyptic story about survival and relationships.",
        "Treasure-hunting adventure with Nathan Drake.",
        "A warrior's journey through Norse mythology.",
        "A sci-fi exploration of space and love.",
        "Dream exploration with a mind-bending plot.",
        "A visually stunning alien world with rich lore.",
        "A high school teacher turned methamphetamine producer.",
        "A group of kids uncover supernatural mysteries in their town.",
        "A monster hunter's adventures in a dark fantasy world."
    ]
})

# Precompute TF-IDF vectors
tfidf = TfidfVectorizer(stop_words='english')
data['description_tfidf'] = list(tfidf.fit_transform(data['description']).toarray())

# Define recommendation function
def recommend_items(input_title, top_n=5):
    input_item = data[data['title'].str.lower() == input_title.lower()]
    if input_item.empty:
        return []

    input_vector = input_item.iloc[0]['description_tfidf']
    all_vectors = list(data['description_tfidf'])
    
    similarities = cosine_similarity([input_vector], all_vectors).flatten()
    
    data['similarity'] = similarities
    recommendations = data.sort_values(by='similarity', ascending=False)
    return recommendations[recommendations['title'].str.lower() != input_title.lower()][['title', 'type', 'description']].head(top_n)

# Streamlit frontend
def streamlit_ui():
    st.title("Movies and Games Recommender")
    st.write("Enter the name of a game, movie, or show you like, and get similar recommendations!")

    input_title = st.text_input("Enter a movie or game or show title:", "")
    top_n = st.slider("Number of recommendations:", 1, 10, 5)

    if st.button("Get Recommendations"):
        if input_title:
            # Get recommendations locally
            response = recommend_items(input_title, top_n)
            if len(response) == 0:
                st.write("No recommendations found. Please try a different title.")
            else:
                st.write("### Recommendations:")
                movies = response[response['type'] == 'movie']
                games = response[response['type'] == 'game']
                shows = response[response['type'] == 'show'] if 'show' in response['type'].unique() else pd.DataFrame()

                if not movies.empty:
                    st.write("#### Movies:")
                    for _, row in movies.iterrows():
                        st.write(f"**{row['title']}** - {row['description']}")

                if not games.empty:
                    st.write("#### Games:")
                    for _, row in games.iterrows():
                        st.write(f"**{row['title']}** - {row['description']}")

                if not shows.empty:
                    st.write("#### Shows:")
                    for _, row in shows.iterrows():
                        st.write(f"**{row['title']}** - {row['description']}")
        else:
            st.warning("Please enter a valid title!")

if __name__ == '__main__':
    streamlit_ui()