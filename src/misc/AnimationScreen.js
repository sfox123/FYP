import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Animation from '../components/Animation';

const AnimationScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/Home');
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return <Animation />;
};

export default AnimationScreen;