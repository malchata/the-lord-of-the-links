// Vendors
import { h, render, Component, createRef } from "preact";

// App-specific
import "Styles/Autocomplete.css";

class Autocomplete extends Component {
  constructor (props) {
    super(props);

    // Methods/events
    this.saveQuery = this.saveQuery.bind(this);
    this.showSpinner = this.showSpinner.bind(this);
    this.fetchWrapper = this.fetchWrapper.bind(this);
    this.sendFetch = this.sendFetch.bind(this);
    this.runSyntheticTask = this.runSyntheticTask.bind(this);

    // Initial state
    this.state = {
      results: [],
      throttled: false,
      delay: 150,
      showSpinner: false,
      query: ""
    }
    
    // Refs
    this.queryBoxRef = createRef();

    // Misc properties
    this.taskInterval;
  }

  saveQuery ({ target }) {
    this.runSyntheticTask();

    this.setState({
      query: target.value
    });
  }

  runSyntheticTask () {
    // Create the starting mark
    performance.mark("synthetic_task_mark");

    let arr = [];
    const blockingStart = performance.now();
    const blockingTime = Math.floor(Math.random() * 50);

    console.log("Synthetic task time: " + blockingTime);

    while (performance.now() < blockingStart + blockingTime) {
      arr.push(Math.random() * performance.now / blockingStart / blockingTime);
    }

    // End the task measure.
    performance.measure("synthetic_task", "synthetic_task_mark");
  }

  // Shows a loading spinner on keydown
  showSpinner () {
    this.runSyntheticTask();

    this.setState({
      showSpinner: this.queryBoxRef.current.value.length > 0 && this.state.results.length === 0
    });
  }

  // Wraps `this.sendFetch` so throttling can be applied
  fetchWrapper () {
    // Check if throttling is currently active
    if (this.state.throttled === false) {
      this.setState({
        throttled: true
      }, () => {
        // Throttle!
        setTimeout(() => {
          this.runSyntheticTask();

          // Send the fetch request.
          this.sendFetch();

          // We're ready to accept new inputs.
          this.setState({
            throttled: false
          });
        }, this.state.delay)
      });
    }
  }

  // Sends a fetch to the API for nerdy links.
  async sendFetch () {
    // Run a synthetic task
    this.runSyntheticTask();

    // Yucky ref stuff again, but it works.
    const query = this.queryBoxRef.current.value;

    console.info(query, performance.now());

    // If the query is empty, we should clear the results.
    if (query.length === 0) {
      this.setState({
        results: []
      });

      return;
    }

    // Send the query to the API.
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

    // Turn the response into an object.
    const links = await response.json();

    // Compile the results.
    const results = Object.entries(links).map(([ title, link ]) => {
      return <li className="autocomplete__result"><a href={link} rel="noopener" target="_blank">{title}</a></li>
    });

    // Hide the spinner
    this.setState({
      showSpinner: false,
      results
    });
  }

  render () {
    return (
      <section className="autocomplete">
        <form>
          <fieldset className="autocomplete__fieldset">
            <label className="autocomplete__label" htmlFor="autocomplete-field">Search the <a href="http://www.tolkiengateway.net/wiki/Main_Page" rel="noopener">Tolkien Gateway</a></label>
            <input autocomplete="off" ref={this.queryBoxRef} onKeyPress={this.saveQuery} onKeydown={this.showSpinner} onKeyup={this.fetchWrapper} type="text" id="autocomplete-field" className="autocomplete__field" />
          </fieldset>
        </form>
        <ul aria-live="assertive" className="autocomplete__results">
          {this.state.results}
        </ul>
        <svg aria-hidden className={`autocomplete__spinner${this.state.showSpinner ? " show" : ""}`} viewBox="0 0 50 50">
          <circle className="autocomplete__spinner__path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
      </section>
    );
  }
}

export default Autocomplete;
