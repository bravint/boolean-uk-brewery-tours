The next exercise: Brewery Tours

Repo: boolean-uk-brewery-tours

Description
In this exercise we explore a common scenario in eCommerce and booking sites, using filters and search to modify what we render from the state.

Deliverables
- A user can enter a US state and view a list of breweries in that state
    - The list has a maximum of 10 breweries on display
    - The list has three types of breweries that offer brewery tours:
        - Micro
        - Regional
        - Brewpub
    - Do not show the other types of breweries
- From the list of breweries, a user can view the following details about each brewery:
    - Name
    - Type of brewery
    - Address
    - Phone Number
- From the list of breweries, a user can visit the website of a brewery
- From the 'filter by type of brewery' section, a user can filter by type of brewery
- From the 'filter by city' section, a user can filter by city, the location of the brewery
- From the 'filter by city' section, a user can clear all filters
- From the 'search' section, a user can search for breweries by:
    - Name
    - City

Instructions
- Download the files from https://codesandbox.io/s/js-exercise-brewery-tour-starter-template-whq5i?file=/templates/main-section.html
- Read the "Open Brewery DB" documentation: https://www.openbrewerydb.org/documentation/01-listbreweries
- Think about which request type to use
- Create a state object
- Create a fetch function to get data
- Create action functions that update state
- Create render functions that read from state
 
Steve Huckle: Tips

- Start with the logic first, use console.log(state) to check your logic is working; when the logic is working as expected move onto styling
- Use a cleanData function to modify the data in the fetch request before adding it to state
- Use an extractCitiesData function to extract the cities from the data in the fetch request and add it to state for the 'filter by city' section
- For filter by type use a select element to capture user input
- For filter by city use a list of checkbox elements to capture user input

Challenge
- Add pagination to the list; if the list of breweries is greater than 10 a user can go to the next page to view more breweries

Challenge 2
- Add a booking section; a user can select a date and time to go on a tour at a brewery