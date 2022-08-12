
export function fetchCountries(country) {
  return fetch(`https://restcountries.com/v2/name/${country}?fields=name,capital,population,flags,languages`)
    .then(response => {
   
      return response.json();
    })
    .catch(error => console.log("error", error));
}
