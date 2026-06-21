import { useEffect, useRef } from "react";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import type { Listing } from "@/components/shared/ListingCard";

declare global {
  interface Window { google: any; __apnaInitMap?: () => void }
}

let mapsLoaderPromise: Promise<void> | null = null;

function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (mapsLoaderPromise) return mapsLoaderPromise;
  mapsLoaderPromise = new Promise<void>((resolve, reject) => {
    window.__apnaInitMap = () => resolve();
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const tracking = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) { reject(new Error("Missing Google Maps key")); return; }
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__apnaInitMap${tracking ? `&channel=${tracking}` : ""}`;
    s.async = true; s.defer = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return mapsLoaderPromise;
}

export function CampusMap({
  listings,
  activeCategories,
  onSelect,
  center,
}: {
  listings: Listing[];
  activeCategories: Set<CategoryKey>;
  onSelect?: (l: Listing) => void;
  center?: { lat: number; lng: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    loadMaps()
      .then(() => {
        if (!mounted || !ref.current) return;
        const c = center ?? (listings[0] ? { lat: listings[0].lat as any, lng: listings[0].lng as any } : { lat: 20.5937, lng: 78.9629 });
        mapRef.current = new window.google.maps.Map(ref.current, {
          center: c,
          zoom: listings.length > 1 ? 5 : 13,
          disableDefaultUI: true,
          zoomControl: true,
          styles: DARK_STYLE,
        });
        renderMarkers();
      })
      .catch((e) => console.error(e));
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { renderMarkers(); /* eslint-disable-next-line */ }, [listings, activeCategories]);

  function renderMarkers() {
    if (!mapRef.current || !window.google) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    if (!infoRef.current) infoRef.current = new window.google.maps.InfoWindow();
    const bounds = new window.google.maps.LatLngBounds();
    let count = 0;
    listings.forEach((l) => {
      if (!activeCategories.has(l.type)) return;
      const color = CATEGORIES[l.type].color;
      const marker = new window.google.maps.Marker({
        position: { lat: (l as any).lat, lng: (l as any).lng },
        map: mapRef.current,
        title: l.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: "#0b1020",
          strokeWeight: 3,
        },
      });
      const price = (l as any).price_monthly ?? (l as any).price_daily ?? (l as any).price_slot;
      marker.addListener("click", () => {
        infoRef.current.setContent(
          `<div style="color:#0b1020;font-family:system-ui;min-width:160px">
            <div style="font-weight:600;margin-bottom:2px">${l.title}</div>
            <div style="font-size:11px;opacity:.75;margin-bottom:6px">${(l as any).city ?? ""}</div>
            ${price ? `<div style="font-size:12px;font-weight:600">₹${price.toLocaleString("en-IN")}</div>` : ""}
            <a href="/listing/${l.id}" style="display:inline-block;margin-top:6px;color:#b45309;font-size:12px;font-weight:600">View details →</a>
          </div>`,
        );
        infoRef.current.open(mapRef.current, marker);
        onSelect?.(l);
      });
      markersRef.current.push(marker);
      bounds.extend(marker.getPosition()!);
      count++;
    });
    if (count > 1) mapRef.current.fitBounds(bounds, 60);
  }

  return <div ref={ref} className="h-full w-full rounded-2xl overflow-hidden glass" />;
}

const DARK_STYLE: any = [
  { elementType: "geometry", stylers: [{ color: "#161a2b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1020" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9aa3c7" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a2f4a" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a93b8" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1530" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1a2a1f" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
];