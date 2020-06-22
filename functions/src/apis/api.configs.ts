import * as qs from "qs";
import { PathLike } from "fs";


export const GOOGLE_API_KEY = 'AIzaSyDmGIVY1COhYIaG8llvdXMTUlERkeaozig';
export const API_BASE_URL = "https://jsonplaceholder.typicode.com/";

// this will be set to Rob's house
export const ORIGIN_LAT = 47.727030;
export const ORIGIN_LON = -122.299520;

export const urls = {
    matrixDistanceUrl: `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&key=${GOOGLE_API_KEY}&origins=[[origins]]&destinations=[[destinations]]`,
    geocodeUrl: `https://maps.googleapis.com/maps/api/geocode/json?address=[[customerAddress]]&key=${GOOGLE_API_KEY}`
}

export const apiConfig = {
    returnRejectedPromiseOnError: true,
    withCredentials: true,
    timeout: 30000,
    baseURL: API_BASE_URL,
    headers: {
        common: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    },
    paramsSerializer: (params: PathLike) => qs.stringify(params, { indices: false }),
}