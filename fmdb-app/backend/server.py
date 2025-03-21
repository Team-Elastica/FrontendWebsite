from flask import Flask, request, json

app = Flask(__name__)

@app.route("/semanticSearch", methods=["GET"])
def data():
    items_str = request.args.get('items', '[]')
    print(items_str)
    return items_str

if __name__ == "__main__":
    app.run(debug=True)
