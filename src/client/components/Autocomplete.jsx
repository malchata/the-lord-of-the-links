// Vendors
import { h, render, Component } from "preact";

// App-specific
import "Styles/Autocomplete.css";

class Autocomplete extends Component {
  constructor (props) {
    super(props);

    this.sendFetch = this.sendFetch.bind(this);
    this.state = {
      results: []
    }
  }

  async sendFetch (event) {
    const query = event.target.value;

    const results = await fetch("/search/", {
      method: "POST",
      cache: "no-cache",
      "Content-Type": "application/json",
      body: JSON.stringify({
        query
      })
    });

    console.dir(results);
  }

  render () {
    return (
      <section className="autocomplete">
        <form>
          <fieldset>
            <label className="autocomplete__label" for="autocomplete-field">Search the Tolkien Gateway:</label>
            <input autocomplete="off" onKeyup={this.sendFetch} type="text" htmlFor="autocomplete-field" className="autocomplete__field" />
          </fieldset>
        </form>
        <ul aria-live="assertive" className="autocomplete__results">
          {this.state.results}
        </ul>
      </section>
    );
  }
}

export default Autocomplete;
