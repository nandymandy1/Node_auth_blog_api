exports.userSanitization = user => {
  let { username, firstName, lastName, email, _id } = user;
  return {
    username,
    firstName,
    lastName,
    email,
    _id
  };
};
