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
  { id: 1, name: "Ayla Marina", lat: 29.5138, lng: 35.014, type: "resort" },
  { id: 2, name: "Ayla Golf Club", lat: 29.5145, lng: 35.015, type: "park" },
  { id: 3, name: "Ayla Water Park", lat: 29.515, lng: 35.016, type: "park" },
  { id: 4, name: "Ayla Beach Club", lat: 29.5125, lng: 35.013, type: "beach" },
  // {
  //   id: 5,
  //   name: "Ayla Golf Club",
  //   lat: 29.56246,
  //   lng: 34.9913,
  //   type: "resort",
  // },
  {
    id: 6,
    name: "Ayla Boutique Hotel",
    lat: 29.514,
    lng: 35.0135,
    type: "resort",
  },
  {
    id: 7,
    name: "Cloud7 Residence",
    lat: 29.513,
    lng: 35.0145,
    type: "resort",
  },
  // { id: 8, name: "Marina Village", lat: 29.55, lng: 34.99, type: "shopping" },
  {
    id: 10,
    name: "Mama Gaia Beach Club",
    lat: 29.5155,
    lng: 35.014,
    type: "beach",
  },
  { id: 11, name: "B12 Beach Club", lat: 29.5156, lng: 35.0155, type: "beach" },
  {
    id: 12,
    name: "The Courts by Ayla",
    lat: 29.516,
    lng: 35.0148,
    type: "sports",
  },
  {
    id: 13,
    name: "Rise Adventure Park",
    lat: 29.5148,
    lng: 35.0132,
    type: "park",
  },
  {
    id: 14,
    name: "Diverse Divers Club",
    lat: 29.513,
    lng: 35.014,
    type: "beach",
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

// // Auto-center based on POIs
// const avgLat = myPOIs.reduce((sum, p) => sum + p.lat, 0) / myPOIs.length;
// const avgLng = myPOIs.reduce((sum, p) => sum + p.lng, 0) / myPOIs.length;
// const center = { lat: avgLat, lng: avgLng };

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
    <LoadScript googleMapsApiKey="AIzaSyC7HWyIhqqoiXw5vcTqgH9BI0GD7NVt66A">
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
