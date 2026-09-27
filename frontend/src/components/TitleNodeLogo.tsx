"use client";

import React from "react";

export interface TitleNodeLogoProps {
  mode?: "light" | "reversed" | "mono";
  variant?: "full" | "horizontal" | "icon-only" | "app-icon";
  size?: "sm" | "md" | "lg" | "xl" | number;
  badge?: string;
  className?: string;
}

/**
 * Dedicated vector mark implementation adhering strictly to the official TitleNode
 * brand specification (titlenode-logo-concept (1).svg).
 */
export function TitleNodeIcon({
  mode = "light",
  size = 36,
  isAppIcon = false,
  className = "",
}: {
  mode?: "light" | "reversed" | "mono";
  size?: number;
  isAppIcon?: boolean;
  className?: string;
}) {
  const isReduced = size < 28;

  // Color mappings based on mode
  const lineStroke =
    mode === "reversed"
      ? "#F8F0E5"
      : mode === "mono"
      ? "#0F2C59"
      : "#0F2C59";

  const circleFill =
    mode === "reversed"
      ? "#0F2C59"
      : mode === "mono"
      ? "#FFFFFF"
      : "#F8F0E5";

  const circleStroke =
    mode === "reversed"
      ? "#F8F0E5"
      : mode === "mono"
      ? "#0F2C59"
      : "#0F2C59";

  const hexFill =
    mode === "reversed"
      ? "#F8F0E5"
      : mode === "mono"
      ? "#0F2C59"
      : "#0F2C59";

  const goldAccent = mode === "mono" ? "#0F2C59" : "#DAC0A3";

  // App icon container styling (rounded dark square)
  if (isAppIcon) {
    const rx = Math.round(size * 0.22);
    const innerSize = Math.round(size * 0.6);
    return (
      <div
        className={`flex items-center justify-center bg-[#0F2C59] shadow-sm flex-shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: rx,
        }}
      >
        <svg
          width={innerSize}
          height={innerSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="4" y1="50" x2="52" y2="50" stroke="#F8F0E5" strokeWidth="4" strokeLinecap="round" />
          <line x1="10" y1="20" x2="52" y2="50" stroke="#F8F0E5" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="10" y1="80" x2="52" y2="50" stroke="#F8F0E5" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="4" cy="50" r="4" fill="#0F2C59" stroke="#F8F0E5" strokeWidth="2" />
          <circle cx="10" cy="20" r="3.6" fill="#0F2C59" stroke="#F8F0E5" strokeWidth="1.8" />
          <circle cx="10" cy="80" r="3.6" fill="#0F2C59" stroke="#F8F0E5" strokeWidth="1.8" />
          <polygon points="52,50 60,63.9 76,63.9 84,50 76,36.1 60,36.1" fill="#F8F0E5" />
          <line x1="60" y1="36.1" x2="76" y2="36.1" stroke="#DAC0A3" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Reduced Glyph for sub-28px sizes (favicons / small badges)
  if (isReduced) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`flex-shrink-0 ${className}`}
      >
        <line x1="4" y1="16" x2="16" y2="16" stroke={lineStroke} strokeWidth="2.4" strokeLinecap="round" />
        <polygon points="16,16 18.8,21 24.4,21 27.2,16 24.4,11 18.8,11" fill={hexFill} />
        {mode !== "mono" && (
          <line x1="18.8" y1="11" x2="24.4" y2="11" stroke={goldAccent} strokeWidth="1.8" strokeLinecap="round" />
        )}
      </svg>
    );
  }

  // Full Mark (Normal sizes >= 28px)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
    >
      {/* Connector lines merging into the central hexagon */}
      <line x1="4" y1="50" x2="52" y2="50" stroke={lineStroke} strokeWidth="4" strokeLinecap="round" />
      <line x1="10" y1="20" x2="52" y2="50" stroke={lineStroke} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="10" y1="80" x2="52" y2="50" stroke={lineStroke} strokeWidth="2.4" strokeLinecap="round" />

      {/* Origin and branch circular nodes */}
      <circle cx="4" cy="50" r="4" fill={circleFill} stroke={circleStroke} strokeWidth="2" />
      <circle cx="10" cy="20" r="3.6" fill={circleFill} stroke={circleStroke} strokeWidth="1.8" />
      <circle cx="10" cy="80" r="3.6" fill={circleFill} stroke={circleStroke} strokeWidth="1.8" />

      {/* Hexagon terminal node */}
      <polygon points="52,50 60,63.9 76,63.9 84,50 76,36.1 60,36.1" fill={hexFill} />

      {/* Warm gold cap accent on hexagon roof */}
      {mode !== "mono" && (
        <line x1="60" y1="36.1" x2="76" y2="36.1" stroke={goldAccent} strokeWidth="2.2" strokeLinecap="round" />
      )}
    </svg>
  );
}

/**
 * Master TitleNode Brand Component.
 * Supports light/reversed/mono themes and full, horizontal, icon-only, or app-icon variants.
 */
export default function TitleNodeLogo({
  mode = "light",
  variant = "horizontal",
  size = "md",
  badge,
  className = "",
}: TitleNodeLogoProps) {
  // Dimension and typography calculation
  let iconPixelSize = 36;
  let textClass = "text-2xl";
  let taglineSize = "text-[9px]";

  if (typeof size === "number") {
    iconPixelSize = size;
    if (size <= 24) {
      textClass = "text-base";
      taglineSize = "text-[8px]";
    } else if (size <= 32) {
      textClass = "text-xl";
      taglineSize = "text-[9px]";
    } else if (size <= 48) {
      textClass = "text-3xl";
      taglineSize = "text-[10px]";
    } else {
      textClass = "text-5xl";
      taglineSize = "text-xs";
    }
  } else {
    switch (size) {
      case "sm":
        iconPixelSize = 24;
        textClass = "text-base";
        taglineSize = "text-[8px]";
        break;
      case "md":
        iconPixelSize = 34;
        textClass = "text-2xl";
        taglineSize = "text-[9px]";
        break;
      case "lg":
        iconPixelSize = 46;
        textClass = "text-4xl";
        taglineSize = "text-[10px]";
        break;
      case "xl":
        iconPixelSize = 60;
        textClass = "text-5xl";
        taglineSize = "text-xs";
        break;
    }
  }

  // Theme text colors
  const wordmarkColor = mode === "reversed" ? "text-[#F8F0E5]" : "text-[#0F2C59]";
  const taglineColor = mode === "reversed" ? "text-[#DAC0A3]" : "text-[#7A5C2E]";
  const badgeColor = mode === "reversed" ? "text-[#DAC0A3]/80" : "text-[#0F2C59]/70";

  // Icon only
  if (variant === "icon-only") {
    return <TitleNodeIcon mode={mode} size={iconPixelSize} className={className} />;
  }

  // App icon (boxed)
  if (variant === "app-icon") {
    return <TitleNodeIcon mode={mode} size={iconPixelSize} isAppIcon className={className} />;
  }

  // Full lockup (stacked with tagline)
  if (variant === "full") {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <div className="flex items-center gap-3">
          <TitleNodeIcon mode={mode} size={iconPixelSize} />
          <span className={`font-bold tracking-tight font-sans ${textClass} ${wordmarkColor}`}>
            TitleNode
          </span>
          {badge && (
            <span className={`font-light tracking-normal ${badgeColor} text-base sm:text-lg`}>
              | {badge}
            </span>
          )}
        </div>
        <span
          className={`font-semibold tracking-[0.18em] uppercase mt-1 ${taglineSize} ${taglineColor}`}
        >
          The Intelligence Layer for Land
        </span>
      </div>
    );
  }

  // Default: Horizontal / Compact lockup
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <TitleNodeIcon mode={mode} size={iconPixelSize} />
      <div className="flex items-baseline">
        <span className={`font-bold tracking-tight font-sans ${textClass} ${wordmarkColor}`}>
          TitleNode
        </span>
        {badge && (
          <span className={`font-light tracking-normal ml-2 ${badgeColor} text-sm sm:text-base`}>
            | {badge}
          </span>
        )}
      </div>
    </div>
  );
}
