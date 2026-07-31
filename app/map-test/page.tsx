"use client";

import Map from "react-map-gl/maplibre";

export default function MapTest() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Map
        mapStyle="https://demotiles.maplibre.org/style.json"
        initialViewState={{
          longitude: 78.4867,
          latitude: 17.385,
          zoom: 11,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}