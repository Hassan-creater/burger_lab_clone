'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 31.5497, // Lahore default
  lng: 74.3436,
};

type Props = {
  lat?: number;
  lng?: number;
  orderId: string;
  status : string;
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

export default function GoogleMapComponent({ lat = defaultCenter.lat, lng = defaultCenter.lng, orderId , status }: Props) {
  const router = useRouter();

  const mapRef = useRef<google.maps.Map | null>(null);
  const riderMarkerRef = useRef<google.maps.Marker | null>(null);
  const riderAnimRef = useRef<number | null>(null);
  const lastRiderPosRef = useRef<google.maps.LatLngLiteral | null>(null);
  const pendingRiderRef = useRef<google.maps.LatLngLiteral | null>(null);

  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);
  const routePathRef = useRef<google.maps.LatLngLiteral[]>([]); // keep up-to-date reference

  const token = Cookies.get('accessToken');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['marker'],
  });

  const mapCenter = useMemo(() => ({ lat, lng }), [lat, lng]);

  // helper to set routePath and keep ref synced
  function applyRoutePath(path: google.maps.LatLngLiteral[]) {
    setRoutePath(path);
    routePathRef.current = path;
  }

  // helper: find closest index on path to a target point (Euclidean on lat/lng — fine for short distances)
  function getClosestIndex(path: google.maps.LatLngLiteral[], target: google.maps.LatLngLiteral) {
    if (!path || path.length === 0) return -1;
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < path.length; i++) {
      const dLat = path[i].lat - target.lat;
      const dLng = path[i].lng - target.lng;
      const dist = dLat * dLat + dLng * dLng;
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  // Trim the routePath so points behind the rider are removed.
  // We set the first point to the rider's current position so polyline starts exactly at rider.
  function trimRoutePathToPosition(target: google.maps.LatLngLiteral) {
    const existing = routePathRef.current;
    if (!existing || existing.length === 0) return;

    const idx = getClosestIndex(existing, target);
    if (idx <= 0) {
      // already at or before first point — replace first with target
      const newPath = [target, ...existing.slice(1)];
      applyRoutePath(newPath);
    } else if (idx >= existing.length - 1) {
      // reached end
      applyRoutePath([]);
    } else {
      const rest = existing.slice(idx);
      // replace first with exact target so polyline starts at rider's current position
      const newPath = [target, ...rest.slice(1)];
      applyRoutePath(newPath);
    }
  }

  // ---------- SOCKET (kept order/events intact as requested) ----------
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!token || !orderId) return;
    if(status && status == "delivered"){
      toast.success("Order is Delivered.")
      router.push("/orders")
      return
    }

    if( status && status != "out_for_delivery"){
      toast.error("Order is not currently out for delivery.")
      router.push("/orders")
      return 
    }

    if(!status){
      router.push("/orders")
      return 
    }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL, {
      auth: { token },
      path: '/socket.io',
      transports: ['websocket'],
    });

    socket.on('order_subscription_confirmed', () => {
      // console.log('Subscription confirmed:', data);
    });

    socket.on('delivery_tracking_started', (data) => {
      // console.log('Tracking started:', data);

      const decoded = data?.initialRoute?.decodedCoordinates as Coordinate[] | undefined;
      if (Array.isArray(decoded) && decoded.length > 0) {
        const path = decoded.map((coord) => ({
          lat: Number(coord.latitude),
          lng: Number(coord.longitude),
        }));
        applyRoutePath(path);
      }
    });

    socket.on('rider_location_update', (data) => {
      // console.log('Updated rider location:', data);

      const lat = Number(data.latitude);
      const lng = Number(data.longitude);
      const heading = typeof data.heading === 'number' ? data.heading : undefined;

      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        const target = { lat, lng };

        // Trim already-passed path before moving the marker
        trimRoutePathToPosition(target);

        if (isLoaded && mapRef.current) {
          updateRiderMarker(target, heading);
        } else {
          pendingRiderRef.current = target;
        }
      }
    });

    // Keep this handler in the same place as your original order.
    socket.on('route_calculated', (data) => {
      // console.log('Route Calculated:', data);

      if (routePathRef.current && routePathRef.current.length > 0) {
        return;
      }

      const decoded =
        (data && (data.route?.decodedCoordinates ?? data?.decodedCoordinates ?? data?.initialRoute?.decodedCoordinates)) ||
        undefined;

      if (Array.isArray(decoded) && decoded.length > 0) {
        const path = decoded.map((coord: Coordinate) => ({
          lat: Number(coord.latitude),
          lng: Number(coord.longitude),
        }));
        applyRoutePath(path);
      }
    });

    // socket.on('Route Calculated', (data) => {
    //   console.log('Route Calculated (alt event):', data);

    //   if (routePathRef.current && routePathRef.current.length > 0) return;

    //   const decoded =
    //     (data && (data.route?.decodedCoordinates ?? data?.decodedCoordinates ?? data?.initialRoute?.decodedCoordinates)) ||
    //     undefined;

    //   if (Array.isArray(decoded) && decoded.length > 0) {
    //     const path = decoded.map((coord: Coordinate) => ({
    //       lat: Number(coord.latitude),
    //       lng: Number(coord.longitude),
    //     }));
    //     applyRoutePath(path);
    //   }
    // });

    socket.on('route_updated', (data) => {
      // console.log('Route Updated:', data);
      const decoded =
        (data && (data.route?.decodedCoordinates ?? data?.initialRoute?.decodedCoordinates ?? data?.decodedCoordinates)) || undefined;
      if (Array.isArray(decoded) && decoded.length > 0) {
        const path = decoded.map((coord: Coordinate) => ({
          lat: Number(coord.latitude),
          lng: Number(coord.longitude),
        }));
        applyRoutePath(path);
      }
    });

    // When delivery tracking stops -> unsubscribe from order
    socket.on('delivery_completed', () => {
      // console.log('delivery_tracking_stopped:', data);
      try {
        socket.emit('unsubscribe_from_order', { orderId });
        // console.log('Emitted unsubscribe_from_order', { orderId });
      } catch (e) {
        toast.error('Failed to emit unsubscribe_from_order');
      }
    });

    // Listen for server ack of unsubscribe and navigate to /orders
    socket.on('order_unsubscribe_from_order', () => {
      // console.log('order_unsubscribe_from_order received:', data);
      // cleanup UI / state if needed
      applyRoutePath([]);
      toast.success("Delivery Completed")
      // navigate away
      try {
        router.push('/orders');
      } catch (e) {
        toast.error('Router navigation failed');
      }
    });

    socket.on('connect', () => {
      // console.log('Socket connected');
      socket.emit('subscribe_to_order', { orderId });
    });

    // socket.on('connect_error', (err) => {
    //   console.error('Socket connection error:', (err as any)?.message || err);
    // });

    socket.on('error', (err) => {
      // console.error('Socket error:', err);
      const message = (err && (err as any).message) ?? String(err ?? '');
      const normalized = String(message).toLowerCase();

      if (normalized.includes('order is not currently out for delivery')) {
        // show toast and navigate
        toast.error(message);
        try {
          router.push('/orders');
        } catch (e) {
          toast.error('Router navigation failed');
        }
      } else {
        // optional: show other errors as toast too (commented out)
        // showToast(message);
      }
    });

    return () => {
      socket.disconnect();
    };
    // keep same deps to avoid reordering socket creation
  }, [orderId, token, isLoaded, router]);
  // -------------------------------------------------------------------

  // create an initial advanced marker at the center (non-blocking)
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    (async () => {
      try {
        const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
        new AdvancedMarkerElement({
          map: mapRef.current!,
          position: mapCenter,
          title: `Tracking Order ${orderId}`,
        });
      } catch (err) {
        toast.error('Advanced marker library not available or failed:');
      }
    })();
  }, [isLoaded, mapCenter, orderId]);

  // When routePath updates, fit bounds so polyline is visible
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    if (!routePath || routePath.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    routePath.forEach((p) => bounds.extend(p));
    mapRef.current.fitBounds(bounds, 40);

    const listener = google.maps.event.addListenerOnce(mapRef.current, 'idle', () => {
      const currentZoom = mapRef.current!.getZoom() ?? 14;
      const minZoom = 10;
      if (currentZoom > 18) mapRef.current!.setZoom(18);
      if (currentZoom < minZoom) mapRef.current!.setZoom(minZoom);
      google.maps.event.removeListener(listener);
    });
  }, [isLoaded, routePath]);

  // If we received rider updates before map ready, create/update marker now
  useEffect(() => {
    if (isLoaded && mapRef.current && pendingRiderRef.current) {
      // also trim the path if needed
      trimRoutePathToPosition(pendingRiderRef.current);
      updateRiderMarker(pendingRiderRef.current);
      pendingRiderRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (riderAnimRef.current) cancelAnimationFrame(riderAnimRef.current);
      if (riderMarkerRef.current) {
        riderMarkerRef.current.setMap(null);
        riderMarkerRef.current = null;
      }
    };
  }, []);

  // helper to build a fully-typed google.maps.Symbol
  function buildRiderSymbol(rotationDeg = 0): google.maps.Symbol {
    const sym: google.maps.Symbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 6,
      rotation: rotationDeg,
      strokeColor: '#FF6B00',
      strokeWeight: 2,
      fillOpacity: 1,
    };
    return sym;
  }

  // helper: create or update rider marker with interpolation animation
  function updateRiderMarker(target: google.maps.LatLngLiteral, heading?: number) {
    if (!mapRef.current) {
      pendingRiderRef.current = target;
      return;
    }

    const iconSymbol = buildRiderSymbol(heading ?? 0);

    // create marker if doesn't exist
    if (!riderMarkerRef.current) {
      riderMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: target,
        title: 'Rider',
        icon: iconSymbol,
        zIndex: 9999,
      });
      lastRiderPosRef.current = target;
      return;
    }

    // animate from last pos to target
    const start = lastRiderPosRef.current ?? riderMarkerRef.current.getPosition()?.toJSON() ?? target;
    const duration = 600; // ms - tweak as needed
    const startTime = performance.now();

    if (riderAnimRef.current) {
      cancelAnimationFrame(riderAnimRef.current);
      riderAnimRef.current = null;
    }

    const animate = (time: number) => {
      const t = Math.min(1, (time - startTime) / duration);
      const lat = start.lat + (target.lat - start.lat) * t;
      const lng = start.lng + (target.lng - start.lng) * t;
      riderMarkerRef.current!.setPosition({ lat, lng });

      // update icon rotation explicitly with a fresh Symbol
      if (heading !== undefined) {
        const newSymbol = buildRiderSymbol(heading);
        riderMarkerRef.current!.setIcon(newSymbol);
      }

      if (t < 1) {
        riderAnimRef.current = requestAnimationFrame(animate);
      } else {
        lastRiderPosRef.current = target;
        riderAnimRef.current = null;
      }
    };

    riderAnimRef.current = requestAnimationFrame(animate);
  }

  if (!isLoaded) {
    return (
      <div className="w-full bg-gray-200 animate-pulse h-[25em] mt-4 flex justify-center items-center mx-auto">
        <Loader2 className="animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={14}
      onLoad={(map) => {
        mapRef.current = map;

        // flush pending rider if any
        if (pendingRiderRef.current) {
          trimRoutePathToPosition(pendingRiderRef.current);
          updateRiderMarker(pendingRiderRef.current);
          pendingRiderRef.current = null;
        }
      }}
      options={{
        gestureHandling: 'greedy',
        zoomControl: true,
        scrollwheel: true,
        draggable: true,
        disableDoubleClickZoom: false,
        fullscreenControl: false,
      }}
    >
      {routePath.length > 1 && (
        <>
          <Polyline
            path={routePath}
            options={{
              strokeColor: '#FF6B00',
              strokeOpacity: 0.8,
              strokeWeight: 4,
              geodesic: true,
            }}
          />

          <Marker position={routePath[0]} title="Start" label={{ text: 'S', fontWeight: 'bold' }} />

          <Marker position={routePath[routePath.length - 1]} title="Destination" label={{ text: 'D', fontWeight: 'bold' }} />
        </>
      )}
    </GoogleMap>
  );
}
