import dayjs from "dayjs"

export const formatCurrencyCompact = (value) => {
  if (value === null || value === undefined) return "₦0";

  const num = Number(value);

  if (num >= 1_000_000_000) {
    const formatted = (num / 1_000_000_000).toFixed(3);
    return "₦" + (formatted.endsWith(".000") ? formatted.slice(0, -4) : formatted) + "B";
  }

  if (num >= 1_000_000) {
    const formatted = (num / 1_000_000).toFixed(3);
    return "₦" + (formatted.endsWith(".000") ? formatted.slice(0, -4) : formatted) + "M";
  }

  if (num >= 1_000) {
    const formatted = (num / 1_000).toFixed(3);
    return "₦" + (formatted.endsWith(".000") ? formatted.slice(0, -4) : formatted) + "K";
  }

  // For numbers < 1000, show up to 3 decimal places
  const formatted = num.toFixed(3);
  return "₦" + (formatted.endsWith(".000") ? formatted.slice(0, -4) : formatted);
};


export const formatCurrency = (value) => {
  return "₦" + Number(value || 0).toLocaleString()
}

export const formatNumber = (value) => {
  return Number(value || 0).toLocaleString()
}

export const formatDate = (date) => dayjs(date).format("MMM DD, YYYY")