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
  { id: 1,  name: "Ayla Marina",           lat: 29.5450,  lng: 34.9900, type: "resort" },
  { id: 2,  name: "Ayla Golf Club",        lat: 29.5460,  lng: 34.9920, type: "park" },
  { id: 3,  name: "Ayla Water Park",       lat: 29.5420,  lng: 34.9890, type: "park" },
  { id: 4,  name: "Ayla Beach Club",       lat: 29.5410,  lng: 34.9880, type: "beach" },
  { id: 5,  name: "Ayla Golf Club (Alt)",  lat: 29.5465,  lng: 34.9930, type: "resort" },
  { id: 6,  name: "Ayla Boutique Hotel",   lat: 29.5440,  lng: 34.9910, type: "resort" },
  { id: 7,  name: "Cloud7 Residence",      lat: 29.5430,  lng: 34.9905, type: "resort" },
  { id: 8,  name: "Marina Village",        lat: 29.5452,  lng: 34.9915, type: "shopping" },
  { id: 10, name: "Mama Gaia Beach Club",  lat: 29.5435,  lng: 34.9885, type: "beach" },
  { id: 11, name: "B12 Beach Club",        lat: 29.5438,  lng: 34.9898, type: "beach" },
  { id: 12, name: "The Courts by Ayla",    lat: 29.5468,  lng: 34.9925, type: "sports" },
  { id: 13, name: "Rise Adventure Park",   lat: 29.5428,  lng: 34.9892, type: "park" },
  { id: 14, name: "Diverse Divers Club",   lat: 29.5432,  lng: 34.9902, type: "beach" },
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

// // Auto-center based on POIs
// const avgLat = myPOIs.reduce((sum, p) => sum + p.lat, 0) / myPOIs.length;
// const avgLng = myPOIs.reduce((sum, p) => sum + p.lng, 0) / myPOIs.length;
// const center = { lat: avgLat, lng: avgLng };
const apiKey = import.meta.env.VITE_GOOGLE_MAP_KEY
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
          tilt: 45,
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
          minZoom: 8,
          maxZoom: 20,
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
