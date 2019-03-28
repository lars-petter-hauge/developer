import React, { Component } from 'react'

export class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: ``,
      results: [],
    }
  }
  
  render() {
    return (
      <div>
        <input type="text" value={this.state.query} onChange={this.search}/>
        <ul>{this.state.results.map((page, index) => <li key={'result' + index}>{page.title}</li>)}</ul>
      </div>
    )
  }
  
  getSearchResults(query) {
    if (!query || !window.__LUNR__) return []
    const lunrIndex = window.__LUNR__[this.props.lng]
   
    const searchQuery = `+collection:docs ${query.trim()}~1`;
    const results = lunrIndex.index.search(searchQuery);

    return results
      .filter(result => {
        console.log(result.score);
        return result.score > 1;
      })
      .map(({ ref }) => lunrIndex.store[ref])
  }
  
  search = event => {
    const query = event.target.value
    const results = this.getSearchResults(query)
    this.setState(s => {
      return {
        results,
        query,
      }
    })
  }
}