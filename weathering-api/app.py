from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import pickle
import numpy as np
import logging
from datetime import datetime
from config import Config

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variable to store the model
model = None

def load_model():
    """Load the ML model from PKL file"""
    global model
    try:
        with open(Config.MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        logger.info("✅ Model loaded successfully!")
        return True
    except Exception as e:
        logger.error(f"❌ Error loading model: {str(e)}")
        return False

def get_weather_from_api(latitude, longitude):
    """
    Fetch fresh weather data from Open-Meteo API
    """
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        'latitude': latitude,
        'longitude': longitude,
        'hourly': 'temperature_2m,rain,snowfall,precipitation,surface_pressure,wind_speed_10m,cloud_cover,relative_humidity_2m'
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Open-Meteo API request failed with status code: {response.status_code}")

def calculate_season_from_date(date_string):
    """
    Calculate season from date (0=Winter, 1=Spring, 2=Summer, 3=Autumn)
    """
    try:
        date_obj = datetime.fromisoformat(date_string.replace('Z', '+00:00'))
        month = date_obj.month
        
        if month in [12, 1, 2]:
            return 0.0  # Winter
        elif month in [3, 4, 5]:
            return 1.0  # Spring
        elif month in [6, 7, 8]:
            return 2.0  # Summer
        else:
            return 3.0  # Autumn
    except:
        return 3.0  # Default to Autumn if date parsing fails

def get_ai_weather_data(latitude, longitude):
    """
    Main function to get AI model formatted weather data
    """
    # Fetch fresh data from API
    weather_data = get_weather_from_api(latitude, longitude)
    hourly = weather_data['hourly']
    
    # Calculate averages
    def calculate_average(data_array):
        return sum(data_array) / len(data_array)
    
    # Calculate temperature extremes
    temp_data = hourly['temperature_2m']
    temp_max = max(temp_data)
    temp_min = min(temp_data)
    
    # Calculate all averages
    averages = {
        'temperature_2m': calculate_average(temp_data),
        'rain': calculate_average(hourly['rain']),
        'snowfall': calculate_average(hourly['snowfall']),
        'precipitation': calculate_average(hourly['precipitation']),
        'surface_pressure': calculate_average(hourly['surface_pressure']),
        'wind_speed_10m': calculate_average(hourly['wind_speed_10m']),
        'cloud_cover': calculate_average(hourly['cloud_cover']),
        'relative_humidity_2m': calculate_average(hourly['relative_humidity_2m'])
    }
    
    # Calculate season from the first date in the data
    first_date = hourly['time'][0]
    season = calculate_season_from_date(first_date)
    elevation = weather_data['elevation']
    
    # Format for AI model
    ai_input = {
        'temp': round(averages['temperature_2m'], 1),
        'precip': round(averages['precipitation'], 2),
        'rain': round(averages['rain'], 2),
        'snowfall': round(averages['snowfall'], 2),
        'humidity': round(averages['relative_humidity_2m'], 1),
        'windspeed': round(averages['wind_speed_10m'], 1),
        'pressure': round(averages['surface_pressure'], 1),
        'cloud_cover': round(averages['cloud_cover'], 1),
        'elevation': elevation,
        'season': season,
        'temp_max': round(temp_max, 1),
        'temp_min': round(temp_min, 1)
    }
    
    return ai_input

def make_flood_prediction(weather_features):
    """
    Make flood prediction using the loaded model
    """
    # Check if model is loaded
    if model is None:
        raise Exception("Model not loaded")

    # Extract features in exact order expected by the model
    features = [
        float(weather_features['temp_max']),
        float(weather_features['temp_min']), 
        float(weather_features['precip']),
        float(weather_features['rain']),
        float(weather_features['snowfall']),
        float(weather_features['humidity']),
        float(weather_features['windspeed']),
        float(weather_features['pressure']),
        float(weather_features['cloud_cover']),
        float(weather_features['elevation']),
        float(weather_features['season'])
    ]

    # Convert to numpy array and make prediction
    input_array = np.array([features])
    
    # Check if model has predict_proba (classification) or predict (regression)
    if hasattr(model, 'predict_proba'):
        # Classification model - get probability
        prediction = model.predict(input_array)[0]
        probability = model.predict_proba(input_array)[0][1]
        
        # Determine risk level
        if probability > 0.7:
            risk_level = "High"
        elif probability > 0.4:
            risk_level = "Medium" 
        else:
            risk_level = "Low"
            
        result = {
            'prediction': int(prediction),
            'probability': float(probability),
            'risk_level': risk_level,
            'message': 'Flood predicted' if prediction == 1 else 'No flood predicted'
        }
    else:
        # Regression model - direct prediction
        prediction = model.predict(input_array)[0]
        result = {
            'prediction': float(prediction),
            'message': 'Flood risk score'
        }

    logger.info(f"✅ Flood prediction made: {result}")
    return result

@app.route('/')
def home():
    """API documentation"""
    return jsonify({
        'message': 'Weather & Flood Prediction API',
        'endpoints': {
            '/api/weather': 'GET - Get weather data for coordinates',
            '/api/predict': 'GET - Get flood prediction for coordinates',
            '/api/health': 'GET - Health check',
            '/api/model-info': 'GET - Model information',
            '/api/manual-predict': 'POST - Manual prediction with custom data'
        },
        'usage': {
            'weather_data': '/api/weather?lat=49.0&lon=32.0',
            'prediction': '/api/predict?lat=49.0&lon=32.0'
        }
    })

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """
    Weather API endpoint - returns formatted weather data
    """
    try:
        # Get coordinates from query parameters
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        if lat is None or lon is None:
            return jsonify({
                'error': 'Missing parameters',
                'message': 'Please provide both lat and lon parameters',
                'example': '/api/weather?lat=49.0&lon=32.0'
            }), 400
        
        # Validate coordinate ranges
        if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
            return jsonify({
                'error': 'Invalid coordinates',
                'message': 'Latitude must be between -90 and 90, Longitude between -180 and 180'
            }), 400
        
        # Get AI model formatted data
        ai_weather_data = get_ai_weather_data(lat, lon)
        
        return jsonify(ai_weather_data)
        
    except ValueError as e:
        return jsonify({
            'error': 'Invalid input',
            'message': 'Please provide valid numeric coordinates'
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'Processing failed',
            'message': str(e)
        }), 500

@app.route('/api/predict', methods=['GET'])
def get_flood_prediction():
    """
    Flood prediction API endpoint - returns flood prediction for coordinates
    """
    try:
        # Get coordinates from query parameters
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        if lat is None or lon is None:
            return jsonify({
                'error': 'Missing parameters',
                'message': 'Please provide both lat and lon parameters',
                'example': '/api/predict?lat=49.0&lon=32.0'
            }), 400
        
        # Validate coordinate ranges
        if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
            return jsonify({
                'error': 'Invalid coordinates',
                'message': 'Latitude must be between -90 and 90, Longitude between -180 and 180'
            }), 400
        
        # Get weather data
        weather_data = get_ai_weather_data(lat, lon)
        
        # Get flood prediction
        prediction = make_flood_prediction(weather_data)
        
        # Return response
        response = {
            'status': 'success',
            'coordinates': {'latitude': lat, 'longitude': lon},
            'weather_data': weather_data,
            'flood_prediction': prediction,
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"❌ Prediction error: {str(e)}")
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e)
        }), 500

