// Vendors
import { h, Fragment, render, Component, createRef } from "preact";

// App-specific
import "Styles/Autocomplete.css";

class Autocomplete extends Component {
  constructor (props) {
    super(props);

    this.sendFetch = this.sendFetch.bind(this);
    this.toggleMainThreadWork = this.toggleMainThreadWork.bind(this);
    this.state = {
      results: [],
      debug: false,
      tasksRun: 0
    }
    this.taskInterval;
    this.queryBox = createRef();
    this.pollingCheckbox = createRef();
  }

  componentDidMount () {
    console.log("Tip: to toggle the debugger, type \"debug\" into the search box.")
  }

  fetchWrapper () {
    console.dir(this.pollingCheckbox);
    if (this.pollingCheckbox.current.checked === true) {
      console.log("Input throttled.");

      _window.throttle(this.sendFetch, 1000);
    } else {
      console.log("Input not throttled.");

      this.sendFetch();
    }
  }

  async sendFetch () {
    const query = this.queryBox.current.value;

    if (query.length === 0) {
      this.setState({
        results: []
      });

      return;
    }

    if (query.toLowerCase() === "debug") {
      this.setState({
        debug: !this.state.debug,
        results: []
      }, () => {
        console.log(`Debugger state: ${this.state.debug ? "ON" : "OFF"}.`);
      });

      event.target.value = "";

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

  toggleMainThreadWork (event) {
    if (event.target.checked === true) {
      console.log("Generating synthetic main thread work...");

      this.taskInterval = setInterval(() => {
        performance.mark(`Start task ${this.state.tasksRun}`);

        const blockingStart = performance.now();
        const blockingTime = Math.floor(Math.random() * 500);

        while (performance.now() < blockingStart + blockingTime) {
          // Block...
        }

        this.setState({
          tasksRun: this.state.tasksRun + 1
        });
      }, intervalTime);
    } else {
      console.log("Stopping work...");

      clearInterval(this.taskInterval);
    }
  }

  render () {
    return (
      <section className="autocomplete">
        <form>
          <fieldset className="autocomplete__fieldset">
            <section className={`autocomplete__debug${this.state.debug ? " show" : ""}`}>
              <div className="autocomplete__debug__field">
                <input ref={this.pollingCheckbox} type="checkbox" id="polling" className="autocomplete__debug__checkbox" />&nbsp;<label htmlFor="polling" className="autocomplete__debug__label">Polling</label>
              </div>
              <div className="autocomplete__debug__field">
                <input onChange={this.toggleMainThreadWork} type="checkbox" id="mainThreadTasks" className="autocomplete__debug__checkbox" />&nbsp;<label htmlFor="mainThreadTasks" className="autocomplete__debug__label">Generate work ({this.state.tasksRun} tasks run)</label>
              </div>
            </section>
            <label className="autocomplete__label" htmlFor="autocomplete-field">Search the <a href="http://www.tolkiengateway.net/wiki/Main_Page" rel="noopener">Tolkien Gateway</a></label>
            <input autocomplete="off" ref={this.queryBox} onKeyup={this.fetchWrapper} type="text" id="autocomplete-field" className="autocomplete__field" />
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
