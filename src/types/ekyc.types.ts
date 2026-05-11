export interface EkycState {
  sdkToken: string | null;
  applicantId: string | null;
  kycStatus: 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESUBMIT_REQUIRED' | null;
  loading: boolean;
  error: string | null;
}
