import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, fireStore } from '../../../firebase/clientApp';
import { FIREBASE_ERRORS } from '../../../firebase/errors';

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  // const createUserDocument = async (user: User) => {
  //   const userDocRef = doc(fireStore, 'users', user.id);
  //   await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  // };

  // useEffect(() => {
  //   if (userCred) {
  //     createUserDocument(userCred.user);
  //   }
  // }, [userCred]);

  return (
    <Flex direction='column' width='100%' mb={4}>
      <Button
        variant='oauth'
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image
          src='/images/googlelogo.png'
          height='20px'
          alt='Continue with Google'
          mr={4}
        ></Image>
        Continue with Google
      </Button>
      <Text textAlign='center' color='red' fontSize='10pt'>
        {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>{' '}
    </Flex>
  );
};
export default OAuthButtons;
