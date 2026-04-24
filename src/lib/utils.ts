import dayjs from "dayjs";
import Toast from "react-native-toast-message";

/**
 * Formats a number into a currency string.
 *
 * @param value - The numeric value to format
 * @param currency - Currency code (e.g., USD, INR)
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */


export const formatCurrency = (value: number, currency = "USD"): string => {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    } catch {
        return value.toFixed(2);
    }
};

export const formatSubscriptionDateTime = (value?: string): string => {
    if (!value) return "Not provided";
    const parsedDate = dayjs(value);
    return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
    if (!value) return "Unknown";
    const normalized = value.trim().toLowerCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const showSuccessToast = (message: string) => {
    Toast.show({
        type: 'success',
        text1: 'Success',
        text2: message,
    });
};

export const showErrorToast = (message: string) => {
    Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
    });
};