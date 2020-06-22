import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Api } from '../api';
import { GOOGLE_API_KEY } from '../api.configs';

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

    public getGeocode(start: any, finish: any): Promise<any> {
        return this.get<any,AxiosResponse<any>>(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${GOOGLE_API_KEY}`)
            .then(this.success)
    }
}

export const geocodeApi = new GeocodeApi();