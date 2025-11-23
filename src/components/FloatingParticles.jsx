import React, { useEffect } from 'react';
import { View, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const FloatingParticles = () => {
  const particles = [...Array(15)].map((_, i) => {
    const left = new Animated.Value(Math.random() * width);
    const top = new Animated.Value(Math.random() * height);
    
    useEffect(() => {
      const animateParticle = () => {
        Animated.sequence([
          Animated.timing(top, {
            toValue: Math.random() * height,
            duration: 10000 + Math.random() * 5000,
            useNativeDriver: false,
          }),
          Animated.timing(left, {
            toValue: Math.random() * width,
            duration: 10000 + Math.random() * 5000,
            useNativeDriver: false,
          })
        ]).start(() => animateParticle());
      };
      
      const timeout = setTimeout(animateParticle, Math.random() * 5000);
      return () => clearTimeout(timeout);
    }, []);

    return (
      <Animated.View
        key={i}
        style={[
          styles.particle,
          {
            left,
            top,
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            opacity: Math.random() * 0.6 + 0.2,
          }
        ]}
      />
    );
  });

  return <View style={styles.particles}>{particles}</View>;
};

const styles = {
  particles: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 50,
  },
};

export default FloatingParticles;

