import Parse from 'parse/react-native';

export function getCurrentUser() {
  return Parse.User.currentAsync().then((currentUser) => {
    if (currentUser) {
      return currentUser;
    }

    const user = new Parse.User();
    const newEmail = `todos-${Math.floor(Math.random() * 1000000)}@gmail.com`;
    user.set('username', newEmail);
    user.set('email', newEmail);
    user.set('password', 'password');
    return user.signUp(null);
  }).then(user => user, error => error);
}

export function addItem() {
  var Todo = Parse.Object.extend("Todo");
  var row = new Todo();
  row.set('text', 'yayeeeee!!!!!');
  row.set('isComplete', false);
  row.save(null, {
    success(row) {
      console.log('added row id:' + row.id);
      return true;
    },
    error(row, error) {
      console.log(error.message);
      return false;
    },
  });
}
