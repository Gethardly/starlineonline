import {createHash} from 'crypto';
import {HttpService} from '@nestjs/axios';
import {Injectable, Logger} from '@nestjs/common';
import type {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import FormData from 'form-data';
import {CookieJar} from 'tough-cookie';
import {wrapper} from 'axios-cookiejar-support';
import {
    Device,
    DevicePosition,
    DevicesResponse,
    GetCodeResponse,
    GetTokenResponse,
    SlnetResponse,
    UserLoginResponse,
} from './starline.types';
import {DevicesService} from "../devices/devices.service";

type AxiosRequestConfigWithRetry = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

type QueuedRequest = {
    resolve: (value: any) => void;
    reject: (error: any) => void;
};

interface AxiosWithCookies extends AxiosInstance {
    defaults: AxiosInstance['defaults'] & {
        jar?: CookieJar;
    };
}

@Injectable()
export class StarlineService {
    private readonly logger = new Logger(StarlineService.name);
    private jar!: CookieJar;
    private axiosWithCookies!: AxiosWithCookies;
    private isRefreshing = false;
    private refreshPromise: Promise<void> | null = null;
    private failedQueue: QueuedRequest[] = [];
    private userId = 7033451;
    private appId = 40734;
    private secret = 'TP_MU2cDncW-pSTmkAfVDhmB6LjAHU9l';
    private idStarlineUrl = 'https://id.starline.ru';
    private developerStarlineUrl = 'https://developer.starline.ru';

    constructor(private readonly httpService: HttpService, private readonly devicesService: DevicesService) {
        this.setupAxiosWithCookies();
    }

    private setupAxiosWithCookies() {
        this.jar = new CookieJar();

        const axiosInstance: AxiosInstance = axios.create({
            baseURL: this.developerStarlineUrl,
            withCredentials: true,
            timeout: 30000,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                Accept: 'application/json',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            },
        });

        this.axiosWithCookies = wrapper(axiosInstance) as AxiosWithCookies;
        this.axiosWithCookies.defaults.jar = this.jar;

        this.axiosWithCookies.interceptors.request.use(
            async (config) => {
                const cookies = await this.jar.getCookies(config.url || '');
                this.logger.debug(
                    `→ ${config.method?.toUpperCase()} ${config.url} | Cookies: ${cookies.length}`,
                );
                return config;
            },
            (error) => {
                return Promise.reject(
                    error instanceof Error ? error : new Error(String(error)),
                );
            },
        );

        this.axiosWithCookies.interceptors.response.use(
            (res) => {
                this.logger.debug(
                    `← ${res.config.method?.toUpperCase()} ${res.config.url} | Status: ${res.status}`,
                );
                return res;
            },
            async (error: AxiosError) => {
                const config = error.config as AxiosRequestConfigWithRetry | undefined;
                if (!config) {
                    this.logger.error('No config in error');
                    return Promise.reject(error);
                }

                const status = error.response?.status;
                this.logger.warn(
                    `← ${config.method?.toUpperCase()} ${config.url} | Status: ${status} | Retry: ${config._retry}`,
                );

                const authUrls = ['auth.slid', 'user/login', 'getCode', 'getToken'];
                const isAuthUrl = authUrls.some((url) => config.url?.includes(url));

                if (
                    [400, 401, 403].includes(status ?? 0) &&
                    !config._retry &&
                    !isAuthUrl
                ) {
                    config._retry = true;

                    if (this.isRefreshing && this.refreshPromise) {
                        this.logger.log('Добавляем запрос в очередь...');
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({resolve, reject});
                        }).then(() => {
                            this.logger.log('Повторяем запрос из очереди');
                            return this.axiosWithCookies(config);
                        });
                    }

                    this.logger.warn('Начинаем обновление авторизации...');
                    this.isRefreshing = true;
                    this.refreshPromise = this.getStarlineAuth()
                        .then(() => {
                            this.logger.log('Авторизация обновлена успешно');
                            this.processQueue(null);
                        })
                        .catch((err) => {
                            const errorMessage =
                                err instanceof Error ? err.message : String(err);
                            this.logger.error('Ошибка обновления авторизации:', errorMessage);
                            this.processQueue(err);
                            throw err instanceof Error ? err : new Error(String(err));
                        })
                        .finally(() => {
                            this.isRefreshing = false;
                            this.refreshPromise = null;
                        });

                    try {
                        await this.refreshPromise;
                        return this.axiosWithCookies(config);
                    } catch (refreshError) {
                        throw refreshError instanceof Error
                            ? refreshError
                            : new Error(String(refreshError));
                    }
                }

                throw error instanceof Error ? error : new Error(String(error));
            },
        );
    }

    private processQueue(error: any) {
        this.logger.log(`Обработка очереди: ${this.failedQueue.length} запросов`);
        this.failedQueue.forEach((promise) => {
            if (error) {
                promise.reject(error);
            } else {
                promise.resolve(undefined);
            }
        });

        this.failedQueue = [];
    }

    private async getStarlineAuth(): Promise<SlnetResponse> {
        this.logger.log('Начинаем процесс авторизации...');

        try {
            const md5Secret = createHash('md5').update(this.secret).digest('hex');
            const sha1Pass = 'ae5f5ed46f27290a04a20a7b8d139915eba41011';

            this.logger.debug('Шаг 1: Получаем code...');
            const {data: code} = await this.axiosWithCookies.get<GetCodeResponse>(
                `${this.idStarlineUrl}/apiV3/application/getCode`,
                {
                    params: {
                        appId: this.appId,
                        secret: md5Secret,
                    },
                },
            );
            this.logger.debug(`Code получен: ${code.desc.code}`);

            this.logger.debug('Шаг 2: Получаем token...');
            const md5SecretCode = createHash('md5')
                .update(`${this.secret}${code.desc.code}`)
                .digest('hex');
            const {data: tokenResponse} =
                await this.axiosWithCookies.get<GetTokenResponse>(
                    `${this.idStarlineUrl}/apiV3/application/getToken`,
                    {
                        params: {
                            appId: this.appId,
                            secret: md5SecretCode,
                        },
                    },
                );
            this.logger.debug('Token получен');

            this.logger.debug('Шаг 3: Авторизуемся пользователем...');
            const formData = new FormData();
            formData.append('login', 'chernyavskayayul@yandex.ru');
            formData.append('pass', sha1Pass);
            const {data: userToken} =
                await this.axiosWithCookies.post<UserLoginResponse>(
                    `${this.idStarlineUrl}/apiV3/user/login`,
                    formData,
                    {
                        headers: {
                            token: tokenResponse.desc.token,
                            ...formData.getHeaders(),
                        },
                    },
                );
            this.logger.debug(`User token получен для: ${userToken.desc.login}`);

            this.logger.debug('Шаг 4: Получаем SLNET cookie...');
            const {data: slnetFromCookie, headers} =
                await this.axiosWithCookies.post<SlnetResponse>('/json/v2/auth.slid', {
                    slid_token: userToken.desc.user_token,
                });

            const setCookieHeaders = headers['set-cookie'];
            if (setCookieHeaders) {
                this.logger.debug(
                    `Set-Cookie заголовки: ${JSON.stringify(setCookieHeaders)}`,
                );
            }

            const cookiesAfter = await this.jar.getCookies(this.developerStarlineUrl);
            this.logger.log(
                `Авторизация завершена | Cookies: ${cookiesAfter.map((c) => c.key).join(', ')}`,
            );

            for (const cookie of cookiesAfter) {
                this.logger.debug(
                    `Cookie: ${cookie.key} | Domain: ${cookie.domain} | Path: ${cookie.path} | Expires: ${cookie.expires.toString()}`,
                );
            }

            return slnetFromCookie;
        } catch (error) {
            this.logger.error('Ошибка авторизации:', error);
            throw error;
        }
    }

    async getDevicesList() {
        this.logger.log('Запрашиваем список устройств...');

        try {
            const cookiesBefore = await this.jar.getCookies(
                this.developerStarlineUrl,
            );
            this.logger.debug(
                `Cookies перед запросом: ${cookiesBefore.map((c) => c.key).join(', ')}`,
            );

            if (cookiesBefore.length === 0) {
                this.logger.warn('Нет cookies! Выполняем авторизацию...');
                await this.getStarlineAuth();
            }

            const {data: devicesList} =
                await this.axiosWithCookies.get<DevicesResponse>(
                    `/json/v1/user/${this.userId}/deviceList`,
                    {
                        params: {
                            imei: true,
                            alias: true,
                            //pos: true,
                            //status: true,
                        },
                    },
                );

            const createResults = await this.devicesService.upsertMany(devicesList.data.devices);

            //return devicesList;

            return createResults;
        } catch (error) {
            this.logger.error('Ошибка получения списка устройств:', error);
            throw error;
        }
    }

    async getDevicePosition(deviceId: string) {
        this.logger.log('Запрашиваем позицию устройства');

        try {
            const cookiesBefore = await this.jar.getCookies(
                this.developerStarlineUrl,
            );
            this.logger.debug(
                `Cookies перед запросом: ${cookiesBefore.map((c) => c.key).join(', ')}`,
            );

            if (cookiesBefore.length === 0) {
                this.logger.warn('Нет cookies! Выполняем авторизацию...');
                await this.getStarlineAuth();
            }

            const {data: devicePosition} =
                await this.axiosWithCookies.get<DevicePosition>(
                    `/json/v1/device/${deviceId}/position`
                );

            return devicePosition.device.position;
        } catch (error) {
            this.logger.error('Ошибка получения позиции устройства:', error);
            throw error;
        }
    }
}
