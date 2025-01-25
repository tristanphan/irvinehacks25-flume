import urllib.parse
import urllib.request
from flask import Flask, session, redirect, url_for
import urllib, json, csv

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def index():
    fire_json = urllib.request.urlopen('https://incidents.fire.ca.gov/umbraco/api/IncidentApi/List?inactive=false&year=2025')
    fire_dict = json.loads(fire_json.read())
    attr_list = ['Name', 'Updated', 'Started', 'County', 'Location', 'AcresBurned', 'PercentContained', 'Longitude', 'Latitude', 'Url', 'IsActive']
    processed_fire_dict = [{attr:i[attr] for attr in attr_list} for i in fire_dict]
    
    with open('./static/ca-hospitalbuildingdata.csv', 'r') as file:
        reader = csv.reader(file)
        rows = list(reader)
    
    # keep_indices = [0, 2, 3, 8, 15, 16]
    # fac_names = set()
    # newrows = []
    # for j in range(len(rows)):
    #     tent_r = [rows[j][i] for i in range(18) if i in keep_indices]
    #     if tent_r[1] not in fac_names:
    #         newrows.append(tent_r)
    #         if j != 0:
    #             fac_names.add(tent_r[1])

    # with open('output.csv', 'w', newline='') as csvfile:
    #     writer = csv.writer(csvfile)
    #     writer.writerows(newrows)
            
    
    return processed_fire_dict

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