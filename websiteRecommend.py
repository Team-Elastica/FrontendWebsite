import streamlit as st
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
from PIL import Image
from io import BytesIO

#GLOBAL VARIABLES
# st.session_state.dict_media
# st.session_state.dict_img_input


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

# # Define recommendation function
# def recommend_items(input_title, top_n=5):
#     input_item = data[data['title'].str.lower() == input_title.lower()]
#     if input_item.empty:
#         return []

#     input_vector = input_item.iloc[0]['description_tfidf']
#     all_vectors = list(data['description_tfidf'])
    
#     similarities = cosine_similarity([input_vector], all_vectors).flatten()
    
#     data['similarity'] = similarities
#     recommendations = data.sort_values(by='similarity', ascending=False)
#     return recommendations[recommendations['title'].str.lower() != input_title.lower()][['title', 'type', 'description']].head(top_n)

#returns recommended media by type
def recommend_items(input_title, top_n=3):
    dict_result = {"movies": ["Ready Player One"], "shows": ["Hyperdrive"], "games": ["Mario Kart 8 Deluxe"]}

    return dict_result

#get poster image from media title
def get_image(media_title):
    api_key = "6fc2c34f9666f380bbdb969c87593948e3745646d729670ae8ce457156c6c2ac"
    url = f"https://serpapi.com/search.json?q={media_title}+poster+high+res&tbm=isch&api_key={api_key}"
    response = requests.get(url).json()
    image_url = response["images_results"][0]["original"]
    return image_url

#dict looks like {"movies": [], "shows": [], "games": []}
def set_up_media_dict():
    return {"movies": [], "shows": [], "games": []}

def set_up_image_input_dict():
    return {"movies": [], "shows": [], "games": []}

# Initialize dict_img_input in session_state if not exists
if "dict_img_input" not in st.session_state:
    st.session_state.dict_img_input = set_up_image_input_dict()

# Initialize dict_media in session_state if not exists
if "dict_media" not in st.session_state:
    st.session_state.dict_media = set_up_media_dict()

#add img to dict_img_input
def add_to_input_dict_img_input(img):
    st.session_state.dict_img_input["movies"].append(img)

# Adds title to the dict
def update_dict(input_title):
    #TESTING, only adds to the movies dict
    st.session_state.dict_media["movies"].append(input_title)
    st.session_state.input_title = ""  # Clear input after Enter

def is_dict_empty(dict):
    # Check if any value in the dictionary is not empty
    if any(bool(value) for value in dict.values()):
        return False
    else:
        return True

def handle_image(title_image):
        image_url = get_image(title_image) 
        response = requests.get(image_url)
        img = Image.open(BytesIO(response.content))
        img = img.resize((150, 200))
        #st.image(img, caption=title_image, use_column_width=False)
        return img

def handle_title_press():
    input_title = st.session_state.input_title.strip()

    if input_title:
        # Add title to dictionary
        update_dict(input_title)  # Pass input_title

        #get image from the title name
        img = handle_image(input_title)

        #add to input dict img
        add_to_input_dict_img_input(img)


        # # Fetch and display poster image
        # try:
        #     image_url = get_image(input_title)  # Get image URL
        #     if image_url:  # Ensure URL is valid
        #         response = requests.get(image_url)
        #         if response.status_code == 200:  # Check if request was successful
        #             img = Image.open(BytesIO(response.content))
        #             st.image(img, caption=input_title)
        #         else:
        #             st.warning("Failed to load image.")
        #     else:
        #         st.warning("No image found for this title.")
        # except Exception as e:
        #     st.error(f"Error loading image: {e}")

def draw_input_imgs():
    movies = st.session_state.dict_img_input["movies"]
    shows = st.session_state.dict_img_input["shows"]
    games = st.session_state.dict_img_input["games"]

    all_images = movies + shows + games  # Combine all images
    num_images = len(all_images)

    cols = st.columns(3)  # Create 3 columns

    for idx, img in enumerate(all_images):
        col = cols[idx % 3]  # Distribute images across columns
        with col:
            st.image(img, use_container_width=True)

def draw_movies(response_dict):
    title_list = response_dict["movies"]
    all_images = []

    for title in title_list:
        all_images.append(handle_image(title))
    num_images = len(all_images)

    cols = st.columns(3)  # Create 3 columns

    for idx, img in enumerate(all_images):
        col = cols[idx % 3]  # Distribute images across columns
        with col:
            st.image(img, use_container_width=True)


def draw_games(response_dict):
    title_list = response_dict["games"]
    all_images = []

    for title in title_list:
        all_images.append(handle_image(title))

    num_images = len(all_images)

    cols = st.columns(3)  # Create 3 columns

    for idx, img in enumerate(all_images):
        col = cols[idx % 3]  # Distribute images across columns
        with col:
            st.image(img, use_container_width=True)
  


def draw_shows(response_dict):
    title_list = response_dict["shows"]
    all_images = []

    for title in title_list:
        all_images.append(handle_image(title))
    num_images = len(all_images)

    cols = st.columns(3)  # Create 3 columns

    for idx, img in enumerate(all_images):
        col = cols[idx % 3]  # Distribute images across columns
        with col:
            st.image(img, use_container_width=True)



# Streamlit frontend
def streamlit_ui():
    st.markdown("<h1 style='font-size: 80px;'>fmDB</h1>", unsafe_allow_html=True)
    st.write("Enter the name of a game, movie, or show you like, and get similar recommendations!")

    # Text input with callback on Enter key press
    st.text_input("Enter title:", key="input_title", on_change=handle_title_press)

    #draw all input imgs
    draw_input_imgs()

    top_n = st.number_input("Number of recommendations:", min_value=0, max_value=10, value=0, step=1)

    if st.button("Get Recommendations"):
        #only gets recommendation when inputs aren't empty
        if not is_dict_empty(st.session_state.dict_media):
            # Get recommendations locally
            response_dict = recommend_items(top_n)
            if is_dict_empty(response_dict):
                st.write("No recommendations found. Please try a different title.")
            else:
                if len(response_dict["movies"]) != 0:
                    st.write("#### Movies:")
                    draw_movies(response_dict)

                if len(response_dict["games"]) != 0:
                    st.write("#### Games:")
                    draw_games(response_dict)

                if len(response_dict["shows"]) != 0:
                    st.write("#### Shows:")
                    draw_shows(response_dict)

        else:
            st.warning("No Input Detected.")

if __name__ == '__main__':
    streamlit_ui()