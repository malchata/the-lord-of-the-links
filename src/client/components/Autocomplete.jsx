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

    if (query.length === 0) {
      this.setState({
        results: []
      });

      return;
    }

    const response = await fetch("/search/", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query
      })
    });

    const links = await response.json();
    const results = Object.entries(links).map(([ title, link ]) => {
      return <li className="autocomplete__result"><a href={link} rel="noopener" target="_blank">{title}</a></li>
    });

    this.setState({
      results
    });
  }

  render () {
    return (
      <section className="autocomplete">
        <form>
          <fieldset className="autocomplete__fieldset">
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
