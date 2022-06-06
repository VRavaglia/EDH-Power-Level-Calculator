import pandas as pd
import numpy as np
import sys

path = 'default-cards-20220605210451.json'
df = pd.read_json(path, orient='records')


basics = ['Forest', 'Mountain', 'Plains', 'Island', 'Swamp']
rarityprob = {"common": 1/10,
             "uncommon": 1/3,
             "rare": 1,
              "special": 1,
             "mythic": 8}


# deck = 'Faldorn.untap.txt'
# deck = 'Go-Shintai(3).txt'
# deck = 'Galea.untap.txt'
# deck = 'willowdusk.txt'
# deck = 'Dungeon.untap.txt'
# deck = 'GoShintaiCDH.txt'
# deck = 'Lulu Pauper(2).txt'
# deck = 'Sarrei_1.txt'
# deck = 'Narrili.txt'
# deck = 'Brago.untap.txt'

deck = str(sys.argv[1])


def mamarank(preco, edh, sets, rar):
    return np.log(preco/edh/sets/rar)+10

f = open(deck, "r")
cardnames = []
cardamounts = []

for row in f:
    if row[0:2] != '//':
        
        number = True
        amount = ''
        name = ''
        for c in row:
            if c == ' ' and number:
                number = False
            elif c != '\n' and c != '':
                if number:
                    amount += c
                else:
                    name += c
        if (not name in basics) and amount != '':
            print(row)
            cardnames.append(name)
            cardamounts.append(int(amount))




dfsize = df.shape[0]

mEDH = 0
mP = 0
sumedh = 0
sump = 0
ranks = {}

# row = df[df.iloc[:, 8] == cardnames[0]].iloc[0]

for cardname in cardnames:
    row2 = df[df.iloc[:, 8] == cardname]
    if not row2.empty:
        row = row2.iloc[0]
        
        edh = row['edhrec_rank']
        price = row['prices']['usd']
        
        if not np.isnan(edh):
            sumedh += edh
            mEDH += 1
        if price != None:
            sump += float(price)
        mP += 1
    
        
for cardname in cardnames:
    row2 = df[df.iloc[:, 8] == cardname]
    if not row2.empty:
        row = row2.iloc[0]
        name = row['name']
        edh = row['edhrec_rank']
        price = row['prices']['usd']
        rar = rarityprob[row['rarity']]
        sets = len(df[df.iloc[:, 8] == cardname]['name'])
        
        if np.isnan(edh):
            edh = sumedh/mEDH
        if price == None:
            price = sump/mP
        else:
            price = float(price)
            
        ranks[name] = mamarank(price, edh, sets, rar)

sorted = {k: v for k, v in sorted(ranks.items(), key=lambda item: item[1])}



totalrank = 0
keys = list(sorted.keys())
values = list(sorted.values())

print("\nMAMARANKs: \n")

for i in range(0, len(keys)):
    totalrank += values[i]
    print(keys[i], ": ", round(values[i], 2))
    
print("\nTotal MAMARANK: ", round(totalrank, 2))

