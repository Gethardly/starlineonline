export type DateTimeString =
  `${number}-${number}-${number} ${number}:${number}:${number}`;

export type StarlineResponse<T extends object> = {
  state: number;
  desc: T;
};

export interface UserLogin {
  id: number;
  login: string;
  state: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  company_name: string;
  sex: string | undefined;
  lang: string;
  gmt: string;
  avatar: string;
  date_register: DateTimeString;
  contacts: [
    {
      id: number;
      type: string;
      value: string;
      confirmed: string;
      token: string;
    },
  ];
  auth_contact_id: any;
  roles: string[];
  subscription: any;
  options: [];
  user_token: string;
  last_auth_date: DateTimeString;
  last_auth_ip: string;
}

export type GetCodeResponse = StarlineResponse<{ code: string }>;
export type GetTokenResponse = StarlineResponse<{ token: string }>;
export type UserLoginResponse = StarlineResponse<UserLogin>;

export interface SlnetResponse {
  code: number;
  codestring: string;
  nchan_id: string;
  realplexor_id: string;
  user_id: number;
}

export interface DevicesResponse {
  code: number;
  codestring: string;
  data: {
    devices: [
      {
        alias: string;
        device_id: number;
        pos: {
          dir: number;
          sat_qty: number;
          ts: number;
          x: number;
          y: number;
        };
        status: number;
      },
    ];
  };
}
