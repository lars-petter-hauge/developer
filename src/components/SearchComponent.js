import React  from 'react'

export const Search = (props) => {
    const {setResults, setQuery, query, lng} = props;
  
  function getSearchResults(query) {
    if (!query || !window.__LUNR__) return []
    const lunrIndex = window.__LUNR__[lng]
    
    const searchQuery = `+collection:docs ${query.trim()}~1`;
    const results = lunrIndex.index.search(searchQuery);
    
    return results
      .filter(result => {
        console.log(result.score);
        return result.score > 0.1;
      })
      .map(({ ref }) => lunrIndex.store[ref])
  }
    
    return (
      <div>
        <input type="text" value={query} onChange={() => {
          const queryText = event.target.value;
          setResults(getSearchResults(queryText));
          setQuery(queryText);
        }}/>
      </div>
    )
}

