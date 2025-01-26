import urllib, json, csv
from bisect import insort
from geopy.distance import geodesic
import overpy
import copy

ACRES_TO_SQMILES = 0.0015625

def is_safe(lat, lon, fires_list) -> bool:
    safe = True
    
    for fire in fires_list:
        if geodesic((lat, lon), (fire['Latitude'], fire['Longitude'])).miles < fire['DangerRadius']:
            safe = False
            break
    return safe

def get_nearest_10_h(lat, lon, danger_rad, listy, lat_field, lon_field):
    near_10 = []
    num_unsafe = 0
    max_unsafe = 5
    for hospital in listy:
        dist = geodesic((lat, lon), (hospital[lat_field], hospital[lon_field])).miles
        hospital['Distance'] = dist
        if dist > danger_rad: hospital['Safe'] = True
        else: hospital['Safe'] = False        
        if num_unsafe == max_unsafe and not hospital['Safe']: continue
        
        if len(near_10) < 10: 
            insort(near_10, hospital, key=lambda x: x['Distance'])
            if not hospital['Safe']: num_unsafe += 1
        elif dist < near_10[9]['Distance']: 
            near_10.pop()
            insort(near_10, hospital, key=lambda x: x['Distance'])
            if not hospital['Safe']: num_unsafe += 1
    return near_10

def get_nearest_10_cc(lat,lon, danger):
    near_10_cc = []
    num_unsafe = 0
    max_unsafe = 5
    with open('static/community_center_data.json', 'r') as file:
        data = json.load(file)

    for element in data:
        name = element["Name"]
        cc_lat = element["Latitude"]
        cc_lon = element["Longitude"]
        dist = geodesic((lat, lon), (cc_lat, cc_lon)).miles

        safe = True
        if dist > danger: 
            safe = True
        else: 
            safe = False            
        if num_unsafe == max_unsafe and not safe: continue

        if (name != "Unknown"):
            cc_data = {"Name": name, "Distance": dist, "Longitude": lon, "Latitude": lat, "Safe": safe}

        if len(near_10_cc) < 10: 
            insort(near_10_cc, cc_data, key=lambda x: x['Distance'])
            if not safe: num_unsafe += 1
        elif dist < near_10_cc[9]['Distance']: 
            near_10_cc.pop()
            insort(near_10_cc, cc_data, key=lambda x: x['Distance'])
            if not safe: num_unsafe += 1
    return near_10_cc

def get_nearest_fires(lat, lon):
    fires_list = cal_fires_api()
    for fire in fires_list:
        fire['Distance'] = geodesic((lat, lon), (fire['Latitude'], fire['Longitude'])).miles
    fires_list.sort(key=lambda x: x['Distance'])
    return fires_list

def cal_fires_api():
    '''calls cal fire api and reformats data'''
    fire_json = urllib.request.urlopen('https://incidents.fire.ca.gov/umbraco/api/IncidentApi/List?inactive=false&year=2025')
    fire_dict = json.loads(fire_json.read())
    attr_list = ['Name', 'Updated', 'Started', 'County', 'Location', 'AcresBurned', 'PercentContained', 'Longitude', 'Latitude', 'Url', 'IsActive']
    processed_fires = [{attr:i[attr] for attr in attr_list} for i in fire_dict]
    for fire in processed_fires: fire['DangerRadius'] = (fire['AcresBurned'] * ACRES_TO_SQMILES) / 2
    return processed_fires

def ca_hospitals_info():
    with open("static/ca_hospitals.csv", 'r') as cah:
        dict_reader = csv.DictReader(cah)
        hospital_list = list(dict_reader)
        for hospital in hospital_list:
            hospital['Latitude'] = float(hospital['Latitude'])
            hospital['Longitude'] = float(hospital['Longitude'])
    return hospital_list

def get_fires_dict():
    processed_fires = cal_fires_api()
    hospital_list = ca_hospitals_info()
    
    for i in range(len(processed_fires)):
        processed_fires[i]['Hospitals'] = copy.deepcopy(get_nearest_10_h(processed_fires[i]['Latitude'],
                                                        processed_fires[i]['Longitude'],
                                                        processed_fires[i]['DangerRadius'],
                                                        hospital_list, 'Latitude', 'Longitude'))

    
        processed_fires[i]['CommunityCenter'] = get_nearest_10_cc(processed_fires[i]['Latitude'],
                                                            processed_fires[i]['Longitude'],
                                                            processed_fires[i]['DangerRadius'])

    return processed_fires

def get_nearest_10_person_h(fires, lat, lon, listy, lat_field, lon_field):
    near_10 = []
    num_unsafe = 0
    max_unsafe = 5
    for hospital in listy:
        dist = geodesic((lat, lon), (hospital[lat_field], hospital[lon_field])).miles
        hospital['Distance'] = dist
        
        hospital['Safe'] = is_safe(lat, lon, fires)
    
        if num_unsafe == max_unsafe and not hospital['Safe']: continue
        
        if len(near_10) < 10: 
            insort(near_10, hospital, key=lambda x: x['Distance'])
            if not hospital['Safe']: num_unsafe += 1
        elif dist < near_10[9]['Distance']: 
            near_10.pop()
            insort(near_10, hospital, key=lambda x: x['Distance'])
            if not hospital['Safe']: num_unsafe += 1
    return near_10

def get_nearest_10_person_cc(fires, lat, lon):
    near_10_cc = []
    num_unsafe = 0
    max_unsafe = 5
    with open('static/community_center_data.json', 'r') as file:
        data = json.load(file)

    for element in data:
        name = element["Name"]
        cc_lat = element["Latitude"]
        cc_lon = element["Longitude"]
        dist = geodesic((lat, lon), (cc_lat, cc_lon)).miles

        safe = is_safe(lat, lon, fires)
            
        if num_unsafe == max_unsafe and not safe: continue

        if (name != "Unknown"):
            cc_data = {"Name": name, "Distance": dist, "Longitude": cc_lat, "Latitude": cc_lon, "Safe": safe}

        if len(near_10_cc) < 10: 
            insort(near_10_cc, cc_data, key=lambda x: x['Distance'])
            if not safe: num_unsafe += 1
        elif dist < near_10_cc[9]['Distance']: 
            near_10_cc.pop()
            insort(near_10_cc, cc_data, key=lambda x: x['Distance'])
            if not safe: num_unsafe += 1
        
    return near_10_cc

def get_person_location_dict(lat, lon):
    processed_fires = get_nearest_fires(lat, lon)
    hospital_list = ca_hospitals_info()
    
    hospital = copy.deepcopy(get_nearest_10_person_h(processed_fires,
                            lat, lon, hospital_list, 'Latitude', 'Longitude'))

    
    community_center = get_nearest_10_person_cc(processed_fires, lat, lon)

    info_dict = {"Fires": processed_fires, "Hospitals": hospital, "CommunityCenter": community_center}
    return info_dict