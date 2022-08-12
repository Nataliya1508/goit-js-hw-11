import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function clearMarkup(value) {
  value.innerHTML = '';
}

function searchCountry(evt) {
    evt.preventDefault();

    const countryName = searchBox.value.trim();

    fetchCountries(countryName)
        .then(data => {
            countriesData(data);
    })
        .catch(error => {
            if (countryName !== '') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
    }
})
}

function countriesData(data) {
    if (data.length > 10) {

        clearMarkup(countryList);
        clearMarkup(countryInfo);

        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');

    } else if (data.length > 1 && data.length <= 10) {
        clearMarkup(countryList);
        clearMarkup(countryInfo);
        
        return (countryList.innerHTML = data
            .map(
                item => `<li class = 'country'>
                        <img class= 'image' src = '${item.flags.svg}' />
                        <p>${item.name}</p>
                    </li>`)
            .join(''));
    } else {
        clearMarkup(countryList);
        clearMarkup(countryInfo);

        return (countryInfo.innerHTML = data
      .map(
        item => `<div class = 'country-main'>
                    
                        <img class= 'image-flag' src = '${item.flags.svg}' />
    
                        <div class = 'country-body'>
                        
                            <h3>${item.name}</h3>
                            <p><b>Capital: </b> ${item.capital}</p>
                            <p><b>Population: </b> ${item.population.toLocaleString()}</p>
                            <p><b>Languages: </b> ${item.languages[0].name}</p>
                        </div>
    
                    </div>`)
      .join(''));
    }
}