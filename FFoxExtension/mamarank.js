// window.addEventListener('load', function () {
//     let stats = document.getElementsByClassName("meta")[1];
//     stats.innerHTML += "Mamarank:&nbsp;<span class=\"sc-jtggT iJBTkC\">202.2</span>"
//   })

async function fetchAsync (url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function mamarank(price, edh, sets, rar){
    if (sets == 0 ){
        return 0;
    }
    const temp = price/edh/sets/rar;
    
    return Math.log(temp)+10
}

function fillmeans(prices){
    let priceAmount = 0;
    let priceSum= 0;
    for (let i = 0; i < prices.length; i++) {
        if(prices[i] > 0 && !isNaN(prices[i])){
            priceSum += prices[i];
            priceAmount += 1;
        }
    }

    for (let i = 0; i < prices.length; i++) {
        if(isNaN(prices[i]) || prices[i] == 0){
            prices[i] = priceSum/priceAmount;     
        }
    }
}

function loadCardsDeck(cards, scryfall){
    console.log(cards)
    const clength = cards.length
    // console.log(scryfall)

    prices = new Array(clength).fill(0);
    edhrecRanks = new Array(clength).fill(0);
    rarities = new Array(clength).fill(0);
    sets = new Array(clength).fill(0);
    names = []

    // console.log(scryfall)
    for (let sidx = 0; sidx < scryfall.length; sidx++) {
        for (let cidx = 0; cidx < cards.length; cidx++) {
            const cname = cards[cidx].card.oracleCard.name;
            const scard = scryfall[sidx];
            // console.log(cname);
            // console.log(scryfall[sidx].name);
            if (cname === scard.name){
                if(!(basics.includes(cname))){
                    // console.log(cname)
                    sets[cidx] += 1;

                    if(sets[cidx] == 1){
                        prices[cidx] = Number(scard.prices.usd);
                        edhrecRanks[cidx] = Number(scard.edhrec_rank);
                        rarities[cidx] = Number(rarityprob[scard.rarity]);
                        names.push(cname);
                    }
                    else{
                        if(scard.prices.usd > 0){
                            prices[cidx] = Math.min(prices[cidx], Number(scard.prices.usd));
                        }
                        rarities[cidx] = Math.min(rarities[cidx], Number(rarityprob[scard.rarity]));
                        if(scard.edhrec_rank > 0){
                            edhrecRanks[cidx] = Math.min(edhrecRanks[cidx], Number(scard.edhrec_rank));
                        }   
                    }        
                }        
            }
        }
    }

    fillmeans(prices);
    fillmeans(edhrecRanks);
    mamaranks = new Array(clength).fill(0);
    for (let cidx = 0; cidx < names.length; cidx++) {
        mamaranks[cidx] = mamarank(prices[cidx], edhrecRanks[cidx], sets[cidx], rarities[cidx]);
    }
    fillmeans(mamaranks);

    for (let cidx = 0; cidx < names.length; cidx++) {
        // console.log("Name: ", names[cidx], " MinPrice: ", prices[cidx], " EDHRank: ", edhrecRanks[cidx], " Rarity: ", rarities[cidx], " Sets: ", sets[cidx])
        console.log("Name: ", names[cidx], " - Mamarank: ", mamaranks[cidx]);
    }

    mamaTotal = mamaranks.reduce((partialSum, a) => partialSum + a, 0);
    console.log("\nTotal: ", mamaTotal);
    let stats = document.getElementsByClassName("meta")[1];

    
    const new_header1 = "<span>Mamarank:</span>"
    const new_header2 = "<span class=\"sc-jtggT iJBTkC\">"+Number((mamaTotal).toFixed(1))+ "</span>"
 
    const parser = new DOMParser()
    const parsed = parser.parseFromString(new_header1, `text/html`)
    const parsed2 = parser.parseFromString(new_header2, `text/html`)
    const tags = parsed.getElementsByTagName(`span`)
    const tags2 = parsed2.getElementsByTagName(`span`)
    
    // stats.innerHTML = ``
    for (const tag of tags) {
        stats.appendChild(tag)
    }
    stats = document.getElementsByClassName("meta")[1];
    for (const tag of tags2) {
        stats.appendChild(tag)
    }


    
}

const basics = ['Forest', 'Mountain', 'Plains', 'Island', 'Swamp']
const rarityprob = {"common": 1/10,
             "uncommon": 1/3,
             "rare": 1,
              "special": 1,
             "mythic": 8}

const scryfall = fetchAsync(browser.runtime.getURL("./scryfall.json_txt"));

console.log("Start");

let currentPage = location.href;
let start = true;
setInterval(function()
{
    if (currentPage != location.href || start)
    {
        start = false;
        // page has changed, set new page as 'current'
        currentPage = location.href;
        console.log(window.location.href);
        if(currentPage.includes("decks")){
            const windowloc = window.location.href;
            const archidecktApi = "https://archidekt.com/api/decks/" + windowloc.slice(windowloc.indexOf("decks")+6, windowloc.indexOf("#")) + "/";
            console.log(archidecktApi);
            const deck = fetchAsync(archidecktApi);
            scryfall.then((dataS) => deck.then((data) => loadCardsDeck(data.cards, dataS)));
        } 
    }
}, 1000);



