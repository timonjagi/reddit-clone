import { Timestamp } from '@google-cloud/firestore';
import { atom } from 'recoil';

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: 'public' | 'restricted' | 'private'
  createdAt?: Timestamp;
  imageURL?: string
}
export interface UserCommunity {
  communityId: string;
  isModerator?: string;
  imageURL?: string
}
interface CommunityState {
  userCommunities: UserCommunity[]
}

const defaultCommunityState: CommunityState = {
  userCommunities: []
}

export const communityState = atom<CommunityState>({
  key: 'communityState',
  default: defaultCommunityState
})
