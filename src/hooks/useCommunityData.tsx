import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '../atoms/authModalAtoms';
import {
  Community,
  communityState,
  UserCommunity,
} from '../atoms/communitiesAtom';
import { auth, fireStore } from '../firebase/clientApp';

const useCommunityData = () => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // check if user is logged in
    // if not open auth modal

    if (!user) {
      setAuthModalState({ open: true, view: 'login' });
      return;
    }

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getUserCommunities = async () => {
    setLoading(true);

    try {
      const path = `users/${user?.uid}/communities`;
      const data = await getDocs(collection(fireStore, path));

      const userCommunities = data.docs.map((doc) => ({
        ...doc.data(),
      }));

      setCommunityStateValue((prev) => ({
        ...prev,
        userCommunities: userCommunities as UserCommunity[],
      }));
    } catch (error: any) {
      console.log('getUserCommunities error', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const joinCommunity = async (community: Community) => {
    setLoading(true);

    try {
      // add community to userCommunities for user
      const newUserCommunity: UserCommunity = {
        communityId: community.id,
        imageURL: community.imageURL || '',
      };
      const batch = writeBatch(fireStore);
      const userCommunityDocRef = doc(
        fireStore,
        `users/${user?.uid}/communities`,
        community.id
      );
      batch.set(userCommunityDocRef, newUserCommunity);

      // update number of members of community
      const communityDocRef = doc(fireStore, 'communities', community.id);
      batch.update(communityDocRef, { numberOfMembers: increment(1) });

      // batch write
      await batch.commit();

      // update recoil state - communityState.userCommunities
      setCommunityStateValue((prev) => ({
        ...prev,
        userCommunities: [...prev.userCommunities, newUserCommunity],
      }));
    } catch (error: any) {
      console.log('Join community error', error);
      setError(error.message);
    }

    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    setLoading(true);

    try {
      const batch = writeBatch(fireStore);

      // remove community from userCommunities for user
      const userCommunityDocRef = doc(
        fireStore,
        `users/${user?.uid}/communities`,
        communityId
      );
      batch.delete(userCommunityDocRef);

      const communityDocRef = doc(fireStore, 'communities', communityId);
      batch.update(communityDocRef, { numberOfMembers: increment(-1) });

      // batch write
      await batch.commit();

      // update recoil state - communityState.userCommunities
      setCommunityStateValue((prev) => ({
        ...prev,
        userCommunities: prev.userCommunities.filter(
          (community) => community.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log('Leave communities error', error);
      setError(error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    getUserCommunities();
  }, [user]);

  return { communityStateValue, onJoinOrLeaveCommunity, loading };
};

export default useCommunityData;
