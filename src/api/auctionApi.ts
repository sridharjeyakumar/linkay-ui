import axiosInstance from './axiosInstance';

export interface CreateAuctionPayload {
  assetId: string;
  title: string;
  description?: string;
  fractionsAllocated: number;
  minPurchaseQty: number;
  maxPurchaseQty: number;
  startingBidPrice: number;
  reservePrice: number;
  minIncrement: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  showCountdown: boolean;
  status?: 'DRAFT' | 'SCHEDULED';
}

export interface UpdateAuctionPayload extends Partial<Omit<CreateAuctionPayload, 'assetId' | 'status'>> {}

export const auctionApi = {
  create: (payload: CreateAuctionPayload) =>
    axiosInstance.post('/api/v1/auctions', payload),

  list: (params?: { assetId?: string; status?: string }) =>
    axiosInstance.get('/api/v1/auctions', { params }),

  get: (auctionId: string) =>
    axiosInstance.get(`/api/v1/auctions/${auctionId}`),

  update: (auctionId: string, payload: UpdateAuctionPayload) =>
    axiosInstance.patch(`/api/v1/auctions/${auctionId}`, payload),

  patchStatus: (auctionId: string, status: string) =>
    axiosInstance.patch(`/api/v1/auctions/${auctionId}/status`, { status }),

  delete: (auctionId: string) =>
    axiosInstance.delete(`/api/v1/auctions/${auctionId}`),

  placeBid: (auctionId: string, payload: { bidderAddress: string; amount: string; txHash: string }) =>
    axiosInstance.post(`/api/v1/auctions/${auctionId}/bid`, payload),

  listBids: (auctionId: string) =>
    axiosInstance.get(`/api/v1/auctions/${auctionId}/bids`),

  getPublic: (auctionId: string) =>
    axiosInstance.get(`/api/v1/auctions/public/${auctionId}`),

  getWonAuctions: () =>
    axiosInstance.get('/api/v1/auctions/won'),
};
