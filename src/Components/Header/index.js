import React from "react";
import Switch from "react-switch";

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      currentLocation: "",
      unit: "metric",
      checked: false,
    }
  }

  handleChange = (e) => {
    if (e.target.value !== "") {
      this.setState({
        currentLocation: e.target.value
      });
    }
  }

  handleSwitch = async (checked) => {
    if (checked === false) {
      await this.setState({
        unit: "metric"
      })
    } else {
      await this.setState({
        unit: "imperial"
      })
    }
    this.props.setUnit(this.state.unit);
    this.setState({ checked: checked });
  }

  render() {
    return (
      <header>
        <h1>Weather Report</h1>
        <div style={{ marginRight: "20em" }}>
          <Switch
            onChange={this.handleSwitch}
            checked={this.state.checked}
            uncheckedIcon={this.state.checked === true ? <b style={{ color: "#fff", padding: "7px" }}>°F</b> : <b style={{ color: "#fff", padding: "5px" }}>°C</b>}
            checkedIcon={this.state.checked === false ? <b style={{ color: "#fff", padding: "5px" }}>°C</b> : <b style={{ color: "#fff", padding: "7px" }}>°F</b>}
            offColor="#080"
          />
        </div>
        <input
          placeholder="Search a new location"
          className="search-input"
          onChange={this.handleChange}
        />
        <button
          className="search-button"
          type="button"
          onClick={this.props.updateLocationClick.bind(this, this.state.currentLocation)}
        >
          <svg className="svg-icon" viewBox="0 0 20 20">
            <path d="M17.545 15.467l-3.779-3.779a6.15 6.15 0 0 0 .898-3.21c0-3.417-2.961-6.377-6.378-6.377A6.185 6.185 0 0 0 2.1 8.287c0 3.416 2.961 6.377 6.377 6.377a6.15 6.15 0 0 0 3.115-.844l3.799 3.801a.953.953 0 0 0 1.346 0l.943-.943c.371-.371.236-.84-.135-1.211zM4.004 8.287a4.282 4.282 0 0 1 4.282-4.283c2.366 0 4.474 2.107 4.474 4.474a4.284 4.284 0 0 1-4.283 4.283c-2.366-.001-4.473-2.109-4.473-4.474z" />
          </svg>
        </button>
      </header>
    );
  }
};

export default Header;