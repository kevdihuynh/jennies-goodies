import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Api } from '../api';
import { urls, ORIGIN_LAT, ORIGIN_LON } from '../api.configs';
import { placeHolderReplace } from '../../Utilities/UtilityFunctions';

export class DistanceMatrixApi extends Api {
    public constructor (config?: AxiosRequestConfig) {
        super(config);
        this.getDistance = this.getDistance.bind(this);
    }

    public getDistance(customerLat: number, customerLon: number): Promise<any> {
        const variables = {
            origins: `${ORIGIN_LAT},${ORIGIN_LON}`,
            destinations: `${customerLat},${customerLon}`,
        };

        const url = placeHolderReplace(urls.matrixDistanceUrl, variables);
        return this.get<any,AxiosResponse<any>>(url)
            .then(this.success)
            .catch(this.error);
    }
}

export const distanceMatrixApi = new DistanceMatrixApi();