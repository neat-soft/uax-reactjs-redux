const type = {
  base: 'TitilliumWeb-Regular',
  light: 'TitilliumWeb-Light',
  bold: 'TitilliumWeb-Bold',
  emphasis: 'TitilliumWeb-SemiBold',
};

const size = {
  h1: 58,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 20,
  h6: 19,
  input: 18,
  regular: 17,
  normal: 16,
  medium: 14,
  small: 12,
  mini: 10,
  tiny: 8.5,
};

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1,
    backgroundColor: 'transparent',
  },
  h2: {
    fontWeight: 'bold',
    fontSize: size.h2,
    backgroundColor: 'transparent',
  },
  h3: {
    fontFamily: type.emphasis,
    fontSize: size.h3,
    backgroundColor: 'transparent',
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4,
    backgroundColor: 'transparent',
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5,
    backgroundColor: 'transparent',
  },
  h6: {
    fontFamily: type.emphasis,
    fontSize: size.h6,
    backgroundColor: 'transparent',
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular,
    backgroundColor: 'transparent',
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontFamily: type.bold,
    fontSize: 15,
  },
  titleText: {
    fontFamily: type.emphasis,
    fontSize: size.input,
    backgroundColor: 'transparent',
  },
};

export default {
  type,
  size,
  style,
};
