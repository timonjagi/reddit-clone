import React from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { User } from 'firebase/auth';

type SearchInputProps = {
  user?: User | null;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  return (
    <Flex flexGrow={1} mr={2} align='center' maxWidth={user ? 'auto' : '600px'}>
      <InputGroup>
        <InputLeftElement pointerEvents='none'>
          <SearchIcon color='gray.300' />
        </InputLeftElement>
        <Input
          fontSize='10pt'
          _placeholder={{ color: 'gray.500' }}
          _hover={{
            bg: 'white',
            border: '1px solid',
            borderColor: 'blue.500',
          }}
          _focus={{
            outline: 'none',
            border: '1px solid',
            borderColor: 'blue.500',
          }}
          height='38px'
          bg='gray.50'
          placeholder='Search reddit'
        />
      </InputGroup>
    </Flex>
  );
};
export default SearchInput;
