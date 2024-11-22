import React, { useState } from "react";
import Select from "react-select";
import "./App.css";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState("");

  const [selectedOptions, setSelectedOptions] = useState([]);

  // Handle change in multi-select
  const handleChange = (selected) => {
    setSelectedOptions(selected || []); // If no selection, set to empty array
  };




  const options = [
    { value: "Alphabets", label: "Alphabets" },
    { value: "Numbers", label: "Numbers" },
    { value: " Highest lowercase alphabet", label: " Highest lowercase alphabet" },
  ];


  const filters = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
  ];

  const handleJsonChange = (e) => {
    console.log({ value: e.target.value })
    setJsonInput(e.target.value);
    setError("");
  };

  const validateJson = (input) => {
    try {
      console.log({ input })
      const ans = JSON.parse(input)
      console.log({ ans: JSON.parse(input) })
      return true;
    } catch (err) {
      console.log(err)
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateJson(jsonInput)) {
      setError("Invalid JSON input. Please provide a valid JSON.");
      return;
    }

    const payload = JSON.parse(jsonInput);

    try {
      const res = await fetch("https://testbfhl.herokuapp.com/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.roll_number) {
        document.title = data.roll_number; // Set document title
      }
      setResponse(data);
    } catch (err) {
      setError("Error connecting to the API.");
    }
  };

  const renderResponse = () => {
    if (!response || selectedFilters.length === 0) return null;

    const filteredResponse = {};
    selectedFilters.forEach((filter) => {
      filteredResponse[filter.value] = response[filter.value];
    });

    return (
      <div className="response-container">
        <h4>Filtered Response</h4>
        <ul>
          {Object.entries(filteredResponse).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : value}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="App">
      <h2>API Input</h2>

      {/* Input Field */}
      <textarea
        placeholder='Enter valid JSON (e.g., { "data": ["A", "B", "1"] })'
        value={jsonInput}
        onChange={handleJsonChange}
        rows={3}
        className="input-field"
      />
      <Select
        options={options}
        isMulti
        onChange={handleChange}
        value={selectedOptions} // Selected options
        placeholder="Select options"
        className="multi-select"
      />
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Dropdown */}
      {response && (
        <div className="dropdown-container">
          <h4>Multi Filter</h4>
          <Select
            options={filters}
            isMulti
            onChange={setSelectedFilters}
            className="dropdown"
            placeholder="Select filters"
          />
        </div>
      )}

      {/* Render Response */}
      {renderResponse()}
    </div>
  );
};

export default App;
