import urllib.request
import urllib.parse
import urllib.request
import urllib.request
from flask import Flask, jsonify
import urllib, json, csv
from api import *

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def index():
    fires_dict = get_fires_dict()
    
    return jsonify(fires_dict), 200

@app.route("/OpenStreetView", methods=['GET', 'POST'])
def OpenStreetViewAPI(): 
    query = """
    [out:json];
    area["name"="California"]->.searchArea;
    node["amenity"="community_centre"](area.searchArea);
    out body;
    """
    
    encoded_query = urllib.parse.urlencode({'data': query})
    
    url = "http://overpass-api.de/api/interpreter"
    final_url = f"{url}?{encoded_query}"    

    with urllib.request.urlopen(final_url) as response:
        data = json.loads(response.read().decode())

    for element in data['elements']:
        name = element['tags'].get('name', 'Unknown')
        lat = element['lat']
        lon = element['lon']
        return_data = f"Name: {name}, Location: ({lat}, {lon})"
        
    return return_data, 400