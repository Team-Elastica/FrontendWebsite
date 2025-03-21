from flask import Flask, request, json
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from elasticsearch import Elasticsearch
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

model = SentenceTransformer('all-MiniLM-L6-v2')

client = Elasticsearch(
  "https://localhost:9200",
  api_key="elhUTjhaUUJiM0VoczFmMGl6bmM6b1lLbjljeGNRTEMyc0RRN1A4RmtPdw=="
)

@app.route("/semanticSearch", methods=["GET"])
def semanticSearch():

    items = request.args.get('items')

    try:
        items = json.loads(items)
    except json.JSONDecodeError:
        return {"error": "Invalid input format. Expected JSON array."}, 400

    inputQuery=[]

    for item in items:
        if item != "":
            inputQuery.append(model.encode(item))

    # average = pd.DataFrame(inputQuery).mean().tolist()
    average = np.mean(inputQuery, axis=0).tolist()

    # https://medium.com/@bairagiabhishek03/elasticsearch-as-a-vector-store-es-tutorial-5-816f9451ddc1
    query = {
        "script_score": {
            "query": {"match_all": {}},
            "script": {
                "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                "params": {
                    "query_vector": average
                }
            }
        }
    }

    movieResponse = client.search(size=5, source_excludes='embedding', index='semantic_movie', query=query)
    tvShowResponse = client.search(size=5, source_excludes='embedding', index='semantic_tv', query=query)
    gameResponse = client.search(size=5, source_excludes='embedding' ,index='semantic_game', query=query)

    movies = [hit['_source'] for hit in movieResponse['hits']['hits']]
    tv_shows = [hit['_source'] for hit in tvShowResponse['hits']['hits']]
    games = [hit['_source'] for hit in gameResponse['hits']['hits']]

    print(movies)

    return {"movies": movies, "tv_shows": tv_shows, "games": games}

if __name__ == "__main__":
    app.run(debug=True) 
