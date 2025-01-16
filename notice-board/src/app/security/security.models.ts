export interface UserCredentialsDTO {
    email: string;
    password: string;
}

export interface AuthenticationResponseDTO {
    token: string;
    expiration: string;
}

export class ClaimTypes {
    static readonly userId = 'userId';
}