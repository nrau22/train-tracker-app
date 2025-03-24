# Train Location Tracker

## Description
This project is a React-based web application that retrieves real-time train locations from the DigiTraffic API and displays them on an interactive map using Leaflet.js. It provides users with a visual representation of train movements across the railway network and allows region-based filtering.

## Features
- Fetch real-time train location data from the DigiTraffic API
- Display train locations on a Leaflet.js map
- Automatic updates every 10 seconds
- Train speed-based color-coded markers (green for slow, red for fast trains)
- Sidebar for filtering trains by region and displaying additional information

## Technologies Used
- **Frontend:** React, JavaScript, CSS
- **Map Library:** Leaflet.js
- **API:** [DigiTraffic API](https://www.digitraffic.fi/en/)

## Installation and Setup
### Prerequisites
Ensure you have the following installed:
- Node.js & npm
- A web browser (for frontend testing)

### Steps to Set Up
1. Clone the repository:
   ```sh
   git clone https://github.com/nrau22/train-tracker-app.git
   cd train-tracker-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
4. Open the application in your browser at `http://localhost:3000`

