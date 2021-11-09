let state = {
  selectStateInput: "",
  breweries: [],
  cities: [],
  page: 1,
  filters: {
    type: "",
    city: [],
    search: ""
  }
};

//fetch API

async function fetchBreweries(input) {
  let response = await fetch (`https://api.openbrewerydb.org/breweries?by_state=${input}&per_page=50`)
  let data = await response.json();
  return data;
}
    
function init(command) {
 fetchBreweries(state.selectStateInput)
    .then (data => command(data))
    .catch (reason => console.log(reason.message))
}

//filters

function filterByType (brewery) {
  if (brewery.brewery_type === state.filters.type) {
    return true;
  } else if ((brewery.brewery_type == 'micro' || brewery.brewery_type == 'regional' || brewery.brewery_type == 'brewpub') && (!state.filters.type)) {
    return true;
  }
}

function filterByCity (brewery) {
  if (state.filters.city.includes(brewery.city) || (state.filters.city).length < 1) return true
}

function filterBySearch (brewery) {
  let breweryName = (brewery.name).toLowerCase();
  let breweryCity = (brewery.city).toLowerCase();
  let searchTerm = (state.filters.search).toLowerCase();
  if ((breweryName).includes(searchTerm) || (breweryCity).includes(searchTerm) || !state.filters.search) return true
}

function filterBreweries (data) {
  let itemCounter = 0;
  let pageNumber = (state.page * 10)-10;
  let breweriesList = document.querySelector('.breweries-list');
  while (breweriesList.firstChild) breweriesList.removeChild(breweriesList.firstChild);
  for (let i=pageNumber; i < data.length; i++) {
    if (filterByType(data[i]) && filterByCity(data[i]) && filterBySearch(data[i]) && itemCounter < 10) {
      renderBrewery (data[i]);
      fillState (data[i]);
      itemCounter ++;
    }
  }
}

function fillState (data) {
  if (!state.cities.includes(data.city)) state.cities.push(data.city);
  if (!state.breweries.includes(data.name)) state.breweries.push(data.name);
}

//DOM

function createNewElement(element = '', className = '', id = '', innerText = '') {
  const newElement = document.createElement(element);
  newElement.className = className;
  newElement.id = id;
  newElement.innerText = innerText;
  return newElement;
}

function appendToParent(element, parentElement) {
  return parentElement.append(element);
}

//DOM - forms

function createNewFormOption (value, text) {
  const optionname = createNewElement('option');
  optionname.value = value;
  optionname.innerText = text;
  return optionname;
}

function formBrewery () {
  const form = createNewElement ('form', '', 'filter-by-type-form');
  form.setAttribute("autocomplete", "off");
  return form;
}

function formBreweryLabel () {
  const label = createNewElement ('label');
  label.setAttribute("for", "filter-by-type");
  return label;
}

function formBrewerySelect () {
  const select = createNewElement ('select', '' ,'filter-by-type');
  select.setAttribute("name", "filter-by-type");
  return select;
}

function formCitiesInput (cities) {
  const input = createNewElement ('input');
  input.setAttribute('type', 'checkbox')
  input.setAttribute("name", cities);
  input.setAttribute('value', cities);
  return input;
}

function formCitiesLabel (cities) {
  const label = createNewElement ('label', '', '', `${cities}\n`);
  label.setAttribute("for", cities);
  return label;
}

function formBrewerySearch () {
  const form = createNewElement ('form', '', 'search-breweries-form');
  form.setAttribute("autocomplete", "off");
  return form;
}

function formBrewerySearchLabel () {
  const label = createNewElement ('label');
  label.setAttribute('for', 'search-breweries');
  return label;
}

function formBrewerySearchInput () {
  const input = createNewElement ('input', '', 'search-breweries', '');
  input.setAttribute('type', 'text');
  input.setAttribute("name", 'search-breweries');
  return input;
}

function createSection3A (selectedBrewery) {
  const aTag = createNewElement ("a", '', '', "Visit Website");
  aTag.setAttribute('href', `${selectedBrewery.website_url}`);
  aTag.setAttribute('target', 'blank');
  return aTag;
}

