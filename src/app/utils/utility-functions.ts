import { environment } from '../../environments/environment';

const BASE_URL_DEV = 'http://localhost:5001/jennies-goodies/us-central1';
const BASE_URL_PROD = 'http://localhost:5002'; // TODO: change later once it is deployed

export const isDevMode = () => {
    return !environment.production;
};

export const getBaseUrl = () => {
    return isDevMode() ? BASE_URL_DEV : BASE_URL_PROD;
};

