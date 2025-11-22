
import { TRANSPORT_MODES, COUNTRIES, CURRENCIES, WEIGHT_UNITS, PACKAGE_UNITS, MEASUREMENT_UNITS, THAI_LOCATIONS } from '../data/staticData';

// Data Access Layer (Simulated Database)

export const getTransportModes = () => TRANSPORT_MODES;

export const getCountries = () => COUNTRIES;

export const getCurrencies = () => CURRENCIES;

export const getWeightUnits = () => WEIGHT_UNITS;

export const getPackageUnits = () => PACKAGE_UNITS;

export const getMeasurementUnits = () => MEASUREMENT_UNITS;

export const getThaiLocations = () => THAI_LOCATIONS;
