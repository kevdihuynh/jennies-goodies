import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Api } from '../api';
import { urls } from '../api.configs';
import { placeHolderReplace } from '../../utils';

export class PlacesApi extends Api {
    public constructor (config?: AxiosRequestConfig) {
        super(config);
        this.getAddresses = this.getAddresses.bind(this);
    }

    public getAddresses(address: string, sessiontoken: string): Promise<any> {
        const variables = {
            address,
            sessiontoken,
        }
        const url = placeHolderReplace(urls.placesUrl, variables);
        console.log(url);
        return this.get<any,AxiosResponse<any>>(url)
            .then(this.success)
            .catch(this.error);
    }
}

export const placesApi = new PlacesApi();