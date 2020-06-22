import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Api } from '../api';

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

    public getGeocode(start: any, finish: any): Promise<any> {
        return this.get<any,AxiosResponse<any>>(`https://jsonplaceholder.typicode.com/todos/1`)
            .then(this.success)
    }
}

export const geocodeApi = new GeocodeApi();