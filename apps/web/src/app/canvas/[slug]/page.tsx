"use client";

import React, { use } from "react";
import { Whiteboard } from "@/components/canvas/Whiteboard";

export default function CanvasPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  return <Whiteboard roomId={`room_${slug}`} roomSlug={slug} />;
}
