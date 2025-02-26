
import { WorldMap } from "./world-map";
import { motion } from "framer-motion";
import { GradientHeading } from "./gradient-heading";

export function WorldMapSection() {
  return (
    <div className="w-full py-20 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <GradientHeading size="lg" weight="bold" className="mb-4">
            Trusted Globally
          </GradientHeading>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of job seekers worldwide who have successfully landed their dream jobs using our resume builder
          </p>
        </div>
        <WorldMap
          dots={[
            {
              start: { lat: 40.7128, lng: -74.006 }, // New York
              end: { lat: 51.5074, lng: -0.1278 }, // London
            },
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 48.8566, lng: 2.3522 }, // Paris
            },
            {
              start: { lat: 48.8566, lng: 2.3522 }, // Paris
              end: { lat: 52.52, lng: 13.405 }, // Berlin
            },
            {
              start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
              end: { lat: 22.3193, lng: 114.1694 }, // Hong Kong
            },
            {
              start: { lat: 1.3521, lng: 103.8198 }, // Singapore
              end: { lat: -33.8688, lng: 151.2093 }, // Sydney
            },
            {
              start: { lat: 37.7749, lng: -122.4194 }, // San Francisco
              end: { lat: 19.4326, lng: -99.1332 }, // Mexico City
            },
          ]}
        />
      </div>
    </div>
  );
}
