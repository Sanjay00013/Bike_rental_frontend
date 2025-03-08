import { useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000';

function App() {
  const [formData, setFormData] = useState({
    hour: 10,
    season: 'Summer',
    holiday: 'No Holiday',
    temperature: 15.0,
    humidity: 60,
    dewPoint: 10.0,
    windSpeed: 2.5,
    visibility: 2000,
    solarRadiation: 0.5,
    rainfall: 0.0,
    snowfall: 0.0
  });

  const [predictedCount, setPredictedCount] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validate input values
  const validateInputs = () => {
    if (formData.hour < 0 || formData.hour > 23) {
      throw new Error('Hour must be between 0 and 23');
    }
    if (formData.humidity < 0 || formData.humidity > 100) {
      throw new Error('Humidity must be between 0 and 100');
    }
    if (formData.visibility < 0) {
      throw new Error('Visibility cannot be negative');
    }
    if (formData.rainfall < 0) {
      throw new Error('Rainfall cannot be negative');
    }
    if (formData.snowfall < 0) {
      throw new Error('Snowfall cannot be negative');
    }
    if (formData.solarRadiation < 0) {
      throw new Error('Solar radiation cannot be negative');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous errors when user makes changes
    setError(null);
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs before sending
      validateInputs();

      // First check if backend is available
      const healthCheck = await fetch(`${API_URL}/api/health`);
      if (!healthCheck.ok) {
        throw new Error('Backend service is not available');
      }

      // Make prediction request
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hour: parseInt(formData.hour),
          season: formData.season.toLowerCase(),
          holiday: formData.holiday === 'Holiday' ? 1 : 0,
          temperature: parseFloat(formData.temperature),
          humidity: parseInt(formData.humidity),
          dewPoint: parseFloat(formData.dewPoint),
          windSpeed: parseFloat(formData.windSpeed),
          visibility: parseInt(formData.visibility),
          solarRadiation: parseFloat(formData.solarRadiation),
          rainfall: parseFloat(formData.rainfall),
          snowfall: parseFloat(formData.snowfall)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get prediction');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setPredictedCount(data.prediction);
      } else {
        throw new Error(data.error || 'Failed to get prediction');
      }
    } catch (err) {
      setError(err.message);
      setPredictedCount(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="header">
          <div className="header-icon">
            <span className="icon icon-bicycle"></span>
          </div>
          <div className="header-text">
            <h1>Bike Rental Count Prediction</h1>
            <p>Forecast rental counts based on weather and seasonal factors</p>
          </div>
        </div>
        
        <hr className="divider" />
        
        <div className="grid-container">
          {/* Time & Season Section */}
          <div className="section">
            <div className="section-header">
              <span className="icon icon-calendar"></span>
              <h2 className="section-title">Time & Season</h2>
            </div>
            
            <div className="form-groups">
              <div className="form-group">
                <span className="icon icon-clock"></span>
                <label className="form-label">Hour (0-23):</label>
                <input
                  type="number"
                  name="hour"
                  min="0"
                  max="23"
                  value={formData.hour}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <span className="icon icon-sun"></span>
                <label className="form-label">Season:</label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option>Spring</option>
                  <option>Summer</option>
                  <option>Fall</option>
                  <option>Winter</option>
                </select>
              </div>
              
              <div className="form-group">
                <span className="icon icon-calendar"></span>
                <label className="form-label">Holiday:</label>
                <select
                  name="holiday"
                  value={formData.holiday}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option>No Holiday</option>
                  <option>Holiday</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Weather Conditions */}
          <div className="section">
            <div className="section-header">
              <span className="icon icon-weather"></span>
              <h2 className="section-title">Weather Conditions</h2>
            </div>
            
            <div className="form-groups">
              <div className="form-group">
                <span className="icon icon-temperature"></span>
                <label className="form-label">Temperature (C):</label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className="form-control"
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <span className="icon icon-humidity"></span>
                <label className="form-label">Humidity (%):</label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  className="form-control"
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <span className="icon icon-dewpoint"></span>
                <label className="form-label">Dew Point (C):</label>
                <input
                  type="number"
                  name="dewPoint"
                  value={formData.dewPoint}
                  onChange={handleInputChange}
                  className="form-control"
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <span className="icon icon-wind"></span>
                <label className="form-label">Wind Speed (m/s):</label>
                <input
                  type="number"
                  name="windSpeed"
                  value={formData.windSpeed}
                  onChange={handleInputChange}
                  className="form-control"
                  step="0.1"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <span className="icon icon-visibility"></span>
                <label className="form-label">Visibility (10m):</label>
                <input
                  type="number"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className="form-control"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <span className="icon icon-radiation"></span>
                <label className="form-label">Solar Radiation (MJ/m2):</label>
                <input
                  type="number"
                  name="solarRadiation"
                  value={formData.solarRadiation}
                  onChange={handleInputChange}
                  className="form-control"
                  step="0.1"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Precipitation Section */}
        <div className="section">
          <div className="section-header">
            <span className="icon icon-rain"></span>
            <h2 className="section-title">Precipitation</h2>
          </div>
          
          <div className="grid-container">
            <div className="form-group">
              <span className="icon icon-rain"></span>
              <label className="form-label">Rainfall (mm):</label>
              <input
                type="number"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleInputChange}
                className="form-control"
                step="0.1"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <span className="icon icon-snow"></span>
              <label className="form-label">Snowfall (cm):</label>
              <input
                type="number"
                name="snowfall"
                value={formData.snowfall}
                onChange={handleInputChange}
                className="form-control"
                step="0.1"
                min="0"
              />
            </div>
          </div>
        </div>
        
        {/* Prediction Result */}
        <div className="prediction-section">
          <div className="section-header">
            <span className="icon icon-chart"></span>
            <h2 className="section-title">Predicted Rental Count</h2>
          </div>
          
          <div className="prediction-value">
            {isLoading ? (
              <div className="prediction-placeholder">Loading...</div>
            ) : error ? (
              <div className="prediction-error">{error}</div>
            ) : predictedCount !== null ? (
              <div>{predictedCount}</div>
            ) : (
              <div className="prediction-placeholder">-</div>
            )}
          </div>
        </div>
        
        {/* Predict Button */}
        <button 
          onClick={handlePredict}
          className="predict-button"
          disabled={isLoading}
        >
          <span className="icon icon-chart"></span>
          {isLoading ? 'Predicting...' : 'Predict Rental Count'}
        </button>
      </div>
    </div>
  )
}

export default App