export interface MapOrder {
  id: string;
  title: string;
  lat: number;
  lng: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  statusColor: string;
  customerName: string;
  orderNumber: string;
  totalAmount: number;
  createdAt: string;
  locationAddress: string;
}

export interface MapFilters {
  status: string;
  search: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface MapSettings {
  zoom: number;
  center: {
    lat: number;
    lng: number;
  };
  showLabels: boolean;
  clusterMarkers: boolean;
}

// Google Maps type declarations
declare global {
  interface Window {
    google: typeof google;
  }
}
