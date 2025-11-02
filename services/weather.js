import fetch from 'node-fetch';
import dotenv from "dotenv";
dotenv.config();


function getLocation(){
//this will either retrieve location from user config or return default of Boston, Ma

return "Boston, Massachusetts"
}

async function getweather(location){

const url = 'https://api.weatherstack.com/current?query='+location+'&access_key='+process.env.WEATHERAPI;
const options = {method: 'GET', headers: {Accept: 'application/json'}};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
}

function test (){
    const loc = getLocation();
    getweather(loc)
}

test();
