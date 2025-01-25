import urllib, json, csv
from bisect import insort
from geopy.distance import geodesic
import overpy
import copy

ACRES_TO_SQMILES = 0.0015625

def get_nearest_10_h(lat, lon, danger_rad, listy, lat_field, lon_field):
    near_10 = []
    for hospital in listy:
        dist = geodesic((lat, lon), (hospital[lat_field], hospital[lon_field])).miles
        hospital['Distance'] = dist
        if dist > danger_rad: hospital['Safe'] = True
        else: hospital['Safe'] = False
        
        if len(near_10) < 10: 
            insort(near_10, hospital, key=lambda x: x['Distance'])
        elif dist < near_10[9]['Distance']: 
            near_10.pop()
            insort(near_10, hospital, key=lambda x: x['Distance'])
    return near_10

def get_nearest_10_cc(lat, lon, danger):
    near_10_cc = []
    api = overpy.Overpass()
    
    query = f"""
    (
        area["name"="California"]->.searchArea;
        node["amenity"="community_centre"](around:{5000},{lat},{lon});
    );
    out body;
    """
    result = api.query(query)
    print(result)
    encoded_query = urllib.parse.urlencode({'data': query})
    
    url = "http://overpass-api.de/api/interpreter"
    final_url = f"{url}?{encoded_query}"    

    with urllib.request.urlopen(final_url) as response:
        data = json.loads(response.read().decode())

    for element in data['elements']:
        name = element['tags'].get('name', 'Unknown')
        cc_lat = element['lat']
        cc_lon = element['lon']
        dist = geodesic((lat, lon), (cc_lat, cc_lon)).miles

        safe = True
        if dist > danger: 
            safe = True
        else: 
            safe = False

        if (name != "Unknown"):
            cc_data = f'{{"Name": "{name}", "Distance": {dist}, "Longitude": {lon}, "Latitude": {lat}, "Safe": {safe}}}'
        
        if len(near_10_cc) < 10: 
            insort(near_10_cc, cc_data, key=lambda x: x['Distance'])
        elif dist < cc_data[9]['Distance']: 
            cc_data.pop()
            insort(near_10_cc, cc_data, key=lambda x: x['Distance'])

    print(near_10_cc)
    return near_10_cc

def get_fires_dict():
    fire_json = urllib.request.urlopen('https://incidents.fire.ca.gov/umbraco/api/IncidentApi/List?inactive=false&year=2025')
    fire_dict = json.loads(fire_json.read())
    attr_list = ['Name', 'Updated', 'Started', 'County', 'Location', 'AcresBurned', 'PercentContained', 'Longitude', 'Latitude', 'Url', 'IsActive']
    processed_fires = [{attr:i[attr] for attr in attr_list} for i in fire_dict]
    for fire in processed_fires: fire['DangerRadius'] = (fire['AcresBurned'] * ACRES_TO_SQMILES) / 2
    
    with open("static/ca_hospitals.csv", 'r') as cah:
        dict_reader = csv.DictReader(cah)
        hospital_list = list(dict_reader)
        for hospital in hospital_list:
            hospital['Latitude'] = float(hospital['Latitude'])
            hospital['Longitude'] = float(hospital['Longitude'])
    
    for i in range(len(processed_fires)):
        processed_fires[i]['Hospitals'] = copy.deepcopy(get_nearest_10_h(processed_fires[i]['Latitude'],
                                                        processed_fires[i]['Longitude'],
                                                        processed_fires[i]['DangerRadius'],
                                                        hospital_list, 'Latitude', 'Longitude'))

    print(get_nearest_10_cc(processed_fires[0]['Latitude'],
                      processed_fires[0]['Longitude'],
                      processed_fires[0]['DangerRadius']))
    
    return processed_fires