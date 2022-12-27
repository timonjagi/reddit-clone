import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtoms';
import { auth } from '../../../firebase/clientApp';
import { FIREBASE_ERRORS } from '../../../firebase/errors';

type LoginProps = {
  //user
};

const Login: React.FC<LoginProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signInWithEmailAndPassword(loginForm.email, loginForm.password);
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

      <Text textAlign='center' color='red' fontSize='10pt'>
        {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>

      <Button
        width='100%'
        height='36px'
        mt={2}
        mb={2}
        type='submit'
        isLoading={loading}
      >
        Log In
      </Button>

      <Flex justifyContent='center' mb={2}>
        <Text fontSize='9pt' mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize='9pt'
          color='blue.500'
          cursor='pointer'
          onClick={() =>
            setAuthModalState((prev) => ({ ...prev, view: 'resetPassword' }))
          }
        >
          Reset
        </Text>
      </Flex>

      <Flex fontSize='9pt' justifyContent='center'>
        <Text mr={1}>New Here?</Text>
        <Text
          color='blue.500'
          fontWeight={700}
          cursor='pointer'
          onClick={() =>
            setAuthModalState((prev) => ({ ...prev, view: 'signup' }))
          }
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
};
export default Login;
