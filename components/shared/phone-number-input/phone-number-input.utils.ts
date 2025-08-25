// Utility functions

export const formatPhoneNumber = (value: string, format?: string): string => {
  if (!format) return value;

  const numbers = value.replace(/\D/g, '');
  let formatted = '';
  let numberIndex = 0;

  for (let i = 0; i < format.length && numberIndex < numbers.length; i++) {
    if (format[i] === '#') {
      formatted += numbers[numberIndex];
      numberIndex++;
    } else {
      formatted += format[i];
    }
  }

  return formatted;
};

export const isValidPhoneNumber = (phone: string, format?: string): boolean => {
  const numbers = phone.replace(/\D/g, '');
  const minLength = format ? format.replace(/[^#]/g, '').length : 7;
  return numbers.length >= minLength && numbers.length <= 15;
};

export const detectUserLocation = async (): Promise<string | null> => {
  try {
    return new Promise((resolve) => {
	  if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
		  () => resolve('US'), // Simulated result - you might want to use IP geolocation
		  () => resolve(null),
		  { timeout: 5000 }
        );
	  } else {
        resolve(null);
	  }
    });
  } catch {
    return null;
  }
};
