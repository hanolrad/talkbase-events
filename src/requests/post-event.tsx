const postEvent = () => new Promise((resolve, reject) => {
  const success = { code: 200, data: {} }

  if (!success) {
    return setTimeout(
      () => reject(new Error('Event creation failed')),
      1500
    );
  }

  setTimeout(() => resolve(success), 3500);
});

export default postEvent