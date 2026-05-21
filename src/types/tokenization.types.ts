export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type StepStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface TokenizationStep {
  status: StepStatus;
  txHash?: string;
  contractAddress?: string;
  tokenId?: number;
  cid?: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface TokenizationSteps {
  ipfs:          TokenizationStep;
  mintNFT:       TokenizationStep;
  deployToken:   TokenizationStep;
  mintFractions: TokenizationStep;
  setCompliance: TokenizationStep;
}

export interface TokenizationJob {
  jobId:       string;
  assetId:     string;
  assetTitle?: string;
  assetType?:  string;
  status:      JobStatus;
  steps:       TokenizationSteps;
  error?:      string | null;
  completedAt?: string;
  createdAt?:   string;
}

export interface TokenizationState {
  jobs:    TokenizationJob[];
  loading: boolean;
  error:   string | null;
}
