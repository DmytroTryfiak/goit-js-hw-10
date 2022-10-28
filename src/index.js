import './css/styles.css';
import fetchCountries from './js/fetchCountries.js'
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryListContainer = document.querySelector('[data-country-list]');
const countryInfoContainer = document.querySelector('[data-country-info]');

Notiflix.Notify.init({
    timeout: 3000,
    showOnlyTheLastOne: true,
});

searchBox.addEventListener("input", debounce(handleInput, DEBOUNCE_DELAY, { leading: false }));

function handleInput(event) {
    const countryName = event.target.value.trim();
    clearContent();

    if (!countryName.length) {
        return;
    }

    fetchCountries(countryName)
        .then(getResponse)
        .then(handleResponse)
        .catch(handleError);
}

function getResponse(response) {
    if (!response.ok) {
        throw new Error('Oops, there is no country with that name');
    }
    return response.json();
}

function handleResponse(response) {
    const numberOfCountries = response.length;

    if (numberOfCountries > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
        return;
    }

    if (numberOfCountries > 1) {
        showCountryList(response);
        return;
    }

    if (numberOfCountries === 1) {
        showCountryInfo(response[0]);
    }
}

function handleError(error) {
    Notiflix.Notify.failure(error.toString());
}

function showCountryList(countries) {
    const countryListsContent = countries.reduce((countryListsContent, item) =>
        countryListsContent +
        `<li>
            <img
                class="country-list-item__img"
                src="${item.flags.png}"
                alt="Flags"
            </img>
            <span>
                ${item.name.official}
            </span>
        </li>`
        , '');

    countryListContainer.insertAdjacentHTML('afterbegin', countryListsContent);
}

function showCountryInfo(country) {
    const { flags, name, capital, population, languages } = country;
    const languagesStr = Object.values(languages).join(', ');
    const countryInfoContent =
        `<h1>
            <img
                class="country-list-item__img"
                src="${flags.png}"
                alt="Flags"
            </img>
            <span>
                ${name.official}
            </span>
        </h1>  
        <p>
            <b>Capital: </b>${capital}</br>
            <b>Population: </b>${population}</br>
            <b>Languages: </b>${languagesStr}</br>
        </p>`;

    countryInfoContainer.insertAdjacentHTML('afterbegin', countryInfoContent);
}

function clearContent() {
    countryListContainer.innerHTML = '';
    countryInfoContainer.innerHTML = '';
}