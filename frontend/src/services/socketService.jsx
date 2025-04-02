// SocketProvider.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeSocket, disconnectSocket } from '../Store/socketSlice';
import { toast } from 'react-toastify';

export const SocketProvider = ({ children, serverUrl }) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    toast.info('Connecting to ride service...');
    
    dispatch(initializeSocket(serverUrl))
      .unwrap()
      .then(() => {
        toast.success('Connected to ride service');
      })
      .catch((error) => {
        toast.error(`Connection failed: ${error}`);
      });
    
    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch, serverUrl]);
  
  return children;
};