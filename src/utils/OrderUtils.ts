export const setOrderValue = (orders, columns) => {
  return orders.map((order) => {
    columns.forEach((col) => {
      if (col.key === "order_status_id") {
        order[col.key] = order["status"] || "";
      } else if (col.key === "get_order_documents") {
        order[col.key] = order["offer_number"] || "";
      } else if (col.key === "get_customer") {
        order[col.key] = order["customer_name"] || "";
      } else if (col.key === "category_name") {
        order[col.key] = order["category"] ? order["category"].name || "" : "";
      } else if (col.key === "order_application_status_id") {
        order[col.key] = order["application_status"] || "";
      } else {
        order[col.key] = order[col.key] || "";
      }
    });
    order.isPinned = order["is_pinned"];
    return order;
  });
};

export const getOrderField = (headerName) => {
  // if (headerName === "order_status_id") {
  //   return "status";
  // } else
  if (headerName === "get_order_documents") {
    return "offer_subject";
  } else if (headerName === "get_customer") {
    return "customer";
  }
  //  else if (headerName === "category_name") {
  //   return "category";
  // }
  // else if (headerName === "order_application_status_id") {
  //   return "application_status";
  // }
  else {
    return headerName;
  }
};
const cordinate = [
  { lat: 52.610876, lng: 13.351974 },
  { lat: 52.494507, lng: 13.126959 },
  { lat: 52.673422, lng: 13.315667 },
  { lat: 52.373556, lng: 13.274414 },
  { lat: 52.517424, lng: 13.44942 },
  { lat: 52.365528, lng: 13.286172 },
  { lat: 52.608357, lng: 13.359559 },
  { lat: 52.668128, lng: 13.521117 },
  { lat: 52.400886, lng: 13.57317 },
  { lat: 52.577325, lng: 13.101784 },
  { lat: 52.505683, lng: 13.717457 },
  { lat: 52.592629, lng: 13.682883 },
  { lat: 52.577596, lng: 13.242732 },
  { lat: 52.389883, lng: 13.374062 },
  { lat: 52.535697, lng: 13.436897 },
  { lat: 52.512219, lng: 13.372238 },
  { lat: 52.615163, lng: 13.270562 },
  { lat: 52.417956, lng: 13.330856 },
  { lat: 52.370983, lng: 13.71544 },
  { lat: 52.556836, lng: 13.191546 },
  { lat: 52.573073, lng: 13.093422 },
  { lat: 52.396784, lng: 13.595581 },
  { lat: 52.340423, lng: 13.510875 },
  { lat: 52.474448, lng: 13.607429 },
  { lat: 52.544552, lng: 13.228446 },
  { lat: 52.636228, lng: 13.161574 },
  { lat: 52.518024, lng: 13.32383 },
  { lat: 52.446885, lng: 13.461025 },
  { lat: 52.384305, lng: 13.313445 },
  { lat: 52.420994, lng: 13.594996 },
  { lat: 52.618868, lng: 13.5253 },
  { lat: 52.336325, lng: 13.358592 },
  { lat: 52.430104, lng: 13.118364 },
  { lat: 52.561532, lng: 13.34778 },
  { lat: 52.6489, lng: 13.565211 },
  { lat: 52.416806, lng: 13.517841 },
  { lat: 52.451753, lng: 13.479945 },
  { lat: 52.602048, lng: 13.337342 },
  { lat: 52.464076, lng: 13.739514 },
  { lat: 52.612447, lng: 13.609698 },
  { lat: 52.357061, lng: 13.094563 },
  { lat: 52.643619, lng: 13.565369 },
  { lat: 52.548624, lng: 13.545419 },
  { lat: 52.552306, lng: 13.493354 },
  { lat: 52.62506, lng: 13.190985 },
  { lat: 52.365729, lng: 13.16092 },
  { lat: 52.499702, lng: 13.445106 },
  { lat: 52.595644, lng: 13.559552 },
  { lat: 52.573816, lng: 13.507357 },
  { lat: 52.397453, lng: 13.206291 },
  { lat: 52.560919, lng: 13.141536 },
  { lat: 52.451502, lng: 13.293369 },
  { lat: 52.464557, lng: 13.503165 },
  { lat: 52.560292, lng: 13.457825 },
  { lat: 52.437102, lng: 13.566954 },
  { lat: 52.67305, lng: 13.191776 },
  { lat: 52.423615, lng: 13.108821 },
  { lat: 52.656931, lng: 13.727922 },
  { lat: 52.373999, lng: 13.472392 },
  { lat: 52.399098, lng: 13.096373 },
  { lat: 52.604366, lng: 13.203317 },
  { lat: 52.371714, lng: 13.240226 },
  { lat: 52.589789, lng: 13.634929 },
  { lat: 52.516039, lng: 13.294888 },
  { lat: 52.537126, lng: 13.726269 },
  { lat: 52.341547, lng: 13.619903 },
  { lat: 52.583295, lng: 13.214127 },
  { lat: 52.662724, lng: 13.414354 },
  { lat: 52.561806, lng: 13.301746 },
  { lat: 52.480337, lng: 13.534747 },
  { lat: 52.369414, lng: 13.330035 },
  { lat: 52.638502, lng: 13.400555 },
  { lat: 52.67556, lng: 13.319654 },
  { lat: 52.567467, lng: 13.283673 },
  { lat: 52.663464, lng: 13.500837 },
  { lat: 52.615434, lng: 13.225114 },
  { lat: 52.41591, lng: 13.737324 },
  { lat: 52.64673, lng: 13.346724 },
  { lat: 52.630139, lng: 13.57399 },
  { lat: 52.588105, lng: 13.323847 },
  { lat: 52.339158, lng: 13.436208 },
  { lat: 52.545225, lng: 13.124776 },
  { lat: 52.405868, lng: 13.239391 },
  { lat: 52.585928, lng: 13.189217 },
  { lat: 52.375672, lng: 13.587467 },
  { lat: 52.366626, lng: 13.647503 },
  { lat: 52.510289, lng: 13.530267 },
  { lat: 52.583987, lng: 13.279027 },
  { lat: 52.559859, lng: 13.226145 },
  { lat: 52.419102, lng: 13.577632 },
  { lat: 52.411932, lng: 13.364419 },
  { lat: 52.390082, lng: 13.478416 },
  { lat: 52.627819, lng: 13.236939 },
  { lat: 52.390392, lng: 13.478672 },
  { lat: 52.530574, lng: 13.548696 },
  { lat: 52.342699, lng: 13.515674 },
  { lat: 52.633338, lng: 13.130528 },
  { lat: 52.626008, lng: 13.590449 },
  { lat: 52.627995, lng: 13.601385 },
  { lat: 52.424127, lng: 13.364487 },
];

export const getLocation = (index) => {
  return cordinate[index];
};
