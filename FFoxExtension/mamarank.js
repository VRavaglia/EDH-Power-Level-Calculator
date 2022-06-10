window.addEventListener('load', function () {
    var stats = document.getElementsByClassName("meta")[1];
    stats.innerHTML += "Mamarank:&nbsp;<span class=\"sc-jtggT iJBTkC\">202.2</span>"
  })

async function fetchAsync (url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function mamarank(preco, edh, sets, rar){
    return log(preco/edh/sets/rar)+10
}

// $.getJSON("test.json", function(json) {
//     console.log(json); // this will show the info it in firebug console
// });

function loadCards(cards){
    // console.log(cards)
    console.log(scryfall)
    for (let index = 0; index < cards.length; index++) {
        const name = cards[index].card.oracleCard.name;
        // console.log(name);
    }
}

const deck = fetchAsync("https://archidekt.com/api/decks/2758814/");
deck.then((data) => loadCards(data.cards));