@app.route('/api/manual-predict', methods=['POST'])
def manual_predict():
    """
    Manual prediction endpoint - accepts custom weather data
    """
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500

        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Make prediction
        prediction = make_flood_prediction(data)
        
        logger.info(f"✅ Manual prediction made: {prediction}")
        return jsonify({
            'status': 'success',
            'input_data': data,
            'prediction': prediction,
            'timestamp': datetime.now().isoformat()
        })

    except KeyError as e:
        error_field = str(e).strip("'")
        return jsonify({'error': f'Missing field: {error_field}'}), 400
    except ValueError as e:
        return jsonify({'error': f'Invalid data type: {str(e)}'}), 400
    except Exception as e:
        logger.error(f"❌ Manual prediction error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    model_status = "loaded" if model is not None else "not loaded"
    return jsonify({
        'status': 'healthy', 
        'message': 'Weather & Flood Prediction API is running',
        'model_status': model_status,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    model_type = type(model).__name__
    model_features = getattr(model, 'n_features_in_', 'Unknown')
    
    return jsonify({
        'model_type': model_type,
        'features_count': model_features,
        'input_format': {
            'temp_max': 'float',
            'temp_min': 'float', 
            'precip': 'float',
            'rain': 'float',
            'snowfall': 'float',
            'humidity': 'float',
            'windspeed': 'float',
            'pressure': 'float',
            'cloud_cover': 'float',
            'elevation': 'float',
            'season': 'float (0-3)'
        }
    })

# Load model when application starts
load_model()

if __name__ == '__main__':
    # Check if model loaded successfully
    if model is not None:
        logger.info("🚀 Starting Weather & Flood Prediction API...")
        app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
    else:
        logger.error("❌ Failed to load model. Cannot start API.")