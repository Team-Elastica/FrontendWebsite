from flask import Flask, request, jsonify
from flask_cors import CORS
from elasticsearch import Elasticsearch  

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Connect to Elasticsearch running in Docker
es = Elasticsearch(
  "https://localhost:9200",
  api_key="Q1MwNk81WUI3TTE1bXZ3X2RnTlE6ZVYxZFZEcmNSaGlLaFNST1IybUNvdw=="
)

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("query", "").strip()
    mpt = request.args.get("mpt", "").strip()
    
    if not query:
        return jsonify({"results": []})

    # search_query = {
    #     "size": 10,
    #     "query": {
    #         "multi_match": {
    #             "query": query,
    #             "fields": [
    #                 "title", "Title", "name"
    #             ],
    #             "fuzziness": "AUTO",
    #         }
    #     }
    # }

    search_query = {
        "size": 10,
        "query": {
            "bool": {
                "must": {
                    "multi_match": {
                        "query": query,
                        "fields": [
                            "title", "Title", "name"
                        ],
                        "fuzziness": "AUTO"
                    }
                },
                "filter": {
                    "term": {
                        "adult": False
                    }
                }
            }
        }
    }

#     search_query = {
#     "size": 10,
#     "query": {
#         "bool": {
#             "must": {
#                 "multi_match": {
#                     "query": query,
#                     "fields": [
#                         "title", "Title", "name"
#                     ],
#                     "fuzziness": "AUTO"
#                 }
#             },
#             "should": [
#                 {
#                     "bool": {
#                         "must": {
#                             "term": { "_index": "game" }
#                         }
#                     }
#                 },
#                 {
#                     "bool": {
#                         "must": [
#                             { "term": { "_index": "movie" } },
#                             { "term": { "adult": False } }
#                         ]
#                     }
#                 },
#                 {
#                     "bool": {
#                         "must": [
#                             { "term": { "_index": "tv_show" } },
#                             { "term": { "adult": False } }
#                         ]
#                     }
#                 }
#             ],
#             "minimum_should_match": 1
#         }
#     }
# }

    movie = "movie"
    tvShow = "tv_show"
    game = "game"

    indices = [movie, tvShow, game]
    response = es.search(index=",".join(indices), body=search_query)

    results = []
    for hit in response["hits"]["hits"]:
        source = hit["_source"]
        results.append({
            "id": hit["_id"],
            "title": source.get("title") or source.get("Title") or source.get("name"),
            "poster_path": source.get("poster_path") if hit["_index"] == movie else source.get("poster_path") if hit["_index"] == tvShow else "_placeholder_",
            "release_date": source.get("release_date") if hit["_index"] == movie else source.get("first_air_date") if hit["_index"] == tvShow else source.get("Release_Date"),
            "summary": source.get("overview") if hit["_index"] == movie else source.get("overview") if hit["_index"] == tvShow else source.get("Summary"),
            "genres": source.get("genres") if hit["_index"] == movie else source.get("genres") if hit["_index"] == tvShow else source.get("Genres"),
            "type": "Movie" if hit["_index"] == movie else "TV Show" if hit["_index"] == tvShow else "Game",
        })

    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(debug=True, port=5050)
