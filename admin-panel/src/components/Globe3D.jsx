// import React, { useRef, useEffect, useState } from "react";
// import Globe from "globe.gl";

// export default function Globe3D() {
//   const globeEl = useRef();
//   const [hoveredPoint, setHoveredPoint] = useState(null);  // State to store hovered point data

//   useEffect(() => {
//     const globe = Globe()(globeEl.current)
//       .globeImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg")
//       .backgroundImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png")
//       .onPointClick(point => {
//         alert(
//           `City: ${point.city}\nCountry: ${point.country}`
//         );
//       })
//       .onPointHover(point => {
//         setHoveredPoint(point); // Set the hovered point's data
//       });


//     // Hardcoded list of important locations (cities, landmarks)
//     const importantLocations = [
//       { lat: 40.7128, lng: -74.0060, label: 'New York, USA' },  // New York
//       { lat: 51.5074, lng: -0.1278, label: 'London, UK' },      // London
//       { lat: 35.6762, lng: 139.6503, label: 'Tokyo, Japan' },    // Tokyo
//       { lat: 48.8566, lng: 2.3522, label: 'Paris, France' },     // Paris
//       { lat: 39.9042, lng: 116.4074, label: 'Beijing, China' },  // Beijing
//       { lat: 34.0522, lng: -118.2437, label: 'Los Angeles, USA' }, // Los Angeles
//       { lat: 40.7306, lng: -73.9352, label: 'Brooklyn, USA' }, // Brooklyn
//       { lat: -33.8688, lng: 151.2093, label: 'Sydney, Australia' }, // Sydney
//       { lat: 55.7558, lng: 37.6173, label: 'Moscow, Russia' },  // Moscow
//       { lat: 51.1657, lng: 10.4515, label: 'Berlin, Germany' }, // Berlin
//       { lat: 19.4326, lng: -99.1332, label: 'Mexico City, Mexico' }, // Mexico City
//     ];

//     // Add points to the globe for each location
//     globe.pointsData(importantLocations)
//       .pointAltitude(0.5)  // Set point size
//       .pointColor("yellow"); // Set point color

//     // Use `labelsData` to set hardcoded labels for the important locations
//     globe.labelsData(importantLocations)
//       .labelText('label')  // Specify which property contains the label text
//       .labelColor(() => 'yellow')  // Set label color
//       .labelSize(0.5)  // Set label size (in angular degrees)
//       .labelAltitude(0.002)  // Set label altitude (above the globe)
//       .labelResolution(3)  // Set label resolution (smoothness of the label)
//       .labelIncludeDot(true)  // Include a dot next to the label (to mark the exact location)
//       .labelDotRadius(0.1)  // Set dot radius size
//       .labelDotOrientation(() => 'bottom')  // Set orientation of the label dot to the bottom

//     return () => {
//       globeEl.current.innerHTML = "";  // Cleanup when component unmounts
//     };
//   }, []);

//   // Tooltip to display the hovered point information
//   const tooltipStyle = {
//     position: "absolute",
//     pointerEvents: "none",  // Ensure it doesn't interfere with hover event
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     color: "white",
//     padding: "5px 10px",
//     borderRadius: "5px",
//     fontSize: "12px",
//     display: hoveredPoint ? "block" : "none", // Only show tooltip when hovering over a point
//     left: `${hoveredPoint?.x}px`, // Position the tooltip based on the point's x coordinate
//     top: `${hoveredPoint?.y}px`  // Position the tooltip based on the point's y coordinate
//   };

//   return (
//     <div style={{ position: "relative", width: "100%", height: "600px" }}>
//       <div ref={globeEl} style={{ width: "100%", height: "100%" }} />
//       {hoveredPoint && (
//         <div style={tooltipStyle}>
//           <div>{hoveredPoint.city}</div>
//           <div>{hoveredPoint.country}</div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useRef, useEffect, useState } from "react";
import Globe from "globe.gl";

export default function Globe3D({ users }) {
  const globeEl = useRef();
  const [hoveredPoint, setHoveredPoint] = useState(null); // State to store hovered point data

  useEffect(() => {
    const globe = Globe()(globeEl.current)
      .globeImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg")
      .backgroundImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png")
      .onPointClick(point => {
        alert(
          `City: ${point.city}\nCountry: ${point.country}`
        );
      })
      .onPointHover(point => {
        setHoveredPoint(point); // Set the hovered point's data
      });

    // Add points to the globe for active users
    const activeUserLocations = users.map(user => ({
      lat: user.location?.lat || 0, // Latitude of the active user
      lng: user.location?.lon || 0, // Longitude of the active user
      label: user.location?.city || 'Unknown', // Label text (user's city)
    }));

    // Add active users as points on the globe
    globe.pointsData(activeUserLocations)
      .pointAltitude(0.5)  // Set point size
      .pointColor("red"); // Set point color for active users

    // Add labels for active users
    globe.labelsData(activeUserLocations)
      .labelText('label')  // Specify which property contains the label text
      .labelColor(() => 'red') // Set label color for active users
      .labelSize(0.5) // Set label size (in angular degrees)
      .labelAltitude(0.002); // Set label altitude for active users

    return () => {
      globeEl.current.innerHTML = "";  // Cleanup when component unmounts
    };
  }, [users]); // Re-run the effect when users data changes

  // Tooltip to display the hovered point information
  const tooltipStyle = {
    position: "absolute",
    pointerEvents: "none",  // Ensure it doesn't interfere with hover event
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "12px",
    display: hoveredPoint ? "block" : "none", // Only show tooltip when hovering over a point
    left: `${hoveredPoint?.x}px`, // Position the tooltip based on the point's x coordinate
    top: `${hoveredPoint?.y}px`  // Position the tooltip based on the point's y coordinate
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "600px" }}>
      <div ref={globeEl} style={{ width: "100%", height: "100%" }} />
      {hoveredPoint && (
        <div style={tooltipStyle}>
          <div>{hoveredPoint.city}</div>
          <div>{hoveredPoint.country}</div>
        </div>
      )}
    </div>
  );
}
