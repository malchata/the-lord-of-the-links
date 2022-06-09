// Vendors
import { h, render, Component, createRef } from "preact";

// App-specific
import "Styles/Autocomplete.css";

class Autocomplete extends Component {
  constructor (props) {
    super(props);

    // Methods/events
    this.fetchWrapper = this.fetchWrapper.bind(this);
    this.sendFetch = this.sendFetch.bind(this);
    this.throttlingNotice = this.throttlingNotice.bind(this);
    this.toggleMainThreadWork = this.toggleMainThreadWork.bind(this);
    this.toggleLogging = this.toggleLogging.bind(this);

    // Initial state
    this.state = {
      results: [],
      debug: false,
      tasksRun: 0,
      logging: false,
      throttlingActive: false,
      throttleTime: 150,
      inputNumber: 1
    }
    
    // Refs
    this.queryBoxRef = createRef();
    this.throttlingCheckboxRef = createRef();

    // Misc properties
    this.taskInterval;
  }

  componentDidMount () {
    // This should always log, regardless of logging setting.
    console.log("Tip: to toggle the debugger, type \"debug\" into the search box.")
  }

  // Wraps `this.sendFetch` so throttling can be applied
  fetchWrapper () {
    // Create the starting mark
    performance.mark(`input_${this.state.inputNumber}_mark`);

    // Yucky ref checks here, but it works.
    if (this.throttlingCheckboxRef.current.checked === true) {
      // Check if throttling is currently active
      if (this.state.throttlingActive === false) {
        this.setState({
          throttlingActive: true
        }, () => {
          // Throttle!
          setTimeout(() => {
            if (this.state.logging === true) {
              console.log("Input throttled.");
            }

            // Send the fetch request.
            this.sendFetch();

            // We're ready to accept new inputs.
            this.setState({
              throttlingActive: false
            });
          }, this.state.throttleTime)
        });
      }

      return;
    }

    // Send the fetch instantly if throttling is not applied.
    this.sendFetch();
  }

  // Sends a fetch to the API for nerdy links.
  async sendFetch () {
    // Yucky ref stuff again, but it works.
    const query = this.queryBoxRef.current.value;

    if (this.state.logging === true) {
      console.info(query, performance.now());
    }

    // If the query is empty, we should clear the results.
    if (query.length === 0) {
      this.setState({
        results: []
      });

      return;
    }

    // For toggling the debugger
    if (query.toLowerCase() === "debug") {
      this.setState({
        debug: !this.state.debug,
        results: []
      }, () => {
        if (this.state.logging === true) {
          console.log(`Debugger state: ${this.state.debug ? "ON" : "OFF"}.`);
        }
      });

      // Clear the query input.
      this.queryBoxRef.current.value = "";

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

    // Show them results.
    const results = Object.entries(links).map(([ title, link ]) => {
      return <li className="autocomplete__result"><a href={link} rel="noopener" target="_blank">{title}</a></li>
    });

    // End the task measure.
    performance.measure(`input_${this.state.inputNumber}`, `input_${this.state.inputNumber}_mark`);

    this.setState({
      results,
      inputNumber: this.state.inputNumber + 1
    });
  }

  // This just logs to the console if throttling is active or not.
  throttlingNotice ({ target }) {
    if (this.state.logging === true) {
      if (this.throttlingCheckboxRef.current.checked === true) {
        console.log("Throttling turned ON.")
      } else {
        console.log("Throttling turned OFF.")
      }
    }
  }

  // Toggles logging behavior.
  toggleLogging () {
    this.setState({
      logging: !this.state.logging
    })
  }

  // Generates synthetic main thread work.
  toggleMainThreadWork ({ target }) {
    if (target.checked === true) {
      if (this.state.logging === true) {
        console.log("Generating synthetic main thread work...");
      }

      // Orchestrates synthetic work on a set interval.
      this.taskInterval = setInterval(() => {
        let arr = [];
        const blockingStart = performance.now();
        const blockingTime = Math.floor(Math.random() * 500);

        if (this.state.logging === true) {
          console.log("Synthetic task time: " + blockingTime);
        }

        while (performance.now() < blockingStart + blockingTime) {
          arr.push(Math.random() * performance.now / blockingStart / blockingTime);
        }

        // Increment the task counter.
        this.setState({
          tasksRun: this.state.tasksRun + 1
        });
      }, 1000);
    } else {
      if (this.state.logging === true) {
        console.log("Stopping synthetic main thread work...");
      }

      // Stop doing synthetic work.
      clearInterval(this.taskInterval);

      return;
    }

    this.setState({
      tasksRun: 0
    });
  }

  render () {
    return (
      <section className="autocomplete">
        <form>
          <fieldset className="autocomplete__fieldset">
            <section className={`autocomplete__debug${this.state.debug ? " show" : ""}`}>
              <div className="autocomplete__debug__field">
                <input onChange={this.throttlingNotice} ref={this.throttlingCheckboxRef} type="checkbox" id="throttling" className="autocomplete__debug__checkbox" />&nbsp;<label htmlFor="throttling" className="autocomplete__debug__label">Throttle</label>
              </div>
              <div className="autocomplete__debug__field">
                <input onChange={this.toggleMainThreadWork} type="checkbox" id="mainThreadTasks" className="autocomplete__debug__checkbox" />&nbsp;<label htmlFor="mainThreadTasks" className="autocomplete__debug__label">Work ({this.state.tasksRun} tasks)</label>
              </div>
              <div className="autocomplete__debug__field">
                <input onChange={this.toggleLogging} type="checkbox" id="logging" className="autocomplete__debug__checkbox" />&nbsp;<label htmlFor="logging" className="autocomplete__debug__label">Log</label>
              </div>
            </section>
            <label className="autocomplete__label" htmlFor="autocomplete-field">Search the <a href="http://www.tolkiengateway.net/wiki/Main_Page" rel="noopener">Tolkien Gateway</a></label>
            <input autocomplete="off" ref={this.queryBoxRef} onKeyup={this.fetchWrapper} type="text" id="autocomplete-field" className="autocomplete__field" />
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
