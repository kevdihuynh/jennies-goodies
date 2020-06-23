import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Api } from '../api';
import { urls } from '../api.configs';
import { placeHolderReplace } from '../../utils';

export class GeocodeApi extends Api {
    public constructor (config?: AxiosRequestConfig) {
        super(config);
        this.getGeocode = this.getGeocode.bind(this);
    }

    public getExample(): Promise<any> {
        return this.get<any,AxiosResponse<any>>(`https://jsonplaceholder.typicode.com/todos/1`)
            .then(this.success)
    }

    public getGeocode(customerAddress: string): Promise<any> {
        const variables = {
            customerAddress,
        }
        const url = placeHolderReplace(urls.geocodeUrl, variables);
        return this.get<any,AxiosResponse<any>>(url)
            .then(this.success)
            .catch(this.error);
    }
}

export const geocodeApi = new GeocodeApi();