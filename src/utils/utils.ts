export const v4 = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const truncateWords = (str: string, words: number) => {
  return str.split(" ").slice(0, words).join(" ");
};

export const createQueryString = (queryProps: Record<string, any>): string => {
  const queryStringParts: string[] = ["per_page=50"];
  Object.entries(queryProps).forEach(([key, value]) => {
    if (key === "page") {
      queryStringParts.push(`page=${value}`);
    } else if (key === "field" || key === "order") {
      queryStringParts.push(`sort[${key}]=${value}`);
    } else if (Array.isArray(value)) {
      value.forEach((val) => {
        queryStringParts.push(`filter[${key}][]=${val}`);
      });
    } else {
      queryStringParts.push(`filter[${key}]=${value}`);
    }
  });

  return queryStringParts.join("&");
};
export const stripHtml = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
