import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Input,
  Stack,
  Checkbox,
  Flex,
  Icon,
} from '@chakra-ui/react';
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';
import { auth, fireStore } from '../../../../firebase/clientApp';
type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose,
}) => {
  const [communityName, setCommunityName] = useState('');
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState('public');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [user] = useAuthState(auth);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // calc remaining chars in community name
    if (event.target.value.length > 21) {
      return;
    }
    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const onCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(event.target.name);
  };

  const handleCreateCommunity = async () => {
    setLoading(true);

    try {
      // check for valid community name
      const regex = /[ !@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]/g;
      if (regex.test(communityName) || communityName.length < 3) {
        throw new Error(
          'Community names must be between 3-21 characters and can only contain letters, numbers or underscores'
        );
      }

      // check if community exists
      const communityDocRef = doc(fireStore, 'communities', communityName);

      await runTransaction(fireStore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(
            `Sorry, r/${communityName} is already taken. Try another.`
          );
        }

        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        const userDocRef = doc(
          fireStore,
          `users/${user?.uid}/communities`,
          communityName
        );

        transaction.set(userDocRef, {
          communityId: communityName,
          isModerator: true,
        });
      });

      setError(' ');
    } catch (error: any) {
      console.log('handleCreateCommunity error', error);
      setError(error?.message);
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={open} onClose={handleClose} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          display='flex'
          flexDirection='column'
          fontSize={15}
          padding={3}
        >
          Create a community
        </ModalHeader>
        <Box paddingLeft={3} paddingRight={3}>
          <ModalCloseButton />
          <ModalBody display='flex' flexDirection='column' padding='10px 0'>
            <Text fontWeight={600} fontSize={15}>
              Name
            </Text>
            <Text fontSize={11} color='gray.500'>
              Community names including capitalization cannot be changed
            </Text>
            <Text
              position='relative'
              top='28px'
              left='10px'
              width='20px'
              color='gray.400'
            >
              r/
            </Text>
            <Input
              position='relative'
              value={communityName}
              size='sm'
              pl='22px'
              onChange={handleChange}
            />

            <Text
              color={charsRemaining === 0 ? 'red' : 'gray.500'}
              fontSize={9}
            >
              {charsRemaining} characters remaining
            </Text>

            <Text fontSize='9pt' color='red' pt={1}>
              {error}
            </Text>

            <Box mt={4} mb={4}>
              <Text fontWeight={600} fontSize={15}>
                Community Type
              </Text>

              <Stack spacing={2}>
                <Checkbox
                  name='public'
                  isChecked={communityType === 'public'}
                  onChange={onCommunityTypeChange}
                >
                  <Flex align='center'>
                    <Icon as={BsFillPersonFill} color='gray.500' mr={2} />
                    <Text fontSize='10pt' mr={2}>
                      Public
                    </Text>

                    <Text fontSize='8pt' color='gray.500'>
                      Anyone can view, post and comment to this community
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name='restricted'
                  isChecked={communityType === 'restricted'}
                  onChange={onCommunityTypeChange}
                >
                  <Flex align='center'>
                    <Icon as={BsFillEyeFill} color='gray.500' mr={2} />
                    <Text fontSize='10pt' mr={2}>
                      Restricted
                    </Text>

                    <Text fontSize='8pt' color='gray.500'>
                      Anyone can view this community but only approved users can
                      post
                    </Text>
                  </Flex>{' '}
                </Checkbox>
                <Checkbox
                  name='private'
                  isChecked={communityType === 'private'}
                  onChange={onCommunityTypeChange}
                >
                  <Flex align='center'>
                    <Icon as={BsFillEyeFill} color='gray.500' mr={2} />
                    <Text fontSize='10pt' mr={2}>
                      Private
                    </Text>

                    <Text fontSize='8pt' color='gray.500'>
                      Only approved users can view and submit to this community
                    </Text>
                  </Flex>{' '}
                </Checkbox>
              </Stack>
            </Box>
          </ModalBody>
        </Box>

        <ModalFooter bg='gray.100' borderRadius='0px 0px 10px 10px'>
          <Button variant='outline' height='30px' mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            height='30px'
            onClick={handleCreateCommunity}
            isLoading={loading}
          >
            Create community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default CreateCommunityModal;
