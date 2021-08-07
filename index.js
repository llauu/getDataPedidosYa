const Axios = require('axios');
const fs = require('fs');

const resultadosMaximosATraer = 150;

const urlRequest = `https://www.pedidosya.com.ar/mobile/v5/shopList?businessType=RESTAURANT&country=3&includePaymentMethods=Decidir%2CSpreedly%20AR&max=${resultadosMaximosATraer}&offset=0&point=-34.829399%2C-58.3855751&sortBy=default&withFilters=true`

const headers = {
    'authority': 'www.pedidosya.com.ar',
    'method': 'GET',
    'path': '/mobile/v5/shopList?businessType=RESTAURANT&country=3&includePaymentMethods=Decidir%2CSpreedly%20AR&max=30&offset=0&point=-34.829399%2C-58.3855751&sortBy=default&withFilters=true',
    'scheme': 'https',
    'accept': 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en,es-ES;q=0.9,es;q=0.8,pt;q=0.7',
    'cookie': 'wordfence_verifiedHuman=cd503d9d12541c9b5c3a5ba50f2e310a; _hjid=af84bbd4-91b6-424c-a710-5fec9010a3a0; perseusRolloutSplit=6; dhhPerseusGuestId=1628298861653.805164869984520800.czusj9okvpj; _gcl_au=1.1.926920834.1628298851; _fbp=fb.2.1628298851003.1498615805; __Secure-peya.sid=s%3A2da3efb2-6786-45c8-8f50-dd6291f83382.XmQ8n2jE3TnuZ14OUcju6q1cKt92sJ6lvSry8QAUwKA; __Secure-peyas.sid=s%3Aa9069b2a-5532-4933-9274-af121c3f5b08.vFUpm4gFwWsiUKGb%2FoIPIrX8dW5H92mZKwD1fGZgils; dhhPerseusSessionId=1628316388122.496717641308933100.fmgetn2l1o6; _hjAbsoluteSessionInProgress=0; _hjIncludedInPageviewSample=1; _hjIncludedInSessionSample=0; _tq_id.TV-81819090-1.20dc=59247a1739227c94.1628298853.0.1628318007..; dhhPerseusHitId=1628318054094.938885139526005600.hp2x2q0gi7u',
    'referer': 'https://www.pedidosya.com.ar/restaurantes?address=Alem%20Norte%201185&city=Almirante%20Brown&lat=-34.829399&lng=-58.3855751',
    'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
}


const parserRestaurantData = (restaurant) => {
    return {
        'name': restaurant?.name,
        'categorias': restaurant?.allCategories,
        'precioPromedio': restaurant?.averagePrice,
        'descuento': restaurant?.discount,
        'distancia': restaurant?.distance,
        'comida': restaurant?.food,
        'velocidad': restaurant?.speed,
        'envio': restaurant?.shippingAmount
    }
}


async function getRestaurantsData() {
    let response = await Axios.get(urlRequest, {
        headers: headers
    });

    let restaurantResponse = response.data.list.data;
    restaurantData = restaurantResponse.map((restaurant) => parserRestaurantData(restaurant));

    // ORDENO LOS PRECIOS DE MENOR A MAYOR
    let preciosOrdenados = restaurantData.sort(function (a, b) {
        return a.precioPromedio - b.precioPromedio;
    });

    console.log(`Se trajeron ${response.data.list.count} restaurantes.`);
    console.log(`En total son ${response.data.list.total} restaurantes. \n`);

    return preciosOrdenados;
}

const saveInJson = (restaurantData) => {
    restaurantsJson = JSON.stringify(restaurantData);
    fs.writeFileSync('peya.json', restaurantsJson);
}


getRestaurantsData().then((restaurantsData) => {
	saveInJson(restaurantsData);  // GUARDAR EN UN JSON
	console.log(restaurantsData); // IMPRIMIR EN CONSOLA
});  

