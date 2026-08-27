"use client";

import React from "react";
import { Whiteboard } from "@/components/canvas/Whiteboard";

export default function PersonalCanvasPage() {
  return <Whiteboard isPersonal={true} />;
}
