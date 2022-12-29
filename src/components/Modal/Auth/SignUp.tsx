import { Input, Button, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtoms';
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { auth, fireStore } from '../../../firebase/clientApp';
import { FIREBASE_ERRORS } from '../../../firebase/errors';
import { User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';

const SignUp: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const [createUserWithEmailAndPassword, userCred, loading, authError] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (signUpForm.password !== signUpForm.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (error) setError('');

    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  // const createUserDocument = async (user: User) => {
  //   const coll = collection(fireStore, 'users');
  //   await addDoc(coll, JSON.parse(JSON.stringify(user)));
  // };

  // useEffect(() => {
  //   if (userCred) {
  //     createUserDocument(userCred.user);
  //   }
  // }, [userCred]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name='email'
        placeholder='Email'
        type='email'
        mb={2}
        onChange={onChange}
        fontSize='10pt'
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'brand.100' }}
        _focus={{
          bg: 'white',
          outline: 'none',
          border: '1px solid',
          borderColor: 'brand.100',
        }}
        bg='gray.50'
      ></Input>

      <Input
        required
        name='password'
        placeholder='Password'
        type='password'
        onChange={onChange}
        mb={2}
        fontSize='10pt'
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'brand.100' }}
        _focus={{
          bg: 'white',
          outline: 'none',
          border: '1px solid',
          borderColor: 'brand.100',
        }}
        bg='gray.50'
      ></Input>

      <Input
        required
        name='confirmPassword'
        placeholder='Confirm Password'
        type='password'
        onChange={onChange}
        mb={2}
        fontSize='10pt'
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'brand.100' }}
        _focus={{
          bg: 'white',
          outline: 'none',
          border: '1px solid',
          borderColor: 'brand.100',
        }}
        bg='gray.50'
      ></Input>

      <Text textAlign='center' color='red' fontSize='10pt'>
        {error ||
          FIREBASE_ERRORS[authError?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>

      <Button
        width='100%'
        height='36px'
        mt={2}
        mb={2}
        type='submit'
        isLoading={loading}
      >
        Sign Up
      </Button>

      <Flex fontSize='9pt' justifyContent='center'>
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color='blue.500'
          fontWeight={700}
          cursor='pointer'
          onClick={() =>
            setAuthModalState((prev) => ({ ...prev, view: 'login' }))
          }
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};
export default SignUp;
