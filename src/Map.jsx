import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import classes from "./main.module.css";

const containerStyle = {
  height: "80vh",
  maxWidth: "94vw",
  margin: "0 auto",
  overflow: "hidden",
  width: "100%",
};

const layoutStyle = {
  display: "flex",
  position: "relative",
  width: "100%",
};
const sidebarWidth = 300;
const myPOIs = [
  {
    id: 1,
    name: "Hyatt Regency Aqaba Ayla",
    lat: 29.54849702552752,
    lng: 34.989318987024866,
    type: "resort",
    img: "/places/Hyatt-Regency.jpg",
  },
  {
    id: 2,
    name: "Mama Gaia",
    lat: 29.545354073614902,
    lng: 34.9930457542115,
    type: "park",
    img: "/places/Mama-Gaia.png",
  },
  {
    id: 3,
    name: "Island Apartments 1",
    lat: 29.544530053894317,
    lng: 34.98798149792797,
    type: "museum",
    img: "/places/island-apartment.png",
  },
  {
    id: 4,
    name: "Cloud7 Residence Ayla Aqaba",
    lat: 29.54709700159617,
    lng: 34.99001636131898,
    type: "museum",
    img: "/places/Cloud-7.png",
  },
  {
    id: 5,
    name: "La Plage",
    lat: 29.550162073343973,
    lng: 34.991011195825266,
    type: "shopping",
    img: "/places/la-plage.png",
  },
  {
    id: 6,
    name: "Ayla Marina",
    lat: 29.546266311563663,
    lng: 34.987956424942524,
    type: "beach",
    img: "/places/Ayla-Marina.png",
  },
  {
    id: 7,
    name: "Marina Village - Ayla",
    lat: 29.545184919643933,
    lng: 34.990551299236614,
    type: "shopping",
    img: "/places/Marina-Village.png",
  },
  {
    id: 8,
    name: "Ayla Oasis",
    lat: 29.5445582420694,
    lng: 34.99192609400132,
    type: "resort",
    img: "/places/ayla-oasis.png",
  },
  {
    id: 9,
    name: "Powerhut",
    lat: 29.54667884857335,
    lng: 34.99010776150506,
    type: "park",
    img: "/places/power-hut-gym.png",
  },
  {
    id: 10,
    name: "Ayla Marina Offices",
    lat: 29.543458378802846,
    lng: 34.99121192121538,
    type: "museum",
    img: "/places/ayla-marina-offices.png",
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [visiblePOI, setVisiblePOI] = useState(null);
  const mapRef = useRef(null);
  // const markersRef = useRef([]);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const onLoad = useCallback((map) => {
    mapRef.current = map;
    const bounds = new window.google.maps.LatLngBounds();

    // Prepare markers WITHOUT map yet
    const markers = myPOIs.map((poi) => {
      const iconUrl = iconMap[poi.type] || iconMap.default;
      const marker = new window.google.maps.Marker({
        position: { lat: poi.lat, lng: poi.lng },
        title: poi.name,
        icon: {
          url: iconUrl,
          scaledSize: new window.google.maps.Size(64, 64),
        },
        animation: window.google.maps.Animation.DROP, // animation will trigger when setMap is called
        map: null, // IMPORTANT: don't attach to map yet
      });
      marker.addListener("click", () => setSelectedPOI(poi));
      bounds.extend(marker.getPosition());
      return marker;
    });
    // Fit map to bounds first
    map.fitBounds(bounds);
    // Once map is idle, add markers with DROP animation
    window.google.maps.event.addListenerOnce(map, "idle", () => {
      markers.forEach((marker, i) => {
        setTimeout(() => {
          marker.setMap(map); // this triggers DROP animation
        }, i * 150);
      });
      // Apply rotation & tilt
      map.setHeading(-90);
      map.setTilt(-45);
      setTimeout(() => {
        new MarkerClusterer({ map, markers });
      }, markers.length * 150 + 100); // wait until all drops finish
    });
  }, []);

  // Center map when a sidebar item is clicked
  const handlePOIClick = (poi) => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const img = new Image();
    img.src = poi.img;
    img.onload = () => setSelectedPOI(poi);

    // Smooth pan
    map.panTo({ lat: poi.lat, lng: poi.lng });
    const targetZoom = 18;
    const zoomInterval = setInterval(() => {
      if (map.getZoom() < targetZoom) map.setZoom(map.getZoom() + 1);
      else clearInterval(zoomInterval);
    }, 50);
    window.google.maps.event.addListenerOnce(map, "idle", () => {
      const marker = markersRef.current.find((m) => m.getTitle() === poi.name);
      if (marker) {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 1400);
      }
    });
  };

  const dynamicSidebarStyle = {
    width: sidebarWidth,
    transform: sidebarOpen ? "translateX(0)" : `translateX(-${sidebarWidth}px)`,
    transition: "transform 0.4s ease",
    overflow: "hidden",
    background: "#f8f9fa",
    borderRight: "1px solid #ddd",
    padding: "1rem",
    position: "relative", // needed for the toggle button inside
  };
  const dynamicMapStyle = {
    flexGrow: 1,
    marginLeft: sidebarOpen ? 0 : -sidebarWidth, // slide map to fill space
    transition: "margin-left 0.4s ease",
  };

  return (
    <div style={layoutStyle}>
      {/* Sidebar */}
      <div style={dynamicSidebarStyle}>
        {sidebarOpen && (
          <>
            <h2 style={{ marginBottom: "1rem" }}>📍 Points of Interest</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {myPOIs.map((poi) => (
                <li
                  key={poi.id}
                  onClick={() => handlePOIClick(poi)}
                  style={{
                    marginBottom: "0.8rem",
                    cursor: "pointer",
                    padding: "0.5rem 0.8rem",
                    borderRadius: "8px",
                    background:
                      selectedPOI?.id === poi.id ? "#e9ecef" : "transparent",
                    transition: "background 0.3s ease",
                  }}>
                  <strong>{poi.name}</strong>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div
        onClick={toggleSidebar}
        style={{
          position: "absolute",
          left: sidebarOpen ? sidebarWidth - 25 : 25,
          top: "50%",
          transform: "translateY(-50%)",
          width: 50,
          height: 50,
          background: "rgb(248, 249, 250)",
          border: "1px solid #e9ecef",
          color: "#005f9b",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 999,
          transition: "left 0.4s ease",
          fontSize: "16px",
          padding: "2px 0 0 2px",
        }}>
        {sidebarOpen ? "◀" : "▶"}
      </div>
      <div style={{ ...dynamicMapStyle }}>
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={16}
            options={{
              styles: mapStyles,
              disableDefaultUI: false,
              mapId: "a4ec54b475c8279aff2893b1",
              mapTypeId: "satellite",
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
                <div
                  className={classes.custom_popup}
                  style={{
                    transition: "opacity 0.3s ease",
                    opacity: selectedPOI ? 1 : 0,
                  }}
                  key={selectedPOI.id}>
                  <img src={selectedPOI.img} alt={selectedPOI.name} />
                  <div className={classes.text_content_wrapper}>
                    <div className={classes.popup_header}>
                      <h3>{selectedPOI.name}</h3>
                      <button onClick={() => setSelectedPOI(null)}>×</button>
                    </div>
                    <p>Custom description for {selectedPOI.name}</p>
                  </div>
                </div>
              </OverlayView>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
    // <>
    //   <div style={layoutStyle}>
    //     {/* Sidebar */}
    //     <div style={sidebarStyle}>
    //       <h2 style={{ marginBottom: "1rem" }}>📍 Points of Interest</h2>
    //       <ul style={{ listStyle: "none", padding: 0 }}>
    //         {myPOIs.map((poi) => (
    //           <li
    //             key={poi.id}
    //             onClick={() => handlePOIClick(poi)}
    //             style={{
    //               marginBottom: "0.8rem",
    //               cursor: "pointer",
    //               padding: "0.5rem 0.8rem",
    //               borderRadius: "8px",
    //               background:
    //                 selectedPOI?.id === poi.id ? "#e9ecef" : "transparent",
    //               transition: "background 0.2s ease",
    //             }}>
    //             <strong>{poi.name}</strong>
    //             <br />
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //     <LoadScript googleMapsApiKey={apiKey}>
    //       <GoogleMap
    //         mapContainerStyle={containerStyle}
    //         zoom={16}
    //         options={{
    //           styles: mapStyles,
    //           disableDefaultUI: false,
    //           mapTypeId: "satellite",
    //           rotate: 45,
    //           heading: 90,
    //           // this is to prevent the user from navigating outside of certain area
    //           restriction: {
    //             latLngBounds: {
    //               north: 29.6,
    //               south: 29.48,
    //               west: 34.9,
    //               east: 35.1,
    //             },
    //             strictBounds: true,
    //           },
    //           minZoom: 10,
    //           maxZoom: 24,
    //         }}
    //         onLoad={onLoad}>
    //         {selectedPOI && (
    //           <OverlayView
    //             position={{ lat: selectedPOI.lat, lng: selectedPOI.lng }}
    //             mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
    //             <div className={classes.custom_popup}>
    //               <img src={selectedPOI.img} alt={selectedPOI.name} />
    //               <div className={classes.text_content_wrapper}>
    //                 <div className={classes.popup_header}>
    //                   <h3>{selectedPOI.name}</h3>
    //                   <button onClick={() => setSelectedPOI(null)}>×</button>
    //                 </div>
    //                 <p>Custom description for {selectedPOI.name}</p>
    //               </div>
    //             </div>
    //           </OverlayView>
    //         )}
    //       </GoogleMap>
    //     </LoadScript>
    //   </div>
    // </>
  );
};

export default MapWithCluster;