function renderAsideCitiesList () {
  const formCities = document.querySelector('#filter-by-city-form');
  const docFragment = document.createDocumentFragment();
  while (formCities.firstChild) formCities.removeChild(formCities.firstChild);
  for (let i = 0; i < state.cities.length; i++ ) {
    const input = formCitiesInput (`${state.cities[i]}`);
    const label = formCitiesLabel (`${state.cities[i]}`);
    appendToParent (input, docFragment);
    appendToParent (label, docFragment);
  }
  appendToParent (docFragment, formCities);
}

//DOM - dynamic elements

function renderBrewery (selectedBrewery) {

  const docFragment = document.createDocumentFragment();
  const ul = document.querySelector('.breweries-list');

  const li = createNewElement ('li');
  appendToParent (li, docFragment);
  
  const h2 = createNewElement ('h2', '', '', selectedBrewery.name);
  appendToParent (h2, li);
  
  const div = createNewElement ('div', 'type', '', selectedBrewery.brewery_type)
  appendToParent (div, li);
  
  const section = createNewElement ("section", 'address');
  appendToParent (section, li);
  
  const section_h3 = createNewElement ('h3', '', '', 'Address:');
  appendToParent (section_h3, section);
  
  const section_p = createNewElement ('p', '', '', selectedBrewery.street);
  appendToParent (section_p, section);
  
  const section_p2 = createNewElement ('p', '', '', selectedBrewery.city +' '+selectedBrewery.postal_code);
  appendToParent (section_p2, section);
  
  const section2 = createNewElement ("section", 'phone');
  appendToParent (section2, li);
  
  const section2_h3 = createNewElement ("h3", '', '', 'Phone');
  appendToParent (section2_h3, section2);
  
  const section2_p = createNewElement ('p', '', '', selectedBrewery.phone);
  appendToParent (section2_p, section2);
  
  const section3 = createNewElement ("section", 'link');
  appendToParent (section3, li);
  
  const section3_a = createSection3A (selectedBrewery);
  appendToParent (section3_a, section3);

  appendToParent (docFragment, ul);
}

//render static elements

function renderList () {
  const main = document.querySelector ('main');
  const docFragment = document.createDocumentFragment();
  
  const h1 = createNewElement ('h1', '', '', 'List of Breweries');
  appendToParent (h1, docFragment);

  const header = createNewElement ('header', 'search-bar', '', '');
  appendToParent (header, docFragment);

  const form = formBrewerySearch ();
  appendToParent (form, header);

  const label = formBrewerySearchLabel ();
  appendToParent (label, form);

  const h2 = createNewElement ('h2', '', '', 'Search breweries:');
  appendToParent (h2, label);

  const input = formBrewerySearchInput ();
  appendToParent (input, form);

  const article = createNewElement ('article');
  appendToParent (article, docFragment);

  const ul = createNewElement ('ul', 'breweries-list');
  appendToParent (ul, article);

  const div = createNewElement ('div', 'page-select-options');
  appendToParent (div, article);

  const button_prev = createNewElement ('button', 'page-select-btn', 'prev-btn', 'Previous Page');
  appendToParent (button_prev, div);

  const div_2 = createNewElement ('div', 'empty');
  appendToParent (div_2, div);

  const button_next = createNewElement ('button', 'page-select-btn', 'next-btn', 'Next Page');
  appendToParent (button_next, div);

  appendToParent (docFragment, main);
  formBreweryAndCitySearch ();
  displayPreviousPage ();
  displayNextPage ();
}

//DOM - static elements

