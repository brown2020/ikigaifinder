"use client";
import React from "react";

export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-semibold">{title}</h2>
      {subtitle ? (
        <p className="text-gray-700 mt-2 max-w-2xl mx-auto">{subtitle}</p>
      ) : null}
    </div>
  );
}
