import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Api } from '../api';
import { placeHolderReplace } from '../../Utilities/UtilityFunctions';
import { urls } from '../api.configs';

export class GeocodeApi extends Api {
    public constructor (config?: AxiosRequestConfig) {
        super(config);
        this.getGeocode = this.getGeocode.bind(this);
    }

    // public userRegister (user: User): Promise<number> {
    //     return this.post<number, User, AxiosResponse<number>>("https://www.domain.com/register", user)
    //         .then(this.success)
    //         .catch((error: AxiosError<Error>) => {
    //             throw error;
    //         });
    // }

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