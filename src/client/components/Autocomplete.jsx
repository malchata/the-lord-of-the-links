// Vendors
import { h, render, Component, createRef } from "preact";
import { throttle } from "lodash";

// App-specific
import "Styles/Autocomplete.css";

class Autocomplete extends Component {
  constructor (props) {
    super(props);

    this.fetchWrapper = this.fetchWrapper.bind(this);
    this.sendFetch = this.sendFetch.bind(this);
    this.throttlingNotice = this.throttlingNotice.bind(this);
    this.toggleMainThreadWork = this.toggleMainThreadWork.bind(this);
    this.state = {
      results: [],
      debug: false,
      tasksRun: 0
    }
    this.taskInterval;
    this.queryBoxRef = createRef();
    this.throttlingCheckboxRef = createRef();
  }

  componentDidMount () {
    console.log("Tip: to toggle the debugger, type \"debug\" into the search box.")
  }

  fetchWrapper () {
    if (this.throttlingCheckboxRef.current.checked === true) {
      throttle(this.sendFetch, 100, {
        leading: false,
        trailing: true
      });

      return;
    }

    this.sendFetch();
  }

  async sendFetch () {
    const query = this.queryBoxRef.current.value;
    console.dir(query);

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

      this.queryBoxRef.current.value = "";

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

  throttlingNotice ({ target }) {
    if (this.throttlingCheckboxRef.current.checked === true) {
      console.log("Throttling turned ON.")
    } else {
      console.log("Throttling turned OFF.")
    }
  }

  toggleMainThreadWork ({ target }) {
    if (target.checked === true) {
      console.log("Generating synthetic main thread work...");

      this.taskInterval = setInterval(() => {
        let arr = [];
        const blockingStart = performance.now();
        const blockingTime = Math.floor(Math.random() * 500);

        console.log(`${blockingStart} < ${blockingStart} + ${blockingTime}`);

        while (performance.now() < blockingStart + blockingTime) {
          console.log("task time: " + blockingTime);
          arr.push(Math.random() * performance.now / blockingStart / blockingTime);
        }

        this.setState({
          tasksRun: this.state.tasksRun + 1
        });
      }, 1000);
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
                <input onChange={this.throttlingNotice} ref={this.throttlingCheckboxRef} type="checkbox" id="throttling" className="autocomplete__debug__checkbox" />&nbsp;<label htmlFor="throttling" className="autocomplete__debug__label">Throttling</label>
              </div>
              <div className="autocomplete__debug__field">
                <input onChange={this.toggleMainThreadWork} type="checkbox" id="mainThreadTasks" className="autocomplete__debug__checkbox" />&nbsp;<label htmlFor="mainThreadTasks" className="autocomplete__debug__label">Generate work ({this.state.tasksRun} tasks run)</label>
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
