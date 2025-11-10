import React, { useState, useCallback } from "react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import classes from "./main.module.css";
const containerStyle = {
  width: "95vw",
  height: "80vh",
  margin: "0 auto",
};

const myPOIs = [
  {
    id: 1,
    name: "Hyatt Regency Aqaba Ayla",
    lat: 29.54849702552752,
    lng: 34.989318987024866,
    type: "resort",
  },
  { id: 2, name: "Mama Gaia", lat: 29.545354073614902, lng: 34.9930457542115, type: "park" },
  {
    id: 3,
    name: "Island Apartments 1",
    lat: 29.544530053894317,
    lng: 34.98798149792797,
    type: "museum",
  },
  {
    id: 4,
    name: "Cloud7 Residence Ayla Aqaba",
    lat: 29.54709700159617,
    lng: 34.99001636131898,
    type: "museum",
  },
  {
    id: 5,
    name: "La Plage",
    lat: 29.550162073343973,
    lng: 34.991011195825266,
    type: "shopping",
  },
  {
    id: 6,
    name: "Ayla Marina",
    lat: 29.546266311563663,
    lng: 34.987956424942524,
    type: "beach",
  },
  {
    id: 7,
    name: "Marina Village - Ayla",
    lat: 29.545184919643933,
    lng: 34.990551299236614,
    type: "shopping",
  },
  {
    id: 8,
    name: "Ayla Oasis",
    lat: 29.5445582420694,
    lng: 34.99192609400132,
    type: "resort",
  },
  {
    id: 9,
    name: "Powerhut",
    lat: 29.54667884857335, 
    lng: 34.99010776150506,
    type: "park",
  },
  {
    id: 9,
    name: "Ayla Marina Offices",
    lat: 29.543458378802846, 
    lng: 34.99121192121538,
    type: "museum",
  },
];

const iconMap = {
  restaurant: "/icons/restaurant.svg",
  museum: "/icons/hotel.svg",
  park: "/icons/sports.svg",
  beach: "/icons/beach.svg",
  resort: "/icons/spa.svg",
  historic: "/icons/hotel.svg",
  shopping: "/icons/shopping.svg",
  default: "/icons/pool.svg",
};

const mapStyles = [
  // Hide all POIs
  { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
  // Keep roads visible
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  // Keep water visible
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  // Keep landscape visible
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
];

const apiKey = import.meta.env.VITE_GOOGLE_MAP_KEY;

const MapWithCluster = () => {
  const [selectedPOI, setSelectedPOI] = useState(null);

  const onLoad = useCallback((map) => {
    // Create bounds to include all POIs
    const bounds = new window.google.maps.LatLngBounds();

    const markers = myPOIs.map((poi) => {
      const iconUrl = iconMap[poi.type] || iconMap.default;
      const marker = new window.google.maps.Marker({
        map,
        position: { lat: poi.lat, lng: poi.lng },
        title: poi.name,
        icon: {
          url: iconUrl,
          scaledSize: new window.google.maps.Size(64, 64),
        },
      });
      marker.addListener("click", () => setSelectedPOI(poi));
      bounds.extend(marker.getPosition());
      return marker;
    });

    new MarkerClusterer({ map, markers });
    // Fit map to show all markers (Aqaba area)
    map.fitBounds(bounds);
    // Limit zoom level after fitting
    const listener = window.google.maps.event.addListenerOnce(
      map,
      "bounds_changed",
      () => {
        if (map.getZoom() > 16) map.setZoom(16);
      },
    );
    return () => window.google.maps.event.removeListener(listener);
  }, []);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={16}
        options={{
          styles: mapStyles,
          disableDefaultUI: false,
          mapTypeId: "satellite",
          rotate: 20,
          heading: 90,
          // this is to prevent the user from navigating outside of certain area
          restriction: {
            latLngBounds: {
              north: 29.6,
              south: 29.48,
              west: 34.9,
              east: 35.1,
            },
            strictBounds: true,
          },
          minZoom: 10,
          maxZoom: 24,
        }}
        onLoad={onLoad}>
        {selectedPOI && (
          <OverlayView
            position={{ lat: selectedPOI.lat, lng: selectedPOI.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <div className={classes.custom_popup}>
              <div className={classes.popup_header}>
                {/* <img src={iconMap[selectedPOI.type]} alt={selectedPOI.type} /> */}
                <h3>{selectedPOI.name}</h3>
                <button onClick={() => setSelectedPOI(null)}>×</button>
              </div>
              <p>Custom description for {selectedPOI.name}</p>
            </div>
          </OverlayView>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithCluster;
