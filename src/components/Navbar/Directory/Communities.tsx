import { Flex, Icon, MenuItem, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { GrAdd } from 'react-icons/gr';
import CreateCommunityModal from './CreateCommunity/CreateCommunityModal';

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />

      <MenuItem
        width='100%'
        _hover={{ bg: 'gray.200' }}
        onClick={() => setOpen(true)}
      >
        <Flex align='center'>
          <Icon as={GrAdd} fontSize={20} mr={2}></Icon>
          <Text fontSize='10pt'>Create Community</Text>
        </Flex>
      </MenuItem>
    </>
  );
};
export default Communities;
