import React, { useEffect } from 'react';
import useQuery from './useQuery';

const Verify = () => {
  const query = useQuery();
  const token = query.get('token');
  console.log(token);
  useEffect(() => {}, []);
  return <>Verify</>;
};

export default Verify;
