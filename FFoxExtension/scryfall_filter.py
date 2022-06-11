import json

with open('scryfall_full.json', 'r') as data_file:
    data = json.load(data_file)

keylist = ["prices", "edhrec_rank", "rarity", "name"]

for element in data:
    keys_to_remove = []
    for key in element.keys():
        if not (key in keylist):
            keys_to_remove.append(key)
    for key in keys_to_remove:
        element.pop(key, None)    

with open('scryfall.json_txt', 'w') as data_file:
    data = json.dump(data, data_file)