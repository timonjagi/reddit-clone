import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { Community } from '../../../atoms/communitiesAtom';
import { fireStore } from '../../../firebase/clientApp';
import safeJsonStringify from 'safe-json-stringify';
import Communities from '../../../components/Navbar/Directory/Communities';
import CommunityNotFound from '../../../components/Community/CommunityNotFound';
import Header from '../../../components/Community/Header';
import PageContent from '../../../components/Layout/PageContent';

type communityPageProps = {
  communityData: Community;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      fireStore,
      'communities',
      context.query.communityId as string
    );

    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : '',
      },
    };
  } catch (error) {
    console.log('getServerSideProps error', error);
  }
}

const communityPage: React.FC<communityPageProps> = ({ communityData }) => {
  console.log(communityData);
  if (!communityData) {
    return <CommunityNotFound />;
  }
  return (
    <>
      <Header communityData={communityData} />

      <PageContent>
        <>
          <div>Left hand side</div>
          <div>Left hand side</div>
          <div>Left hand side</div>
          <div>Left hand side</div>
          <div>Left hand side</div>
        </>
        <>
          <div>Right hand side</div>
        </>
      </PageContent>
    </>
  );
};

export default communityPage;
