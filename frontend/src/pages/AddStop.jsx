import { useState } from "react";
import axios from "../api/axios";
import { useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";
import { motion } from "framer-motion";

function LocationPicker({ onAdd }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onAdd(lat, lng);
    }
  });
  return null;
}

function AddStop() {
  const [searchParams] = useSearchParams();
  const routeId = searchParams.get("routeId");

  const [stops, setStops] = useState([]);
  const [stopName, setStopName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapClick = (lat, lng) => {
    setSelectedLocation({ latitude: lat, longitude: lng });
  };

  const addStopToList = () => {
    if (!stopName || !selectedLocation) {
      alert("Select location on map and enter stop name");
      return;
    }

    const newStop = {
      name: stopName,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude
    };

    setStops([...stops, newStop]);
    setStopName("");
    setSelectedLocation(null);
  };

  const saveStops = async () => {
    try {
      if (stops.length === 0) {
        alert("Add at least one stop before saving");
        return;
      }

      await axios.post("/routes/add-stops-batch", { routeId, stops });

      alert("Stops saved successfully");
      setStops([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save stops");
    }
  };

  if (!routeId) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Add Stops</h1>
        <p className="text-rose-500 mt-2">
          No route selected. Create a route first.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[80vh] w-full grid grid-cols-[1fr_320px] gap-6">

      {/* MAP WRAPPER */}
      <div className="min-h-0 rounded-3xl overflow-hidden border border-slate-200 shadow-sm">

        <div className="h-full w-full">

          <MapContainer
            center={[18.5204, 73.8567]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <LocationPicker onAdd={handleMapClick} />

            {selectedLocation && (
              <Marker
                position={[
                  selectedLocation.latitude,
                  selectedLocation.longitude
                ]}
              >
                <Popup>Selected Stop</Popup>
              </Marker>
            )}

            {stops.map((stop, index) => (
              <Marker key={index} position={[stop.latitude, stop.longitude]}>
                <Popup>{stop.name}</Popup>
              </Marker>
            ))}
          </MapContainer>

        </div>
      </div>

      {/* PANEL */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Add Stops
        </h2>

        <p className="text-xs text-slate-500 mb-4">
          Click the map → name the stop → add to route
        </p>

        <input
          placeholder="Stop Name"
          value={stopName}
          onChange={(e) => setStopName(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
        />

        <button
          onClick={addStopToList}
          className="mt-3 w-full rounded-full bg-emerald-500 py-2 text-sm text-white hover:bg-emerald-400"
        >
          Add Stop
        </button>

        {/* STOP LIST */}
        <div className="mt-6 flex-1 overflow-y-auto">

          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Stops
          </h3>

          <div className="space-y-2">

            {stops.map((stop, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span>{stop.name}</span>
                <span className="text-xs text-slate-400">
                  #{index + 1}
                </span>
              </div>
            ))}

          </div>
        </div>

        <button
          onClick={saveStops}
          className="mt-4 w-full rounded-full bg-slate-900 py-2 text-sm text-white hover:bg-slate-800"
        >
          Save Stops
        </button>

      </motion.div>

    </div>
  );
}

export default AddStop;