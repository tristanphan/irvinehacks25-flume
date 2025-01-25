import urllib, json, csv

def get_fires_dict():
    fire_json = urllib.request.urlopen('https://incidents.fire.ca.gov/umbraco/api/IncidentApi/List?inactive=false&year=2025')
    fire_dict = json.loads(fire_json.read())
    attr_list = ['Name', 'Updated', 'Started', 'County', 'Location', 'AcresBurned', 'PercentContained', 'Longitude', 'Latitude', 'Url', 'IsActive']
    processed_fire_dict = [{attr:i[attr] for attr in attr_list} for i in fire_dict]
    # print(processed_fire_dict)
    
    return processed_fire_dict