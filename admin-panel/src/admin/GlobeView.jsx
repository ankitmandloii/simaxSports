import React from "react";
import Globe3D from "../components/Globe3D";

export default function GlobeView({ users }) {
  return (
    <div >
      <Globe3D users={users} />
    </div>
  );
}