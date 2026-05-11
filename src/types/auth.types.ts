export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryOfResidence: string;
  role: string;
  isUser: boolean;
  isSuperAdmin: boolean;
  isMuseumUser: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  walletAddress: string | null;
  kycStatus: string;
  status: string;
}


export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
