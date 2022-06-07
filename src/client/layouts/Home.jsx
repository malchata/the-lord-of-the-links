// Vendors
import { h, Fragment, render, Component } from "preact";

// App-specific
import Logo from "Components/Logo.jsx";
import Autocomplete from "Components/Autocomplete.jsx";

const Home = () => (
  <>
    <Logo />
    <Autocomplete />
  </>
);

export default Home;
