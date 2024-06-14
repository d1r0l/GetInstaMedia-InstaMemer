const errorHandler = (error: unknown) => {
  if (process.env.NODE_ENV === 'production') {
    if (error instanceof Error) console.error('Error: ' + error.message);
    else console.log('Something went wrong.');
  } else {
    if (error instanceof Error) {
      console.error('<========== Error message start ==========>');
      console.error(error);
      console.error('<==========  Error message end  ==========>');
    }
  }
};

export default errorHandler;
