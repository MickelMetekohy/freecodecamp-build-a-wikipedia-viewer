// get dom elements
const resultsContainer = document.querySelector('#results');
const searchButton = document.querySelector('#search-wiki-buttons');
const searchField = document.querySelector('#search-wiki-field');

// get the wiki data
const wikiapi = (searchValue) => {
  const wiki = fetch('https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrprop=snippet&prop=imageinfo|pageimages|info|extracts&inprop=url&pithumbsize=240&exintro&explaintext&exsentences=1&exlimit=16&gsrlimit=16&gsrnamespace=0&gsrsearch=' + searchValue); //jimi+hendrix
  wiki
    .then((data) => data.json())
    .then((data) => perform(data))
    .catch((err) => console.error(err));
}

// assemble the wiki data
const perform = (data) => {
  if(typeof data.query == "undefined") { return; }
  
  const d = data.query.pages;
  let output = '';
  
  for (item in d) {
    const meat = d[item];
    let img = '';
    if(typeof meat.thumbnail != "undefined") {
      img = `style="background-image: url(${meat.thumbnail.source})"`;
    }
    output += `
      <article class="result" ${img}>
        <div class="overlay">
          <header>
            <h1>${meat.title}</h1>
          </header>
          <main>
            <p>${meat.extract}</p>
          </main>
          <footer>
            <a target="_blank" href="${meat.fullurl}">Read Article</a>
          </footer>
        </div>  
      </article>
    `;
  }
  resultsContainer.innerHTML = output;
  searchButton.style.display = 'none';
}


/**
 * EVENTS
 */
// add click event to search button
searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  const searchField = document.querySelector('#search-wiki-field');
  if(searchField != document.activeElement) {
    searchField.focus();
  }
});

// make wiki api call on keyup and relace buttons with response
searchField.addEventListener('keyup', (e) => {
  e.preventDefault();
  if(searchField.value === "") {
    searchButton.style.display = 'block';
    resultsContainer.innerHTML = '';
  } else {
    wikiapi(searchField.value);
  }
});
