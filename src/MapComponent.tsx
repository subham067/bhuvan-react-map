
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation for accessing query parameters
import { Feature, Map, View } from 'ol';
import 'ol/ol.css';
import { Tile as TileLayer } from 'ol/layer';
import { XYZ } from 'ol/source';
import { fromLonLat } from 'ol/proj'; // Import this for coordinate transformation
import "./Map.css"; // Ensure you have Map.css to set the map container size
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

const MapComponent = () => {
  const location = useLocation(); // Hook to access query parameters
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const longitude = parseFloat(queryParams.get('lon') || '88.2649512'); // Default to given coordinates
    const latitude = parseFloat(queryParams.get('lat') || '22.5355649');
    const zoomLevel = parseFloat(queryParams.get('zoom') || '14');

    // Convert coordinates from LonLat to map projection
    const centerCoordinates = fromLonLat([longitude, latitude]);

    const mapObj = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://bhuvan-ras2.nrsc.gov.in/tilecache/tilecache.py/1.0.0/bhuvan_imagery2/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        projection: 'EPSG:3857', // Use 'EPSG:3857' if using XYZ
        center: [0,0], // Initial center
        zoom: 2 // Initial zoom level
      })
    });

    const markerCoordinates = fromLonLat([longitude, latitude]);

    // Create a Point geometry for the marker
    const markerPoint = new Point(markerCoordinates);

    // Create a Feature with the Point geometry
    const markerFeature = new Feature({
      geometry: markerPoint
    });

    // Apply style to the marker
    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png', // URL to marker icon
        scale: 0.1 // Adjust the scale as needed
      })
    });
    markerFeature.setStyle(markerStyle);

    // Create a Vector source and layer for the marker
    const markerSource = new VectorSource({
      features: [markerFeature]
    });

    const markerLayer = new VectorLayer({
      source: markerSource
    });

    // Add the marker layer to the map
    mapObj.addLayer(markerLayer);

    // Animate zoom and center
    mapObj.getView().animate({
      center: centerCoordinates,
      zoom: zoomLevel,
      duration: 1000 // Duration in milliseconds (1000ms = 1s)
    });

    // return () => mapObj.setTarget(null);
  }, [location.search]); // Depend on location.search to re-run when query params change

  return <div className="map" ref={mapRef} />;
};

export default MapComponent;

