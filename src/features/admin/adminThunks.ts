import { createAsyncThunk } from '@reduxjs/toolkit';
import { assetApi } from '@/api/assetApi';
import { adminApi } from '@/api/adminApi';
import { tokenizationApi } from '@/api/tokenizationApi';
import type { PendingAsset, AdminStats, FullAssetDetail } from './adminSlice';

function extractMsg(err: unknown): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
    'Operation failed'
  );
}

export const fetchAdminQueueThunk = createAsyncThunk<PendingAsset[], void, { rejectValue: string }>(
  'admin/fetchQueue',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await assetApi.listAll({ tokenizationStatus: 'TREASURY_PENDING', limit: '100' });
      const rows = data?.data?.rows ?? data?.data ?? [];
      return (rows.map((a: Record<string, unknown>) => ({
        id:               a.id as string,
        title:            (a.title as string) ?? 'Untitled',
        valuation:        a.valuation != null ? Number(a.valuation) : null,
        assetType:        (a.assetType ?? a.asset_type) as string | null,
        description:      (a.description as string) ?? null,
        certificationRef: (a.certificationRef ?? a.certification_ref) as string | null,
        totalFractions:   (a.totalFractions ?? a.total_fractions) != null ? Number(a.totalFractions ?? a.total_fractions) : null,
        mediaFiles:       (a.mediaFiles ?? a.media_files) as unknown[] ?? [],
        ownerName:        (a.createdByName as string | null) || 'Unknown',
        dynamicFields:    (a.dynamicFields ?? []) as Array<{ fieldKey: string; fieldValue: unknown }>,
        tokenization:     (a.tokenization ?? null) as PendingAsset['tokenization'],
      })) as PendingAsset[]).filter(
        (a) =>
          a.tokenization?.tokenizationStatus !== 'TREASURY_APPROVED' &&
          a.tokenization?.tokenizationStatus !== 'TREASURY_REJECTED',
      );
    } catch (err) {
      return rejectWithValue(extractMsg(err));
    }
  },
);

export const fetchAdminStatsThunk = createAsyncThunk<AdminStats, void>(
  'admin/fetchStats',
  async () => {
    const [assetRes, authRes] = await Promise.allSettled([
      assetApi.adminStats(),
      adminApi.getAuthStats(),
    ]);

    const assetData = assetRes.status === 'fulfilled' ? (assetRes.value.data?.data ?? {}) : {};
    const authData  = authRes.status  === 'fulfilled' ? (authRes.value.data?.data  ?? {}) : {};

    return {
      pendingTreasuryCount:  Number(assetData.pendingTreasuryCount  ?? 0),
      liveAuctionsCount:     Number(assetData.liveAuctionsCount     ?? 0),
      totalAssetsCount:      Number(assetData.totalAssetsCount      ?? 0),
      totalAssetValue:       Number(assetData.totalAssetValue       ?? 0),
      museumAdminCount:      Number(authData.museumAdminCount       ?? 0),
      verifiedInvestorCount: Number(authData.verifiedInvestorCount  ?? 0),
    };
  },
);

export const approveTreasuryThunk = createAsyncThunk<void, string, { rejectValue: string }>(
  'admin/approveTreasury',
  async (assetId, { rejectWithValue }) => {
    try {
      await tokenizationApi.treasuryReview(assetId, 'approve');
    } catch (err) {
      return rejectWithValue(extractMsg(err));
    }
  },
);

export const rejectTreasuryThunk = createAsyncThunk<
  void,
  { assetId: string; reason: string },
  { rejectValue: string }
>(
  'admin/rejectTreasury',
  async ({ assetId, reason }, { rejectWithValue }) => {
    try {
      await tokenizationApi.treasuryReview(assetId, 'reject', reason);
    } catch (err) {
      return rejectWithValue(extractMsg(err));
    }
  },
);

export const fetchFullAssetThunk = createAsyncThunk<FullAssetDetail, string, { rejectValue: string }>(
  'admin/fetchFullAsset',
  async (assetId, { rejectWithValue }) => {
    try {
      const { data } = await assetApi.getAsset(assetId);
      const a = data?.data ?? data;
      return {
        id:               a.id as string,
        title:            (a.title as string) ?? 'Untitled',
        assetType:        (a.assetType ?? a.asset_type) as string | null,
        description:      (a.description as string) ?? null,
        valuation:        a.valuation != null ? Number(a.valuation) : null,
        jurisdiction:     (a.jurisdiction as string) ?? null,
        custodian:        (a.custodian as string) ?? null,
        ownershipEntity:  (a.ownershipEntity ?? a.ownership_entity) as string | null,
        historicalContext:(a.historicalContext ?? a.historical_context) as string | null,
        conditionReport:  (a.conditionReport ?? a.condition_report) as string | null,
        totalFractions:   (a.totalFractions ?? a.total_fractions) != null ? Number(a.totalFractions ?? a.total_fractions) : null,
        tokenizedPercent: (a.tokenizedPercent ?? a.tokenized_percent) != null ? Number(a.tokenizedPercent ?? a.tokenized_percent) : null,
        retainedPercent:  (a.retainedPercent  ?? a.retained_percent)  != null ? Number(a.retainedPercent ?? a.retained_percent)   : null,
        pricePerFraction: (a.pricePerFraction ?? a.price_per_fraction) != null ? Number(a.pricePerFraction ?? a.price_per_fraction) : null,
        royaltyPercent:   (a.royaltyPercent   ?? a.royalty_percent)   != null ? Number(a.royaltyPercent ?? a.royalty_percent)      : null,
        royaltyWallet:    (a.royaltyWallet    ?? a.royalty_wallet)    as string | null,
        certificationRef: (a.certificationRef ?? a.certification_ref) as string | null,
        mediaFiles:       (a.mediaFiles ?? a.media_files) ?? [],
        dynamicFields:    (a.dynamicFields ?? a.dynamic_fields ?? []) as Array<{ fieldKey: string; fieldValue: unknown }>,
        ownershipSplit:   ((a.ownershipSplit ?? a.ownership_split ?? []) as Array<Record<string, unknown>>).map((o) => ({
          ownerName:  (o.ownerName  ?? o.owner_name)  as string,
          ownerType:  (o.ownerType  ?? o.owner_type)  as string,
          percentage: Number(o.percentage),
        })),
        tokenization:     (a.tokenization ?? null) as FullAssetDetail['tokenization'],
      };
    } catch (err) {
      return rejectWithValue(extractMsg(err));
    }
  },
);
