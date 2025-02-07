import urllib.request
import urllib.parse
import urllib.request
import urllib.request
from flask import Flask, session, redirect, url_for, request
from flask_cors import CORS, cross_origin
import urllib, json, csv
from api import *

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        fires_dict = get_fires_dict()
        return fires_dict
    else: 
        data = json.loads(request.data)
        lat = data.get('latitude')
        lon = data.get('longitude')
        return get_person_location_dict(lat, lon)


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
    api_url = f"{url}?{encoded_query}"    

    with urllib.request.urlopen(api_url) as response:
        data = json.loads(response.read().decode())

    return_data = "["
    for element in data['elements']:
        name = element['tags'].get('name', 'Unknown')
        lat = element['lat']
        lon = element['lon']
        if (name != "Unknown"):
            return_data += f'{{"Name": "{name}", "Longitude": {lon}, "Latitude": {lat}}},'
    return_data = return_data.rstrip(",")
    return_data += "]"

    community_centers = json.loads(return_data);
        
    with open("static/community_center_data.json", "w") as file:
        json.dump(community_centers, file, indent=4)

    return community_centers, 200