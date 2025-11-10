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
  // {
  //   id: 1,
  //   name: "Hyatt Regency Aqaba Ayla",
  //   lat: 29.5480288,
  //   lng: 34.9853589,
  //   type: "resort",
  // },
  // { id: 2, name: "Mama Gaia", lat: 29.5480288, lng: 34.9853589, type: "park" },
  // {
  //   id: 3,
  //   name: "Island Apartments 1",
  //   lat: 29.5474604,
  //   lng: 34.9844776,
  //   type: "resort",
  // },
  // {
  //   id: 4,
  //   name: "Cloud7 Residence Ayla Aqaba",
  //   lat: 29.543,
  //   lng: 34.9905,
  //   type: "resort",
  // },
  // {
  //   id: 5,
  //   name: "La Plage",
  //   lat: 29.5474282,
  //   lng: 34.9882203,
  //   type: "shopping",
  // },
  // {
  //   id: 6,
  //   name: "Ayla Marina",
  //   lat: 29.5488347,
  //   lng: 34.9851153,
  //   type: "beach",
  // },
  // {
  //   id: 7,
  //   name: "Marina Village - Ayla",
  //   lat: 29.5458356,
  //   lng: 34.9870556,
  //   type: "resort",
  // },
  {
    id: 1,
    name: "Hyatt Regency Aqaba Ayla",
    lat: 29.5480288,
    lng: 34.9853589,
    type: "resort",
  },
  { id: 2, name: "Mama Gaia", lat: 29.5480288, lng: 34.9853589, type: "park" },
  {
    id: 3,
    name: "Island Apartments 1",
    lat: 29.5474604,
    lng: 34.9844776,
    type: "resort",
  },
  {
    id: 4,
    name: "Cloud7 Residence Ayla Aqaba",
    lat: 29.5474282,
    lng: 34.9882203,
    type: "resort",
  },
  {
    id: 5,
    name: "La Plage",
    lat: 29.5474282,
    lng: 34.9882203,
    type: "shopping",
  },

  {
    id: 6,
    name: "Ayla Marina",
    lat: 29.5488347,
    lng: 34.9851153,
    type: "beach",
  },
  {
    id: 7,
    name: "Marina Village - Ayla",
    lat: 29.5458356,
    lng: 34.9870556,
    type: "resort",
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
          rotate: 40,
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