function renderAside () {
  const main = document.querySelector('main');
  const docFragment = document.createDocumentFragment();
  
  const aside = createNewElement ('aside', 'filters-section');
  appendToParent (aside, docFragment);
  
  const h2 = createNewElement ('h2', '', '', 'Filter By:');
  appendToParent (h2, aside);
  
  const form = formBrewery ();
  appendToParent (form, aside);
  
  const label = formBreweryLabel ();
  appendToParent (label, form);
  
  const h3 = createNewElement ('h3', '', '', 'Type of Brewery');
  appendToParent (h3, label);
  
  const select = formBrewerySelect ();
  appendToParent (select, form);
  
  const defaultOption = createNewFormOption ('', 'Select a type...');
  appendToParent (defaultOption, select);
  
  const optionMicro = createNewFormOption ('micro', 'Micro');
  appendToParent (optionMicro, select);
  
  const optionRegional = createNewFormOption ('regional', 'Regional');
  appendToParent (optionRegional, select);
  
  const optionBrewpub = createNewFormOption ('brewpub', 'Brewpub');
  appendToParent (optionBrewpub, select);
  
  const div = createNewElement ('div', 'filter-by-city-heading');
  appendToParent (div, aside);
  
  const divh3 = createNewElement ('h3', '','', 'Cities');
  appendToParent (divh3, div);
  
  const button = createNewElement ('button', 'clear-all-btn', '', 'clear all');
  appendToParent (button, div);

  appendToParent (docFragment, main);

  const formCities = createNewElement ('form', '', 'filter-by-city-form');
  appendToParent (formCities, aside);

  renderAsideCitiesList ();
  formBreweryTypeEvent ();
  formCitiesEvent ();
  clearAllEvent ();
}

//events

function formStateEvent () {
  const formStateInput = document.querySelector('#select-state');
  const formState = document.querySelector('#select-state-form');
  formState.addEventListener("submit", function (event) {
    event.preventDefault();
    state.selectStateInput = '';
    state.breweries = [];
    state.cities = [];
    state.page = 1;
    state.filters.type = "";
    state.filters.city = [];
    state.filters.search = "";
    state.selectStateInput = formStateInput.value;
    init(renderPage);
    formState.reset();
  })
}

function formBreweryTypeEvent () {
  formBreweryTypeClick = document.querySelector('#filter-by-type');
  formBreweryTypeClick.addEventListener("change", function (event) {
    event.preventDefault();
    state.filters.type = event.target.value;
    init(filterBreweries);
  })
}

function clearAllEvent () {
  clearAllEventClick = document.querySelector('.clear-all-btn');
  clearAllEventClick.addEventListener("click", function (event) {
    state.filters.city = []
    init(filterBreweries);
    init(renderAsideCitiesList);
  })
}

function formCitiesEvent() {
  formCitiesClick = document.querySelector('#filter-by-city-form');
  formCitiesClick.addEventListener("click", function (event) {
    if (!event.target.value) return;
    if (state.filters.city.includes(event.target.value)) {
      state.filters.city = state.filters.city.filter(e => e !== event.target.value);
    } else {
      state.filters.city.push(event.target.value);
    }
    init(filterBreweries);
  })
}

function formBreweryAndCitySearch () {
  const formBreweryclick = document.querySelector('#search-breweries-form');
  const formBreweryinput = document.querySelector('#search-breweries');
  formBreweryclick.addEventListener("submit", function (event) {
    event.preventDefault();
    state.filters.search = '';
    state.filters.search = formBreweryinput.value;
    init(filterBreweries);
    formBreweryclick.reset();
  })
}

function displayPreviousPage () {
  const displayPreviousPageClick = document.querySelector('#prev-btn');
  displayPreviousPageClick.addEventListener("click", function (event) {
    if (state.page > 1) {
      state.page --
      state.cities = [];
      init(filterBreweries);
      init(renderAsideCitiesList);
    }
  })
}

function displayNextPage () {
  const displayNextPageClick = document.querySelector('#next-btn');
  displayNextPageClick.addEventListener("click", function (event) {
    if (state.page < 4) {
    state.page ++
    state.cities = [];
    init(filterBreweries);
    init(renderAsideCitiesList);
    }
  })
}

//page init

formStateEvent()

function renderPage(data) {
  const main = document.querySelector('main');
  while (main.firstChild) main.removeChild(main.firstChild);
  renderList();
  filterBreweries (data);
  renderAside();
}